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

    const user = { name, phone, pass, balance: 0.00, id: Math.floor(1000 + Math.random() * 9000) };
    localStorage.setItem('user_' + phone, JSON.stringify(user));
    
    // Log in and Notify Admin
    localStorage.setItem('simba_active_user', JSON.stringify(user));
    notifyAdmin(`🆕 <b>NEW REGISTRATION</b>\nName: ${name}\nPhone: ${phone}\nID: ${user.id}`, "reg", 0, phone);
    
    showToast("Registration Successful!");
    setTimeout(() => location.reload(), 1500);
}

function loginUser() {
    const phone = document.getElementById('loginPhone').value;
    const pass = document.getElementById('loginPass').value;
    const user = JSON.parse(localStorage.getItem('user_' + phone));

    if (!user || user.pass !== pass) return showToast("Invalid Phone or Password");

    localStorage.setItem('simba_active_user', JSON.stringify(user));
    showToast("Login Successful!");
    setTimeout(() => location.reload(), 1000);
}

function logout() {
    localStorage.removeItem('simba_active_user');
    location.reload();
}

// --- 2. UI & BALANCE SYSTEM ---
function updateDisplay() {
    const activeUser = JSON.parse(localStorage.getItem('simba_active_user'));
    
    const authSection = document.getElementById('auth-section');
    const balanceArea = document.getElementById('topBalanceArea');
    const headerBal = document.getElementById('headerBalance');
    const menuName = document.getElementById('menuUserName');
    const menuBtn = document.getElementById('menuToggleBtn');
    const footerID = document.getElementById('displayUserID');

    if (activeUser) {
        // HIDE login/reg buttons and SHOW ID
        if(authSection) {
            authSection.innerHTML = `<span style="color:#fbbf24; font-weight:bold; font-size:14px;">ID: ${activeUser.id || 'N/A'}</span>`;
        }
        if(balanceArea) balanceArea.style.display = 'flex';
        if(menuBtn) menuBtn.style.display = 'block';
        if(menuName) menuName.innerText = activeUser.name;
        if(headerBal) headerBal.innerText = parseFloat(activeUser.balance).toFixed(2);
        if(footerID) footerID.innerText = activeUser.id;
    }
}

// --- 3. BOT NOTIFICATIONS (For Deposit/Withdrawal) ---
function notifyAdmin(message, type, amount, phone) {
    // This format must match your Google Script: confirm_type_amount_phone
    const callbackData = `confirm_${type}_${amount}_${phone}`;
    
    const inlineKeyboard = {
        inline_keyboard: [[
            { text: "✅ APPROVE", callback_data: callbackData },
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
    });
}

// --- 4. UTILITIES ---
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

window.onload = () => {
    updateDisplay();
    startBalanceWatcher();
};
