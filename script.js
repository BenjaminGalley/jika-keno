// ==========================================
// SIMBA BET - MASTER WEBSITE SCRIPT (LOGIC V3)
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
    const finalURL = `${scriptURL}?action=${encodeURIComponent(type)}&user=${encodeURIComponent(phone)}&amt=${encodeURIComponent(amount)}&name=${encodeURIComponent(name)}&ref=${encodeURIComponent(details)}`;
    fetch(finalURL, { method: 'GET', mode: 'no-cors' });

    let emoji = '🦁';
    let displayAmount = amount;
    
    if (type.toLowerCase() === 'deposit') emoji = '💰';
    if (type.toLowerCase() === 'withdraw') {
        emoji = '💸';
        displayAmount = Math.abs(amount);
    }
    if (type.toLowerCase() === 'register') {
        emoji = '👤';
        displayAmount = "NEW ACCOUNT";
    }

    const telegramMsg = `
${emoji} <b>NEW ${type.toUpperCase()} REQUEST</b> ${emoji}
--------------------------------
👤 <b>Name:</b> ${name}
📱 <b>Phone:</b> ${phone}
--------------------------------
💵 <b>Amount:</b> ${displayAmount} ${typeof displayAmount === 'number' ? 'ETB' : ''}
📝 <b>Details:</b> ${details}
--------------------------------
<i>Verify on Google Sheet to Approve!</i>
    `;
    sendTelegramNotification(telegramMsg);
}

// THE DEPOSIT FUNCTION (FIXED: NO AUTO-ADD, 100 MIN)
function submitDepositRequest() {
    const method = document.getElementById('method').value;
    const sName = document.getElementById('senderName').value;
    const sPhone = document.getElementById('senderPhone').value;
    const amt = parseFloat(document.getElementById('amount').value);
    const user = JSON.parse(localStorage.getItem('simba_active_user'));

    if (!user) return alert("Please login first");
    if (!method || !sName || !sPhone || !amt) return alert("እባክዎን ሁሉንም መረጃ ይሙሉ");

    if (amt < 100) return alert("ዝቅተኛው ማስገቢያ 100 ብር ነው (Minimum Deposit is 100 ETB)");

    // NOTE: We do NOT update user.balance locally here. 
    // It only updates when updateDisplay() fetches from Google after you approve.

    const detailString = `Method: ${method.toUpperCase()} | Sender: ${sName} | Phone: ${sPhone}`;
    notifyAdmin(detailString, 'Deposit', amt, user.phone, user.name);
    
    alert("ጥያቄዎ ተልኳል! ገንዘቡ ሲረጋገጥ ሂሳብዎ ላይ ይጨመራል። (Request Sent! Balance will update after verification.)");
    window.location.href = 'index.html';
}

// THE WITHDRAWAL FUNCTION (FIXED: AUTO-SUBTRACT, 100 MIN)
function processWithdraw() {
    const method = document.getElementById('wdMethod').value;
    const receivePhone = document.getElementById('wdPhone').value;
    const amount = parseFloat(document.getElementById('wdAmount').value);
    const user = JSON.parse(localStorage.getItem('simba_active_user'));

    if (!user) return alert("Please login first");
    if (!receivePhone || !amount) return alert("እባክዎን ሁሉንም መረጃ ይሙሉ");
    
    if (amount < 100) return alert("ዝቅተኛው ወጪ 100 ብር ነው (Minimum withdrawal is 100 ETB)");
    if (amount > 10000) return alert("ከፍተኛው ወጪ 10,000 ብር ነው");
    
    if (amount > parseFloat(user.balance)) return alert("በቂ ሂሳብ የለዎትም (Insufficient Balance)");

    // SUBTRACT IMMEDIATELY (Locks the funds)
    user.balance = (parseFloat(user.balance) - amount).toFixed(2);
    localStorage.setItem('simba_active_user', JSON.stringify(user));

    const detailString = `Withdraw to: ${method} | Phone: ${receivePhone}`;
    const negativeAmount = -Math.abs(amount);
    
    notifyAdmin(detailString, 'Withdraw', negativeAmount, user.phone, user.name);
    
    alert("የወጪ ጥያቄዎ ተልኳል! (Withdrawal request sent!)");
    window.location.href = 'index.html';
}

function processRegistration(name, phone, pass) {
    const generatedID = "SB-" + Math.floor(1000 + Math.random() * 9000);
    const user = { name, phone, pass, balance: "0.00", id: generatedID };
    localStorage.setItem('user_' + phone, JSON.stringify(user));
    notifyAdmin(`ID: ${generatedID} | Password: ${pass}`, 'Register', 0, phone, name);
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
