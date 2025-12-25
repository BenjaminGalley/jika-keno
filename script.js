// SIMBA BET - MASTER WEBSITE SCRIPT
// URL: ...l4lYEA/exec
const scriptURL = 'https://script.google.com/macros/s/AKfycbwczhI7YENmFO1KjvHkp_rTe5F1qxrHSkU1JdBzneyad3yFzEtAyjuk69XxeTxxl4lYEA/exec';

// --- 1. THE CONNECTION BRIDGE (Fixed for Deposit) ---
async function notifyAdmin(message, type, amount, phone) {
    // Construct the URL exactly as the Google Script expects
    const finalURL = `${scriptURL}?action=${encodeURIComponent(type)}&user=${encodeURIComponent(phone)}&amt=${encodeURIComponent(amount)}&ref=${encodeURIComponent(message)}`;
    
    // We use the Image object to "ping" the URL. 
    // This is the fastest way to send data without getting blocked by mobile security.
    const ping = new Image();
    ping.src = finalURL;
    
    console.log("Deposit Notification Sent to Bot");
}

// --- 2. USER AUTHENTICATION ---
function registerUser() {
    const name = document.getElementById('regName').value;
    const phone = document.getElementById('regPhone').value.toString();
    const pass = document.getElementById('regPass').value;

    if(!name || !phone || !pass) return alert("Please fill all fields");
    
    if(localStorage.getItem('user_' + phone)) {
        alert("Phone already registered");
        return;
    }

    const user = { 
        name: name, 
        phone: phone, 
        pass: pass, 
        balance: 0.00, 
        id: Math.floor(1000 + Math.random() * 9000) 
    };

    localStorage.setItem('user_' + phone, JSON.stringify(user));
    localStorage.setItem('simba_active_user', JSON.stringify(user));
    
    // Notify bot of new registration
    notifyAdmin(`New User: ${name}`, 'Register', 0, phone);
    
    alert("Registration Successful!");
    setTimeout(() => { location.reload(); }, 1000);
}

function loginUser() {
    const phone = document.getElementById('loginPhone').value.toString();
    const pass = document.getElementById('loginPass').value;
    const user = JSON.parse(localStorage.getItem('user_' + phone));

    if (!user || user.pass !== pass) {
        alert("Invalid Phone or Password");
        return;
    }

    localStorage.setItem('simba_active_user', JSON.stringify(user));
    alert("Login Successful!");
    setTimeout(() => { location.reload(); }, 1000);
}

function logout() {
    localStorage.removeItem('simba_active_user');
    location.reload();
}

// --- 3. UI DISPLAY ---
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
