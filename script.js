// ==========================================
// SIMBA BET - FINAL MASTER WEBSITE SCRIPT
// ==========================================

const scriptURL = 'https://script.google.com/macros/s/AKfycbwz5nmG9NQH0qHt9HNLOdb_VPa4LpGf6GtXli0ROg4b2x1NIfLowoFDUaTEnEhrMIvrsg/exec';

async function notifyAdmin(details, type, amount, phone, name) {
    const finalURL = `${scriptURL}?action=${encodeURIComponent(type)}&user=${encodeURIComponent(phone)}&amt=${encodeURIComponent(amount)}&ref=${encodeURIComponent(details)}&name=${encodeURIComponent(name)}`;
    const ping = new Image();
    ping.src = finalURL;
}

function registerUser() {
    const name = document.getElementById('regName').value;
    const phone = document.getElementById('regPhone').value.toString();
    const pass = document.getElementById('regPass').value;
    if(!name || !phone || !pass) return alert("Fill all fields");
    const user = { name, phone, pass, balance: 0.00, id: Math.floor(1000 + Math.random() * 9000) };
    localStorage.setItem('user_' + phone, JSON.stringify(user));
    localStorage.setItem('simba_active_user', JSON.stringify(user));
    notifyAdmin(`New registration: ${name}`, 'Register', 0, phone, name);
    alert("Registration Successful!");
    setTimeout(() => { window.location.href = 'index.html'; }, 1000);
}

function processDeposit() {
    const method = document.getElementById('depMethod').value;
    const phone = document.getElementById('depPhone').value;
    const amount = Number(document.getElementById('depAmount').value);
    const user = JSON.parse(localStorage.getItem('simba_active_user'));
    if(!user || !phone || !amount) return alert("Check fields");
    notifyAdmin(`Method: ${method}, From: ${phone}`, 'Deposit', amount, user.phone, user.name);
    alert("Request sent to Admin!");
}

function processWithdraw() {
    const method = document.getElementById('wdMethod').value;
    const receivePhone = document.getElementById('wdPhone').value;
    const amount = Number(document.getElementById('wdAmount').value);
    const user = JSON.parse(localStorage.getItem('simba_active_user'));
    if (!user || !receivePhone || !amount) return alert("Fill all fields");
    if (amount > user.balance) return alert("Insufficient balance");
    notifyAdmin(`Method: ${method}, Send to: ${receivePhone}`, 'Withdraw', amount, user.phone, user.name);
    alert("Withdrawal request sent.");
}

function updateDisplay() {
    const activeUser = JSON.parse(localStorage.getItem('simba_active_user'));
    if (activeUser) {
        const headerBal = document.getElementById('headerBalance');
        const authSection = document.getElementById('auth-section');
        if(headerBal) headerBal.innerText = parseFloat(activeUser.balance).toFixed(2);
        if(authSection) authSection.innerHTML = `<span style="color:gold; font-weight:bold;">ID: ${activeUser.id}</span>`;
    }
}
window.onload = updateDisplay;
