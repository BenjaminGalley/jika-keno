// ==========================================
// SIMBA BET - FINAL MASTER WEBSITE SCRIPT
// ==========================================

// --- ✅ TELEGRAM CONFIGURATION ---
const BOT_TOKEN = '8048151095:AAHHJfE21m9JIcGTNOLdzvG8lMfWM16TJOY'; 
const CHAT_ID = '5900337528';
// ------------------------------------

const scriptURL = 'https://script.google.com/macros/s/AKfycbw_f5jOBsyRmlYYqtty_SA7ypZ3Vcv94KHeJV6whxAEuyUQlm-JsNSImEJlb6XofbGs/exec'; 

// FETCHES THE APPROVED BALANCE FROM GOOGLE
async function updateDisplay() {
    const activeUser = JSON.parse(localStorage.getItem('simba_active_user'));
    if (activeUser) {
        try {
            const response = await fetch(`${scriptURL}?action=getBalance&user=${activeUser.phone}`);
            const realBalance = await response.text();
            
            if (!isNaN(realBalance)) {
                activeUser.balance = realBalance;
                localStorage.setItem('simba_active_user', JSON.stringify(activeUser));
            }
        } catch (e) { 
            console.error("Balance update failed"); 
        }

        if(document.getElementById('headerBalance')) document.getElementById('headerBalance').innerText = activeUser.balance;
        if(document.getElementById('displayUserID')) {
            const uid = activeUser.id || "SB-" + activeUser.phone.toString().slice(-4);
            document.getElementById('displayUserID').innerText = uid;
        }
    }
}

// SENDS NOTIFICATION TO YOUR TELEGRAM PHONE
async function sendTelegramNotification(message) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });
    } catch (error) {
        console.error("Telegram Notification Failed", error);
    }
}

async function notifyAdmin(details, type, amount, phone, name) {
    // Keep Google Sheets updated
    const finalURL = `${scriptURL}?action=${encodeURIComponent(type)}&user=${encodeURIComponent(phone)}&amt=${encodeURIComponent(amount)}&name=${encodeURIComponent(name)}&ref=${encodeURIComponent(details)}`;
    fetch(finalURL, { method: 'GET', mode: 'no-cors' });

    // Choose emoji
    let emoji = '🦁';
    if (type.toLowerCase() === 'deposit') emoji = '💰';
    if (type.toLowerCase() === 'withdraw') emoji = '💸';
    if (type.toLowerCase() === 'register') emoji = '👤';

    const telegramMsg = `
${emoji} <b>NEW ${type.toUpperCase()} REQUEST</b> ${emoji}
--------------------------------
👤 <b>Name:</b> ${name}
📱 <b>Phone:</b> ${phone}
--------------------------------
💵 <b>Amount/Action:</b> ${amount} ETB
📝 <b>Details:</b> ${details}
--------------------------------
<i>Action Required!</i>
    `;
    sendTelegramNotification(telegramMsg);
}

// THE DEPOSIT FUNCTION
function submitDepositRequest() {
    const method = document.getElementById('method').value;
    const sName = document.getElementById('senderName').value;
    const sPhone = document.getElementById('senderPhone').value;
    const amt = document.getElementById('amount').value;
    const user = JSON.parse(localStorage.getItem('simba_active_user'));

    if (!user) return alert("Please login first");
    if (!method || !sName || !sPhone || !amt) return alert("እባክዎን ሁሉንም መረጃ ይሙሉ");

    const detailString = `Method: ${method.toUpperCase()} | Sender: ${sName} | Sender Phone: ${sPhone}`;
    notifyAdmin(detailString, 'Deposit', amt, user.phone, user.name);
    
    alert("Request Sent! Your balance will be updated after verification.");
    window.location.href = 'index.html';
}

// THE WITHDRAWAL FUNCTION
function processWithdraw() {
    const method = document.getElementById('wdMethod').value;
    const receivePhone = document.getElementById('wdPhone').value;
    const amount = parseFloat(document.getElementById('wdAmount').value);
    const user = JSON.parse(localStorage.getItem('simba_active_user'));

    if (!user) return alert("Please login first");
    if (!receivePhone || !amount) return alert("እባክዎን ሁሉንም መረጃ ይሙሉ");
    if (amount < 100 || amount > 10000) return alert("Min: 100, Max: 10,000");
    if (amount > parseFloat(user.balance)) return alert("Insufficient Balance");

    const detailString = `Withdrawal to: ${method} | Phone: ${receivePhone}`;
    notifyAdmin(detailString, 'Withdraw', amount, user.phone, user.name);
    
    alert("Request Sent!");
    window.location.href = 'index.html';
}

// THE REGISTER FUNCTION
function processRegistration(name, phone, pass) {
    const user = { 
        name, 
        phone, 
        pass, 
        balance: "0.00", 
        id: "SB-" + Math.floor(1000 + Math.random() * 9000) 
    };

    // Save locally
    localStorage.setItem('user_' + phone, JSON.stringify(user));
    
    // Notify Bot
    notifyAdmin(`New User Registration. Password: ${pass}`, 'Register', 0, phone, name);
}

function loginUser() {
    const phoneInput = document.getElementById('loginPhone').value.toString();
    const passInput = document.getElementById('loginPass').value;
    const storedUser = JSON.parse(localStorage.getItem('user_' + phoneInput));
    if (!storedUser || storedUser.pass !== passInput) return alert("Invalid Phone or Password");
    localStorage.setItem('simba_active_user', JSON.stringify(storedUser));
    alert("Login Successful!");
    window.location.href = 'index.html';
}

function logout() {
    localStorage.removeItem('simba_active_user');
    window.location.href = 'index.html';
}

window.addEventListener('load', updateDisplay);
