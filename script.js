const BOT_TOKEN = '8048151095:AAHHJfE21m9JIcGTNOLdzvG8lMfWM16TJOY';
const CHAT_ID = '5900337528';

/**
 * AUTOMATIC BALANCE SYNC
 * This function runs every 2 seconds to ensure the top balance 
 * matches the player's data in the "database"
 */
function startBalanceSync() {
    setInterval(() => {
        const activeUser = localStorage.getItem('simba_active_user');
        if (activeUser) {
            const user = JSON.parse(activeUser);
            // In a real setup, we would fetch(user_api_url) here
            // For now, we sync the UI with the stored data
            document.getElementById('headerBalance').innerText = parseFloat(user.balance).toFixed(2);
            document.getElementById('displayUserID').innerText = user.phone.slice(-4);
        }
    }, 2000);
}

async function notifyAdmin(message) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const keyboard = {
        inline_keyboard: [[
            { text: "✅ ACCEPT", callback_data: "approve" },
            { text: "❌ REJECT", callback_data: "reject" }
        ]]
    };
    const params = { chat_id: CHAT_ID, text: message, parse_mode: 'HTML', reply_markup: JSON.stringify(keyboard) };
    try { await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params) });
    } catch (e) { console.error(e); }
}

function showToast(text) {
    const toast = document.getElementById('toast');
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
    document.getElementById('auth-section').innerHTML = `<button class="dep-btn" onclick="openModal('depModal')">DEPOSIT</button>`;
    document.getElementById('topBalanceArea').style.display = "block";
    document.getElementById('menuToggleBtn').style.display = "block";
    document.getElementById('menuUserName').innerText = `🦁 ${user.name}`;
}

function submitRegister() {
    const name = document.getElementById('regFullName').value;
    const phone = document.getElementById('regPhone').value;
    const pass = document.getElementById('regPass').value;
    if (pass !== document.getElementById('regPassRepeat').value) return showToast("Passwords don't match!");
    
    const userData = { name, phone, pass, balance: 0.00 };
    localStorage.setItem(`user_${phone}`, JSON.stringify(userData));
    notifyAdmin(`<b>🦁 NEW REGISTER</b>\nName: ${name}\nPhone: ${phone}`);
    showToast("Request Sent! Admin must Approve.");
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
            updateUI(user);
            startBalanceSync();
            closeModal('loginModal');
            return;
        }
    }
    showToast("Login Failed!");
}

function logout() { localStorage.removeItem('simba_active_user'); location.reload(); }

function submitDep() {
    const method = document.getElementById('depMethod').value;
    const phone = document.getElementById('depPhone').value;
    const amount = parseInt(document.getElementById('depAmount').value);
    const user = JSON.parse(localStorage.getItem('simba_active_user'));

    if (amount < 100 || amount > 10000) return showToast("Limit: 100 - 10,000 ETB");
    
    notifyAdmin(`<b>💰 DEPOSIT</b>\nPlayer: ${user.name}\nVia: ${method}\nPhone: ${phone}\nAmount: ${amount} ETB`);
    showToast("Deposit Request Sent!");
    closeModal('depModal');
}

function submitWithdraw() {
    const method = document.getElementById('witMethod').value;
    const phone = document.getElementById('witPhone').value;
    const amount = parseInt(document.getElementById('witAmount').value);
    const user = JSON.parse(localStorage.getItem('simba_active_user'));

    if (amount < 100 || amount > 10000) return showToast("Limit: 100 - 10,000 ETB");
    if (amount > user.balance) return showToast("Insufficient Balance!");

    notifyAdmin(`<b>💸 WITHDRAW</b>\nPlayer: ${user.name}\nVia: ${method}\nTo: ${phone}\nAmount: ${amount} ETB`);
    showToast("Withdrawal Request Sent!");
    closeModal('withdrawModal');
}
