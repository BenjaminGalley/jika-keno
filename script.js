// SIMBA BET - MASTER WEBSITE SCRIPT
// Updated with your latest URL: ...l4lYEA/exec
const scriptURL = 'https://script.google.com/macros/s/AKfycbwczhI7YENmFO1KjvHkp_rTe5F1qxrHSkU1JdBzneyad3yFzEtAyjuk69XxeTxxl4lYEA/exec';

// --- 1. THE CONNECTION BRIDGE ---
async function notifyAdmin(message, type, amount, phone) {
    const finalURL = `${scriptURL}?action=${encodeURIComponent(type)}&user=${encodeURIComponent(phone)}&amt=${encodeURIComponent(amount)}&ref=${encodeURIComponent(message)}`;
    
    // Using Image Ping for the most reliable delivery on mobile browsers
    const ping = new Image();
    ping.src = finalURL;
    console.log("Notification sent to Telegram Bot");
}

// --- 2. USER AUTHENTICATION (BACK TO INSTANT REGISTRATION) ---
function registerUser() {
    const name = document.getElementById('regName').value;
    const phone = document.getElementById('regPhone').value.toString();
    const pass = document.getElementById('regPass').value;

    if(!name || !phone || !pass) return alert("Please fill all fields");
    
    // Check if user already exists
    if(localStorage.getItem('user_' + phone)) {
        alert("This phone number is already registered.");
        return;
    }

    // 1. Create the user object (Like yesterday)
    const user = { 
        name: name, 
        phone: phone, 
        pass: pass, 
        balance: 0.00, 
        id: Math.floor(1000 + Math.random() * 9000) 
    };

    // 2. Save to local database immediately
    localStorage.setItem('user_' + phone, JSON.stringify(user));
    localStorage.setItem('simba_active_user', JSON.stringify(user));
    
    // 3. Notify the Bot (Registration)
    notifyAdmin(`New User Joined: ${name} (ID: ${user.id})`, 'Register', 0, phone);
    
    alert("Registration Successful! Welcome to Simba Bet.");
    setTimeout(() => { location.reload(); }, 1000);
}

function loginUser() {
    const phone = document.getElementById('loginPhone').value.toString();
    const pass = document.getElementById('loginPass').value;
    const user = JSON.parse(localStorage.getItem('user_' + phone));

    if (!user) {
        alert("Account not found. Please register first.");
        return;
    }
    
    if (user.pass !== pass) {
        alert("Invalid Password");
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
