// SIMBA BET - MASTER WEBSITE SCRIPT
// Updated with your latest Web App URL
const scriptURL = 'https://script.google.com/macros/s/AKfycbzs7hBnR1cqyIts0jrh_6E863BvYjxeDwwFGTgHajzbK3pP_cB_FOPuLK6MMkuA5OpDgQ/exec';

// --- 1. USER AUTHENTICATION ---
function registerUser() {
    const name = document.getElementById('regName').value;
    const phone = document.getElementById('regPhone').value;
    const pass = document.getElementById('regPass').value;

    if(!name || !phone || !pass) return showToast("Please fill all fields");
    if(localStorage.getItem('user_' + phone)) return showToast("User already exists");

    const user = { name, phone, pass, balance: 0.00, id: Math.floor(1000 + Math.random() * 9000) };
    localStorage.setItem('user_' + phone, JSON.stringify(user));
    localStorage.setItem('simba_active_user', JSON.stringify(user));
    
    // Notify Admin of new registration
    notifyAdmin(`New User: ${name} (ID: ${user.id})`, 'register', 0, phone);
    
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

function logout() {
    localStorage.removeItem('simba_active_user');
    location.reload();
}

// --- 2. THE CONNECTION BRIDGE ---
// This function bridges your HTML buttons to your Google Script
async function notifyAdmin(message, type, amount, phone) {
    const url = `${scriptURL}?action=${type}&user=${phone}&amt=${amount}&ref=${encodeURIComponent(message)}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === 'success') {
            console.log("Admin notified successfully");
        }
    } catch (error) {
        console.error('Error contacting Google Script:', error);
    }
}

// --- 3. UI & SYSTEM ---
function updateDisplay() {
    const activeUser = JSON.parse(localStorage.getItem('simba_active_user'));
    const authSection = document.getElementById('auth-section');
    const headerBal = document.getElementById('headerBalance');

    if (activeUser) {
        if(authSection) authSection.innerHTML = `<span style="color:#fbbf24; font-weight:bold;">ID: ${activeUser.id}</span>`;
        if(headerBal) headerBal.innerText = parseFloat(activeUser.balance).toFixed(2);
    }
}

function showToast(msg) {
    alert(msg); 
}

window.onload = updateDisplay;
