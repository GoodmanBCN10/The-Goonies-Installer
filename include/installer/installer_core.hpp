#pragma once
#include <switch.h>
#include <string>
#include <vector>
#include <thread>
#include <mutex>
#include <condition_variable>
#include "yati/source/stream.hpp"

namespace Installer {

class Core {
public:
    Core();
    ~Core();

    bool StartInstallation(const std::string& filename);
    bool WriteData(const void* data, size_t size);
    void FinishInstallation();
    
    bool IsFinished() const { return m_installation_finished; }
    bool HasError() const { return m_stream_error; }
    u64 GetBytesWritten() const { return m_total_bytes_written; }

    static void LockConsole();
    static void UnlockConsole();
    static void SafePrintf(const char* format, ...);

private:
    std::string m_filename;
    u64 m_total_bytes_written = 0;
    
    // MTP to Yati stream pipe
    std::mutex m_stream_mutex;
    std::condition_variable m_stream_cv;
    std::vector<u8> m_stream_buffer;
    bool m_stream_eof = false;
    bool m_stream_error = false;
    bool m_installation_finished = false;
    
    std::thread m_installer_thread;

    class MtpSource : public GooniesInstaller::yati::source::Stream {
    public:
        MtpSource(Core* core) : m_core(core) {}
        ~MtpSource() override = default;
        Result ReadChunk(void* buf, s64 size, u64* bytes_read) override;
    private:
        Core* m_core;
    };
    
    friend class MtpSource;
    std::unique_ptr<MtpSource> m_source;

    void InstallerThreadEntry();
};

} // namespace Installer
