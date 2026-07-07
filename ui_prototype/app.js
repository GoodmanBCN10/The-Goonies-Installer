let currentScreen = 'screen-home';
let detailsActive = false;

// Navigation function
function navigate(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });

    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        currentScreen = screenId;
    }
    
    updateFooter();
}

// Games Details functionality
function showGameDetails(gameId) {
    const grid = document.getElementById('games-grid');
    const details = document.getElementById('game-details');
    
    // Switch views
    grid.classList.remove('active-view');
    grid.classList.add('hidden-view');
    
    details.classList.remove('hidden-view');
    details.classList.add('active-view');
    
    detailsActive = true;
    updateFooter();
    
    // Auto-focus first button in details
    const firstBtn = details.querySelector('button');
    if(firstBtn) firstBtn.focus();
}

function hideGameDetails() {
    const grid = document.getElementById('games-grid');
    const details = document.getElementById('game-details');
    
    // Switch views
    details.classList.remove('active-view');
    details.classList.add('hidden-view');
    
    grid.classList.remove('hidden-view');
    grid.classList.add('active-view');
    
    detailsActive = false;
    updateFooter();
    
    // Restore focus to a game card
    const firstCard = grid.querySelector('.game-card');
    if(firstCard) firstCard.focus();
}

// Handle Footer UI
function updateFooter() {
    const btnBackHint = document.getElementById('btn-back-hint');
    if (currentScreen === 'screen-home' && !detailsActive) {
        btnBackHint.classList.add('hidden-view');
    } else {
        btnBackHint.classList.remove('hidden-view');
    }
}

// Controller / Keyboard Logic
function handleBackAction() {
    if (detailsActive) {
        if (currentScreen === 'screen-games') {
            hideGameDetails();
        } else if (currentScreen === 'screen-saves') {
            hideSaveDetails();
        }
    } else if (currentScreen !== 'screen-home') {
        navigate('screen-home');
    }
}

document.addEventListener('keydown', (e) => {
    // Esc, Backspace, or 'b' / 'B' can act as the 'B' button for testing on PC
    if (e.key === 'Escape' || e.key === 'Backspace' || e.key.toLowerCase() === 'b') {
        handleBackAction();
    }
});

// Basic Gamepad API polling for 'B' button (button[1] usually)
let gamepadPolling;
function startGamepadPolling() {
    gamepadPolling = setInterval(() => {
        const gamepads = navigator.getGamepads();
        for (let i = 0; i < gamepads.length; i++) {
            const gp = gamepads[i];
            if (gp) {
                // Button 1 is usually B on Xbox / A on Nintendo, depending on mapping
                // Assuming standard mapping where index 1 or 0 is 'Back'
                if (gp.buttons[1].pressed || gp.buttons[0].pressed) {
                    // Primitive debounce
                    if(!gp._bPressedBefore) {
                        handleBackAction();
                        gp._bPressedBefore = true;
                        setTimeout(() => { gp._bPressedBefore = false; }, 300); // 300ms debounce
                    }
                }
            }
        }
    }, 100);
}

window.addEventListener("gamepadconnected", (e) => {
    console.log("Gamepad connected:", e.gamepad.id);
    startGamepadPolling();
});

// Auto-focus first button on load
window.onload = () => {
    const firstBtn = document.querySelector('.main-menu button');
    if(firstBtn) firstBtn.focus();
    updateFooter();
};

// --- Nuevas Funcionalidades ---

// Theme functionality
function setTheme(colorHex) {
    // Cambiar la variable CSS en el root
    document.documentElement.style.setProperty('--accent-color', colorHex);
    
    // Actualizar clase active en botones
    const btns = document.querySelectorAll('.theme-btn');
    btns.forEach(btn => btn.classList.remove('active'));
    if(event && event.target) {
        event.target.classList.add('active');
    }
}

// Mock Explorer functionality
function mockNavigateFolder(folderName) {
    const pathEl = document.getElementById('current-path');
    pathEl.innerText = 'microSD:/' + folderName + '/';
    
    const list = document.getElementById('explorer-list');
    list.innerHTML = `
        <li tabindex="0" class="explorer-item folder" onclick="mockNavigateUp()" onkeypress="if(event.key === 'Enter') mockNavigateUp()">
            <span class="icon">📁</span> ..
        </li>
        <li tabindex="0" class="explorer-item file">
            <span class="icon">📄</span> archivo_falso.txt
        </li>
        <li tabindex="0" class="explorer-item file">
            <span class="icon">🖼️</span> imagen_captura.jpg
        </li>
    `;
}

function mockNavigateUp() {
    const pathEl = document.getElementById('current-path');
    pathEl.innerText = 'microSD:/';
    
    const list = document.getElementById('explorer-list');
    list.innerHTML = `
        <li tabindex="0" class="explorer-item folder" onclick="mockNavigateFolder('Nintendo')" onkeypress="if(event.key === 'Enter') mockNavigateFolder('Nintendo')">
            <span class="icon">📁</span> Nintendo
        </li>
        <li tabindex="0" class="explorer-item folder" onclick="mockNavigateFolder('atmosphere')" onkeypress="if(event.key === 'Enter') mockNavigateFolder('atmosphere')">
            <span class="icon">📁</span> atmosphere
        </li>
        <li tabindex="0" class="explorer-item folder" onclick="mockNavigateFolder('switch')" onkeypress="if(event.key === 'Enter') mockNavigateFolder('switch')">
            <span class="icon">📁</span> switch
        </li>
        <li tabindex="0" class="explorer-item file">
            <span class="icon">📄</span> hbmenu.nro
        </li>
    `;
}

// Saves functionality
function showSaveDetails(gameId) {
    const grid = document.getElementById('saves-grid');
    const details = document.getElementById('save-details');
    
    // Switch views
    grid.classList.remove('active-view');
    grid.classList.add('hidden-view');
    
    details.classList.remove('hidden-view');
    details.classList.add('active-view');
    
    detailsActive = true;
    updateFooter();
    
    // Auto-focus first button in details
    const firstBtn = details.querySelector('button');
    if(firstBtn) firstBtn.focus();
}

function hideSaveDetails() {
    const grid = document.getElementById('saves-grid');
    const details = document.getElementById('save-details');
    
    // Switch views
    details.classList.remove('active-view');
    details.classList.add('hidden-view');
    
    grid.classList.remove('hidden-view');
    grid.classList.add('active-view');
    
    detailsActive = false;
    updateFooter();
    
    // Restore focus to a game card
    const firstCard = grid.querySelector('.game-card');
    if(firstCard) firstCard.focus();
}
