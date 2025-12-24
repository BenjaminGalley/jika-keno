const BOT_TOKEN = '8048151095:AAHHJfE21m9JIcGTNOLdzvG8lMfWM16TJOY';
const CHAT_ID = '5900337528';

// AUTO-BALANCE SYNC: Refreshes UI if the underlying data changes
function startBalanceSync() {
    setInterval(() => {
        const activeUser = localStorage.getItem('simba_active_user');
        if (activeUser) {
            const user = JSON.parse(activeUser);
            // Sync with elements if they exist on the current page
            const balHeader = document.getElementById('headerBalance');
            if(balHeader) balHeader.innerText = parseFloat(user.balance).toFixed(2);
            
            const idFooter = document.getElementById('displayUserID');
            if(idFooter) idFooter.innerText = user.phone.slice(-4);
        }
    }, 2000);
}

async function notifyAdmin(message, actionType, amount, userPhone) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const keyboard = {
        inline_keyboard: [[
            { text: "✅ APPROVE", callback_data: `confirm_${actionType}_${amount}_${userPhone}` },
            { text: "❌ REJECT", callback_data: `reject_${userPhone}` }
        ]]
    };
    const params = { chat_id: CHAT_ID, text: message, parse_mode: 'HTML', reply_markup: JSON.stringify(keyboard) };
    try { await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params) }); 
    } catch (e) { console.error("Telegram Notification Error", e); }
}

function showToast(text) {
    const toast = document.getElementById('toast');
    if(!toast) return;
    toast.innerText = text;
    toast.classList.remove('toast-hidden');
    setTimeout(() => toast.classList.add('toast-hidden'), 3000);
}

function toggleMenu() { document.getElementById('sideMenu').classList.toggle('open'); }
function openModal(id) { document.getElementById(id).style.display = "block"; }
function closeModal(id) { document.getElementById(id).style.display = "none"; }

window.onload = function() {
    const activeUser = localStorage.getItem('simba_active_user');
    if (activeUser) {
        updateUI(JSON.parse(activeUser));
        startBalanceSync();
    }
};

function updateUI(user) {
    const auth = document.getElementById('auth-section');
    if(auth) auth.innerHTML = `<button class="login-btn" style="background:#f1c40f; color:#000;" onclick="location.href='deposit.html'">DEPOSIT</button>`;
    if(document.getElementById('topBalanceArea')) document.getElementById('topBalanceArea').style.display = "block";
    if(document.getElementById('menuToggleBtn')) document.getElementById('menuToggleBtn').style.display = "block";
    if(document.getElementById('menuUserName')) document.getElementById('menuUserName').innerText = `🦁 ${user.name}`;
}

function submitRegister() {
    const name = document.getElementById('regFullName').value;
    const phone = document.getElementById('regPhone').value;
    const pass = document.getElementById('regPass').value;
    if(!name || !phone || !pass) return showToast("Please fill all fields");

    const userData = { name, phone, pass, balance: 0.00 };
    localStorage.setItem(`user_${phone}`, JSON.stringify(userData));
    notifyAdmin(`<b>🦁 NEW PLAYER</b>\nName: ${name}\nPhone: ${phone}`, 'reg', 0, phone);
    showToast("Registration Sent! Waiting for admin.");
    closeModal('registerModal');
}

function submitLogin() {
    const phone = document.getElementById('loginName').value;
    const pass = document.getElementById('loginPass').value;
    const stored = localStorage.getItem(`user_${phone}`);
    if (stored) {
        const user = JSON.parse(stored);
        if (user.pass === pass) {
            localStorage.setItem('simba_active_user', stored);
            location.reload();
            return;
        }
    }
    showToast("Login Incorrect");
}

function logout() { localStorage.removeItem('simba_active_user'); location.href='index.html'; }

// Link to your deposit/withdraw files
function submitDep() {
    // This is handled in deposit.html now, but kept here for sync
    const amount = document.getElementById('depAmount').value;
    const user = JSON.parse(localStorage.getItem('simba_active_user'));
    notifyAdmin(`💰 DEPOSIT REQ: ${amount} ETB from ${user.phone}`, 'dep', amount, user.phone);
}
