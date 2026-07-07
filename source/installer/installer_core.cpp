#include "installer/installer_core.hpp"
#include <stdio.h>
#include <cstring>
#include <algorithm>
#include <mutex>
#include <stdarg.h>

#include "yati/yati.hpp"

namespace Installer {

static std::mutex g_console_mutex;

void Core::LockConsole() {
    g_console_mutex.lock();
}

void Core::UnlockConsole() {
    g_console_mutex.unlock();
}

void Core::SafePrintf(const char* format, ...) {
    std::lock_guard<std::mutex> lock(g_console_mutex);
    va_list args;
    va_start(args, format);
    vprintf(format, args);
    va_end(args);
}

Core::Core() {
}

Core::~Core() {
    if (m_installer_thread.joinable()) {
        m_stream_error = true;
        m_stream_cv.notify_all();
        m_installer_thread.join();
    }
}

bool Core::StartInstallation(const std::string& filename) {
    if (m_installer_thread.joinable()) {
        m_installer_thread.join();
    }

    m_filename = filename;
    m_total_bytes_written = 0;
    m_stream_buffer.clear();
    m_stream_eof = false;
    m_stream_error = false;
    m_installation_finished = false;
    
    m_source = std::make_unique<MtpSource>(this);
    
    SafePrintf("Installer Core: Started for %s\n", filename.c_str());
    
    m_installer_thread = std::thread(&Core::InstallerThreadEntry, this);
    
    return true;
}

bool Core::WriteData(const void* data, size_t size) {
    std::unique_lock<std::mutex> lock(m_stream_mutex);
    
    if (m_stream_error || m_stream_eof) return false;
    if (m_installation_finished) return true; // Discard data and pretend it was written to avoid MTP error

    // Wait until buffer has space (limit to 16MB buffer)
    m_stream_cv.wait(lock, [this]() {
        return m_stream_error || m_stream_buffer.size() < 16 * 1024 * 1024 || m_installation_finished;
    });

    if (m_stream_error) return false;
    if (m_installation_finished) return true;

    const u8* u8_data = static_cast<const u8*>(data);
    m_stream_buffer.insert(m_stream_buffer.end(), u8_data, u8_data + size);
    m_total_bytes_written += size;
    
    m_stream_cv.notify_one();
    return true;
}

void Core::FinishInstallation() {
    {
        std::lock_guard<std::mutex> lock(m_stream_mutex);
        m_stream_eof = true;
    }
    m_stream_cv.notify_all();
    
    if (m_installer_thread.joinable()) {
        m_installer_thread.join();
    }
    
    SafePrintf("Installer Core: Finished writing %llu bytes.\n", m_total_bytes_written);
}

Result Core::MtpSource::ReadChunk(void* buf, s64 size, u64* bytes_read) {
    SafePrintf("MtpSource: Reading chunk of %lld bytes\n", size);
    std::unique_lock<std::mutex> lock(m_core->m_stream_mutex);
    
    while (m_core->m_stream_buffer.size() < (size_t)size && !m_core->m_stream_eof && !m_core->m_stream_error) {
        m_core->m_stream_cv.wait(lock);
    }
    
    if (m_core->m_stream_error) {
        SafePrintf("MtpSource: Stream error\n");
        return MAKERESULT(Module_Libnx, LibnxError_ShouldNotHappen);
    }
    
    size_t to_read = std::min((size_t)size, m_core->m_stream_buffer.size());
    if (to_read > 0) {
        std::memcpy(buf, m_core->m_stream_buffer.data(), to_read);
        m_core->m_stream_buffer.erase(m_core->m_stream_buffer.begin(), m_core->m_stream_buffer.begin() + to_read);
    }
    
    if (bytes_read) *bytes_read = to_read;
    SafePrintf("MtpSource: Read %llu bytes\n", (unsigned long long)to_read);
    m_core->m_stream_cv.notify_all();
    R_SUCCEED();
}

void Core::InstallerThreadEntry() {
    GooniesInstaller::yati::ConfigOverride config;
    config.sd_card_install = true;
    config.lower_system_version = true;
    config.lower_master_key = true;
    config.convert_to_standard_crypto = true;
    config.convert_to_common_ticket = true;
    
    Result rc = GooniesInstaller::yati::InstallFromSource(m_source.get(), fs::FsPath{m_filename.c_str()}, config);
    if (R_FAILED(rc)) {
        SafePrintf("Installation failed with code: %08x\n", rc);
        std::lock_guard<std::mutex> lock(m_stream_mutex);
        m_stream_error = true;
        m_stream_cv.notify_all();
    } else {
        SafePrintf("Installation succeeded!\n");
        std::lock_guard<std::mutex> lock(m_stream_mutex);
        m_installation_finished = true;
        m_stream_cv.notify_all();
    }
}

} // namespace Installer
