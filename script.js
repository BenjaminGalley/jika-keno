// ==========================================
// SIMBA BET - FINAL MASTER WEBSITE SCRIPT
// ==========================================

const scriptURL = 'https://script.google.com/macros/s/AKfycbwz5nmG9NQH0qHt9HNLOdb_VPa4LpGf6GtXli0ROg4b2x1NIfLowoFDUaTEnEhrMIvrsg/exec';

// --- Improved Notify Admin (Using Fetch for better reliability) ---
async function notifyAdmin(details, type, amount, phone, name) {
    const finalURL = `${scriptURL}?action=${encodeURIComponent(type)}&user=${encodeURIComponent(phone)}&amt=${encodeURIComponent(amount)}&ref=${encodeURIComponent(details)}&name=${encodeURIComponent(name)}`;
    
    try {
        // 'no-cors' mode allows the request to be sent even if Google doesn't send a response back
        await fetch(finalURL, { 
            method: 'GET',
            mode: 'no-cors',
            cache: 'no-cache'
        });
        console.log("Notification sent successfully to Google Script");
    } catch (error) {
        console.error("Critical Error: Could not reach Google Script", error);
    }
}

// --- User Registration ---
function registerUser() {
    const name = document.getElementById('regName').value;
    const phone = document.getElementById('regPhone').value.toString();
    const pass = document.getElementById('regPass').value;
    
    if(!name || !phone || !pass) return alert("Please fill all fields");
    
    const user = { 
        name: name, 
        phone: phone, 
        pass: pass, 
        balance: 0.00, 
        id: Math.floor(1000 + Math.random() * 9000) 
    };

    // Save locally so they can stay logged in
    localStorage.setItem('user_' + phone, JSON.stringify(user));
    localStorage.setItem('simba_active_user', JSON.stringify(user));
    
    // Alert the Admin Bot immediately
    notifyAdmin(`New registration request from ${name}`, 'Register', 0, phone, name);
    
    alert("Registration Successful!");
    setTimeout(() => { window.location.href = 'index.html'; }, 1000);
}

// --- User Login ---
function loginUser() {
    const phone = document.getElementById('loginPhone').value.toString();
    const pass = document.getElementById('loginPass').value;
    const storedUser = JSON.parse(localStorage.getItem('user_' + phone));

    if (!storedUser || storedUser.pass !== pass) {
        return alert("Invalid Phone or Password");
    }

    localStorage.setItem('simba_active_user', JSON.stringify(storedUser));
    alert("Login Successful!");
    window.location.href = 'index.html';
}

// --- Logout ---
function logout() {
    localStorage.removeItem('simba_active_user');
    window.location.href = 'index.html';
}

// --- Process Deposit ---
function processDeposit() {
    const method = document.getElementById('depMethod').value;
    const phone = document.getElementById('depPhone').value;
    const amount = Number(document.getElementById('depAmount').value);
    const user = JSON.parse(localStorage.getItem('simba_active_user'));
    
    if(!user || !phone || !amount) return alert("Please fill all fields correctly");
    if(amount < 100) return alert("Minimum deposit is 100 ETB");
    
    // This sends the data to your Telegram Bot via Google Script
    notifyAdmin(`Method: ${method}, Sending Phone: ${phone}`, 'Deposit', amount, user.phone, user.name);
    
    alert("Deposit request sent to Admin! Please wait for approval.");
}

// --- Process Withdraw ---
function processWithdraw() {
    const method = document.getElementById('wdMethod').value;
    const receivePhone = document.getElementById('wdPhone').value;
    const amount = Number(document.getElementById('wdAmount').value);
    const user = JSON.parse(localStorage.getItem('simba_active_user'));
    
    if (!user || !receivePhone || !amount) return alert("Please fill all fields");
    if (amount > user.balance) return alert("Insufficient balance in your account");
    
    notifyAdmin(`Method: ${method}, Pay to: ${receivePhone}`, 'Withdraw', amount, user.phone, user.name);
    
    alert("Withdrawal request sent to Admin.");
}

// --- Update UI Display ---
function updateDisplay() {
    const activeUser = JSON.parse(localStorage.getItem('simba_active_user'));
    if (activeUser) {
        const headerBal = document.getElementById('headerBalance');
        const authSection = document.getElementById('auth-section');
        const displayID = document.getElementById('displayUserID');
        const menuName = document.getElementById('menuUserName');

        if(headerBal) headerBal.innerText = parseFloat(activeUser.balance).toFixed(2);
        if(displayID) displayID.innerText = activeUser.id;
        if(menuName) menuName.innerText = activeUser.name;
        
        // Hide Login/Register buttons and show ID when logged in
        if(authSection) {
            authSection.innerHTML = `<span style="color:gold; font-weight:bold; font-size:14px;">ID: ${activeUser.id}</span>`;
        }
    }
}

// Run update UI whenever any page finishes loading
window.addEventListener('load', updateDisplay);
