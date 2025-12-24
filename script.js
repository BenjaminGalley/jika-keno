// CONFIGURATION
const ADMIN_CHAT_ID = "6688537446"; 
const BOT_TOKEN = "8048151095:AAHHJfE21m9JIcGTNOLDzvG81MfWWM16TJ0Y";

// --- 1. USER AUTHENTICATION ---
function registerUser() {
    const name = document.getElementById('regName').value;
    const phone = document.getElementById('regPhone').value;
    const pass = document.getElementById('regPass').value;

    if(!name || !phone || !pass) return showToast("Please fill all fields");
    if(localStorage.getItem('user_' + phone)) return showToast("User already exists");

    const user = { name, phone, pass, balance: 0.00 };
    localStorage.setItem('user_' + phone, JSON.stringify(user));
    
    // Log them in immediately
    localStorage.setItem('simba_active_user', JSON.stringify(user));
    showToast("Registration Successful!");
    
    // Close modal and refresh UI
    if(typeof closeModal === 'function') closeModal('registerModal');
    setTimeout(() => updateDisplay(), 1000);
}

function loginUser() {
    const phone = document.getElementById('loginPhone').value;
    const pass = document.getElementById('loginPass').value;
    const user = JSON.parse(localStorage.getItem('user_' + phone));

    if (!user || user.pass !== pass) return showToast("Invalid Phone or Password");

    localStorage.setItem('simba_active_user', JSON.stringify(user));
    showToast("Login Successful!");
    
    // Close modal and refresh UI
    if(typeof closeModal === 'function') closeModal('loginModal');
    setTimeout(() => updateDisplay(), 1000);
}

function logout() {
    localStorage.removeItem('simba_active_user');
    location.reload(); // Refresh to show login buttons again
}

// --- 2. UI SYNCING (Matches your index.html IDs) ---
function updateDisplay() {
    const activeUser = JSON.parse(localStorage.getItem('simba_active_user'));
    
    const authSection = document.getElementById('auth-section');
    const balanceArea = document.getElementById('topBalanceArea');
    const headerBal = document.getElementById('headerBalance');
    const menuName = document.getElementById('menuUserName');
    const menuBtn = document.getElementById('menuToggleBtn');

    if (activeUser) {
        // User is logged in: Show balance and menu, hide login buttons
        if(authSection) authSection.style.display = 'none';
        if(balanceArea) balanceArea.style.display = 'flex';
        if(menuBtn) menuBtn.style.display = 'block';
        if(menuName) menuName.innerText = activeUser.name;
        if(headerBal) headerBal.innerText = parseFloat(activeUser.balance).toFixed(2);
        
        // Update game page balance if on a game page
        const gameBal = document.getElementById('gameBalance') || document.getElementById('gameBal');
        if(gameBal) gameBal.innerText = parseFloat(activeUser.balance).toFixed(2);
    } else {
        // User is logged out: Show login buttons, hide balance
        if(authSection) authSection.style.display = 'flex';
        if(balanceArea) balanceArea.style.display = 'none';
        if(menuBtn) menuBtn.style.display = 'none';
    }
}

// --- 3. NOTIFICATIONS & WATCHER ---
function notifyAdmin(message, type, amount, phone) {
    const inlineKeyboard = {
        inline_keyboard: [[
            { text: "✅ APPROVE", callback_data: `confirm_${type}_${amount}_${phone}` },
            { text: "❌ REJECT", callback_data: `reject_${type}_${amount}_${phone}` }
        ]]
    };

    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: ADMIN_CHAT_ID,
            text: message,
            parse_mode: 'HTML',
            reply_markup: inlineKeyboard
        })
    }).catch(err => console.log("Telegram Error:", err));
}

function startBalanceWatcher() {
    setInterval(() => {
        const activeUser = JSON.parse(localStorage.getItem('simba_active_user'));
        if (!activeUser) return;

        const globalUser = JSON.parse(localStorage.getItem(`user_${activeUser.phone}`));
        if (globalUser && globalUser.balance !== activeUser.balance) {
            activeUser.balance = globalUser.balance;
            localStorage.setItem('simba_active_user', JSON.stringify(activeUser));
            updateDisplay();
        }
    }, 3000);
}

// --- 4. UTILITIES ---
function showToast(msg) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
    }
    toast.innerText = msg;
    toast.className = "toast-visible";
    setTimeout(() => { toast.className = "toast-hidden"; }, 3000);
}

// Initialize
window.onload = () => {
    updateDisplay();
    startBalanceWatcher();
};
