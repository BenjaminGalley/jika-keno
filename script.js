// SIMBA BET - MASTER WEBSITE SCRIPT
const scriptURL = 'https://script.google.com/macros/s/AKfycbyCX6a4vLxXWApuA--xNy36blAowdmgJS8KuHkrsUNciQAP1-XKdbfAVLlM-N7JneCl/exec';

// --- 1. USER AUTHENTICATION ---
function registerUser() {
    const name = document.getElementById('regName').value;
    const phone = document.getElementById('regPhone').value;
    const pass = document.getElementById('regPass').value;

    if(!name || !phone || !pass) return showToast("Please fill all fields");
    if(localStorage.getItem('user_' + phone)) return showToast("User already exists");

    const user = { name, phone, pass, balance: 0.00, id: Math.floor(1000 + Math.random() * 9000) };
    localStorage.setItem('user_' + phone, JSON.stringify(user));
    localStorage.setItem('simba_active_user', JSON.stringify(user));
    
    notifyAdmin(`New User: ${name} (ID: ${user.id})`, 'register', 0, phone);
    
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

// --- 2. WITHDRAWAL HANDLER ---
function handleWithdraw() {
    const amount = document.getElementById('withdrawAmount')?.value;
    const method = document.getElementById('withdrawMethod')?.value;
    const activeUser = JSON.parse(localStorage.getItem('simba_active_user'));

    if (!activeUser) return showToast("Please login first");
    if (!amount || amount < 100) return showToast("Minimum withdrawal is 100 ETB");

    const msg = `<b>💸 WITHDRAWAL REQUEST</b>\n<b>User:</b> ${activeUser.name}\n<b>Phone:</b> ${activeUser.phone}\n<b>Amount:</b> ${amount} ETB\n<b>Method:</b> ${method}`;
    
    // Sends to Google Sheet and Telegram
    notifyAdmin(msg, 'withdraw', amount, activeUser.phone);
    showToast("Withdrawal request sent to Admin!");
}

// --- 3. THE CONNECTION BRIDGE ---
async function notifyAdmin(message, type, amount, phone) {
    const url = `${scriptURL}?action=${type}&user=${phone}&amt=${amount}&ref=${encodeURIComponent(message)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === 'success') {
            console.log("Admin notified via Google/Telegram");
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// --- 4. UI & SYSTEM ---
function updateDisplay() {
    const activeUser = JSON.parse(localStorage.getItem('simba_active_user'));
    const authSection = document.getElementById('auth-section');
    const headerBal = document.getElementById('headerBalance');

    if (activeUser) {
        if(authSection) authSection.innerHTML = `<span style="color:#fbbf24; font-weight:bold;">ID: ${activeUser.id}</span>`;
        if(headerBal) headerBal.innerText = parseFloat(activeUser.balance).toFixed(2);
    }
}

function showToast(msg) {
    alert(msg); 
}

window.onload = updateDisplay;
