// ==========================================
// SIMBA BET - FINAL MASTER WEBSITE SCRIPT
// ==========================================

// --- 1. YOUR LATEST GOOGLE SCRIPT URL ---
const scriptURL = 'https://script.google.com/macros/s/AKfycbzDSXDWQCvckyYWeY1Zhp5ezzzQqmldzln9M_dWEHTnHLubrw3sK0Ewr8Ib12n_LKtf/exec';

// --- 2. THE CONNECTION BRIDGE (Reliable Image Ping) ---
async function notifyAdmin(details, type, amount, phone, name) {
    const finalURL = `${scriptURL}?action=${encodeURIComponent(type)}&user=${encodeURIComponent(phone)}&amt=${encodeURIComponent(amount)}&ref=${encodeURIComponent(details)}&name=${encodeURIComponent(name)}`;
    const ping = new Image();
    ping.src = finalURL;
    console.log(`📡 Notification Sent: ${type} | ${name}`);
}

// --- 3. USER AUTHENTICATION ---
function registerUser() {
    const name = document.getElementById('regName').value;
    const phone = document.getElementById('regPhone').value.toString();
    const pass = document.getElementById('regPass').value;

    if(!name || !phone || !pass) return alert("Please fill all fields");
    if(localStorage.getItem('user_' + phone)) return alert("This phone is already registered");

    const user = { 
        name: name, 
        phone: phone, 
        pass: pass, 
        balance: 0.00, 
        id: Math.floor(1000 + Math.random() * 9000) 
    };

    // Save so they can login immediately
    localStorage.setItem('user_' + phone, JSON.stringify(user));
    localStorage.setItem('simba_active_user', JSON.stringify(user));
    
    // Notify Bot
    notifyAdmin(`New registration: ${name}`, 'Register', 0, phone, name);
    
    alert("Registration Successful! Welcome to Simba.");
    setTimeout(() => { window.location.href = 'index.html'; }, 1000);
}

function loginUser() {
    const phone = document.getElementById('loginPhone').value.toString();
    const pass = document.getElementById('loginPass').value;
    const user = JSON.parse(localStorage.getItem('user_' + phone));

    if (!user || user.pass !== pass) return alert("Invalid Phone or Password");

    localStorage.setItem('simba_active_user', JSON.stringify(user));
    alert("Login Successful!");
    setTimeout(() => { window.location.href = 'index.html'; }, 1000);
}

function logout() {
    localStorage.removeItem('simba_active_user');
    location.reload();
}

// --- 4. DEPOSIT FUNCTION ---
function processDeposit() {
    const method = document.getElementById('depMethod').value;
    const phone = document.getElementById('depPhone').value;
    const amount = Number(document.getElementById('depAmount').value);
    const user = JSON.parse(localStorage.getItem('simba_active_user'));

    if(!user) return alert("Please login first");
    if(!phone || !amount) return alert("Fill all fields");
    if(amount < 100 || amount > 10000) return alert("Min: 100, Max: 10,000 ETB");

    const details = `Method: ${method}, Paid from: ${phone}`;
    notifyAdmin(details, 'Deposit', amount, user.phone, user.name);

    alert("Deposit request sent! Wait for Admin approval.");
    window.location.href = 'index.html';
}

// --- 5. WITHDRAW FUNCTION ---
function processWithdraw() {
    const method = document.getElementById('wdMethod').value;
    const receivePhone = document.getElementById('wdPhone').value;
    const amount = Number(document.getElementById('wdAmount').value);
    const user = JSON.parse(localStorage.getItem('simba_active_user'));

    if (!user) return alert("Please login first");
    if (!receivePhone || !amount) return alert("Fill all fields");
    if (amount < 100 || amount > 10000) return alert("Min: 100, Max: 10,000 ETB");
    if (amount > user.balance) return alert("Insufficient balance");

    const details = `Method: ${method}, Send to: ${receivePhone}`;
    notifyAdmin(details, 'Withdraw', amount, user.phone, user.name);

    alert("Withdrawal request sent. Waiting for approval.");
    window.location.href = 'index.html';
}

// --- 6. DISPLAY UPDATER ---
function updateDisplay() {
    const activeUser = JSON.parse(localStorage.getItem('simba_active_user'));
    const headerBal = document.getElementById('headerBalance');
    const authSection = document.getElementById('auth-section');

    if (activeUser) {
        if(headerBal) headerBal.innerText = parseFloat(activeUser.balance).toFixed(2);
        if(authSection) authSection.innerHTML = `<span style="color:gold; font-weight:bold;">ID: ${activeUser.id}</span>`;
    }
}

window.onload = updateDisplay;
