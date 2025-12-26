// ==========================================
// SIMBA BET - FINAL MASTER WEBSITE SCRIPT
// ==========================================

// UPDATED URL: Matches your latest Google Script deployment
const scriptURL = 'https://script.google.com/macros/s/AKfycbyeQbGm0Jk-UrpUyiWs6Pix1urL1CdflFuQ2ptJyIJUXnv2lQZQ4GOjJcXmgJvhTuFa/exec'; 

// --- Notify Admin (Bridge to Telegram) ---
async function notifyAdmin(details, type, amount, phone, name) {
    const finalURL = `${scriptURL}?action=${encodeURIComponent(type)}&user=${encodeURIComponent(phone)}&amt=${encodeURIComponent(amount)}&ref=${encodeURIComponent(details)}&name=${encodeURIComponent(name)}`;
    
    try {
        // We use fetch with no-cors to bypass security blocks
        await fetch(finalURL, { 
            method: 'GET', 
            mode: 'no-cors',
            cache: 'no-cache'
        });
        console.log("Notification signal sent to Admin.");
    } catch (e) {
        console.error("Connection error while notifying admin", e);
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

    localStorage.setItem('user_' + phone, JSON.stringify(user));
    localStorage.setItem('simba_active_user', JSON.stringify(user));
    
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
        
        if(authSection) {
            authSection.innerHTML = `<span style="color:#fbbf24; font-weight:bold; font-size:14px;">ID: ${activeUser.id}</span>`;
        }
    }
}

window.addEventListener('load', updateDisplay);
