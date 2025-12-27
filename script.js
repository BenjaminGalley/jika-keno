// ==========================================
// SIMBA BET - FINAL MASTER WEBSITE SCRIPT
// ==========================================

const scriptURL = 'https://script.google.com/macros/s/AKfycbw_f5jOBsyRmlYYqtty_SA7ypZ3Vcv94KHeJV6whxAEuyUQlm-JsNSImEJlb6XofbGs/exec'; 

// THIS FUNCTION FETCHES THE APPROVED BALANCE FROM GOOGLE
async function updateDisplay() {
    const activeUser = JSON.parse(localStorage.getItem('simba_active_user'));
    if (activeUser) {
        try {
            // It asks your Google Script: "What is the real balance for this phone?"
            const response = await fetch(`${scriptURL}?action=getBalance&user=${activeUser.phone}`);
            const realBalance = await response.text();
            
            // It updates the screen with the number you "Accepted" in Telegram
            if (!isNaN(realBalance)) {
                activeUser.balance = realBalance;
                localStorage.setItem('simba_active_user', JSON.stringify(activeUser));
            }
        } catch (e) { 
            console.error("Balance update failed"); 
        }

        // Update the numbers visible on the screen
        if(document.getElementById('headerBalance')) document.getElementById('headerBalance').innerText = activeUser.balance;
        if(document.getElementById('displayUserID')) document.getElementById('displayUserID').innerText = activeUser.id;
    }
}

async function notifyAdmin(details, type, amount, phone, name) {
    const finalURL = `${scriptURL}?action=${encodeURIComponent(type)}&user=${encodeURIComponent(phone)}&amt=${encodeURIComponent(amount)}&name=${encodeURIComponent(name)}`;
    // Sends the request to your Bot
    await fetch(finalURL, { method: 'GET', mode: 'no-cors' });
}

function processDeposit() {
    const amount = document.getElementById('depAmount').value;
    const user = JSON.parse(localStorage.getItem('simba_active_user'));
    if(!amount || amount < 1) return alert("Enter valid amount");
    
    notifyAdmin('Deposit Request', 'deposit', amount, user.phone, user.name);
    alert("Request sent! Once you press 'Accept' in Telegram, refresh this page to see your money.");
}

function registerUser() {
    const name = document.getElementById('regName').value;
    const phone = document.getElementById('regPhone').value.toString();
    const pass = document.getElementById('regPass').value;
    if(!name || !phone || !pass) return alert("Fill all fields");
    const user = { name, phone, pass, balance: "0.00", id: Math.floor(1000 + Math.random() * 9000) };
    localStorage.setItem('user_' + phone, JSON.stringify(user));
    localStorage.setItem('simba_active_user', JSON.stringify(user));
    notifyAdmin(`New registration`, 'Register', 0, phone, name);
    alert("Registration Successful!");
    setTimeout(() => { window.location.href = 'index.html'; }, 1000);
}

function loginUser() {
    const phone = document.getElementById('loginPhone').value.toString();
    const pass = document.getElementById('loginPass').value;
    const storedUser = JSON.parse(localStorage.getItem('user_' + phone));
    if (!storedUser || storedUser.pass !== pass) return alert("Invalid Phone or Password");
    localStorage.setItem('simba_active_user', JSON.stringify(storedUser));
    alert("Login Successful!");
    window.location.href = 'index.html';
}

// Automatically check for balance updates when the page opens
window.addEventListener('load', updateDisplay);
