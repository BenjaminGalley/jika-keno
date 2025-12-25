// SIMBA BET - MASTER WEBSITE SCRIPT
// Updated with your LATEST Web App URL
const scriptURL = 'https://script.google.com/macros/s/AKfycbxNvQO97G0jcoPMia9WF-8aQLVF0BvlS3aL3tUSM-AxEqyCEUNtl4hPwJPoyv1fFD3vxA/exec';

// --- 1. USER AUTHENTICATION ---
function registerUser() {
    const name = document.getElementById('regName').value;
    const phone = document.getElementById('regPhone').value.toString();
    const pass = document.getElementById('regPass').value;

    if(!name || !phone || !pass) {
        alert("Please fill all fields");
        return;
    }
    
    if(localStorage.getItem('user_' + phone)) {
        alert("User already exists");
        return;
    }

    const user = { name, phone, pass, balance: 0.00, id: Math.floor(1000 + Math.random() * 9000) };
    localStorage.setItem('user_' + phone, JSON.stringify(user));
    localStorage.setItem('simba_active_user', JSON.stringify(user));
    
    // Notify Admin via Telegram
    notifyAdmin(`New User: ${name} (ID: ${user.id})`, 'register', 0, phone);
    
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

// --- 2. THE CONNECTION BRIDGE ---
async function notifyAdmin(message, type, amount, phone) {
    const finalURL = `${scriptURL}?action=${type}&user=${phone}&amt=${amount}&ref=${encodeURIComponent(message)}`;
    
    // We use 'no-cors' so the browser doesn't block the request to Google
    fetch(finalURL, { mode: 'no-cors' })
    .then(() => console.log("Notification sent successfully"))
    .catch(err => console.error("Error sending notification:", err));
}

// --- 3. UI & SYSTEM ---
function updateDisplay() {
    const activeUser = JSON.parse(localStorage.getItem('simba_active_user'));
    const authSection = document.getElementById('auth-section');
    const headerBal = document.getElementById('headerBalance');
    const menuName = document.getElementById('menuUserName');

    if (activeUser) {
        if(authSection) authSection.innerHTML = `<span style="color:#fbbf24; font-weight:bold;">ID: ${activeUser.id}</span>`;
        if(headerBal) headerBal.innerText = parseFloat(activeUser.balance).toFixed(2);
        if(menuName) menuName.innerText = activeUser.name;
    }
}

window.onload = updateDisplay;
