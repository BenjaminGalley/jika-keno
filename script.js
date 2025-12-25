// SIMBA BET - MASTER WEBSITE SCRIPT
// This URL matches the one shown in your Google Script screenshot
const scriptURL = 'https://script.google.com/macros/s/AKfycbzs7hBnR1cqyIts0jrh_6E863BvYjxeDwwFGTgHajzbK3pP_cB_FOPuLK6MMkuA5OpDgQ/exec';

// --- 1. USER AUTHENTICATION ---
function registerUser() {
    const name = document.getElementById('regName').value;
    const phone = document.getElementById('regPhone').value.toString();
    const pass = document.getElementById('regPass').value;

    if(!name || !phone || !pass) return alert("Please fill all fields");
    
    const user = { name, phone, pass, balance: 0.00, id: Math.floor(1000 + Math.random() * 9000) };
    localStorage.setItem('user_' + phone, JSON.stringify(user));
    localStorage.setItem('simba_active_user', JSON.stringify(user));
    
    // Notify Admin via Telegram
    notifyAdmin(`New Registration: ${name}`, 'register', 0, phone);
    
    alert("Registration Successful!");
    setTimeout(() => location.reload(), 1000);
}

function loginUser() {
    const phone = document.getElementById('loginPhone').value.toString();
    const pass = document.getElementById('loginPass').value;
    const user = JSON.parse(localStorage.getItem('user_' + phone));

    if (!user || user.pass !== pass) return alert("Invalid Login");

    localStorage.setItem('simba_active_user', JSON.stringify(user));
    alert("Login Successful!");
    setTimeout(() => location.reload(), 1000);
}

// --- 2. THE CONNECTION BRIDGE ---
async function notifyAdmin(message, type, amount, phone) {
    const finalURL = `${scriptURL}?action=${type}&user=${phone}&amt=${amount}&ref=${encodeURIComponent(message)}`;
    
    // We use 'no-cors' mode so your phone browser doesn't block the request
    fetch(finalURL, { mode: 'no-cors' })
    .then(() => console.log("Data sent to Google Script"))
    .catch(err => console.error("Connection Error:", err));
}

// --- 3. UI DISPLAY ---
function updateDisplay() {
    const activeUser = JSON.parse(localStorage.getItem('simba_active_user'));
    const authSection = document.getElementById('auth-section');
    const headerBal = document.getElementById('headerBalance');

    if (activeUser) {
        if(authSection) authSection.innerHTML = `<span style="color:gold; font-weight:bold;">ID: ${activeUser.id}</span>`;
        if(headerBal) headerBal.innerText = parseFloat(activeUser.balance).toFixed(2);
    }
}

window.onload = updateDisplay;
