// CONFIGURATION
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
    
    // Log in locally
    localStorage.setItem('simba_active_user', JSON.stringify(user));
    
    // SEND TO GOOGLE SCRIPT & BOT
    sendToGoogle('register', phone, 0, `New User: ${name} (ID: ${user.id})`);
    
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

// --- 2. THE CONNECTION BRIDGE (Google Script) ---
async function sendToGoogle(action, user, amt, detail) {
    const url = `${scriptURL}?action=${action}&user=${user}&amt=${amt}&ref=${detail}`;
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

// Call this function when someone clicks "Deposit"
function handleDeposit(amount, reference) {
    const activeUser = JSON.parse(localStorage.getItem('simba_active_user'));
    if (!activeUser) return showToast("Please login first");
    
    sendToGoogle('deposit', activeUser.phone, amount, reference);
    showToast("Deposit request sent!");
}

// --- 3. UI & SYSTEM ---
function updateDisplay() {
    const activeUser = JSON.parse(localStorage.getItem('simba_active_user'));
    const authSection = document.getElementById('auth-section');
    const headerBal = document.getElementById('headerBalance');

    if (activeUser) {
        if(authSection) authSection.innerHTML = `<span>ID: ${activeUser.id}</span>`;
        if(headerBal) headerBal.innerText = parseFloat(activeUser.balance).toFixed(2);
    }
}

function showToast(msg) {
    alert(msg); // Simplified for testing
}

window.onload = updateDisplay;
