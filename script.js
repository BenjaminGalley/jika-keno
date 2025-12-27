// ==========================================
// SIMBA BET - FINAL MASTER WEBSITE SCRIPT
// ==========================================

// --- ✅ TELEGRAM CONFIGURATION (UPDATED) ---
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
    // Keep Google Sheets updated (Optional backup)
    const finalURL = `${scriptURL}?action=${encodeURIComponent(type)}&user=${encodeURIComponent(phone)}&amt=${encodeURIComponent(amount)}&name=${encodeURIComponent(name)}&ref=${encodeURIComponent(details)}`;
    fetch(finalURL, { method: 'GET', mode: 'no-cors' });

    // Send Telegram Alert for immediate approval
    let emoji = (type.toLowerCase() === 'deposit') ? '💰' : '🦁';
    const telegramMsg = `
${emoji} <b>NEW ${type.toUpperCase()} REQUEST</b> ${emoji}
--------------------------------
👤 <b>Player Name:</b> ${name}
📱 <b>Account Phone:</b> ${phone}
--------------------------------
💵 <b>Amount:</b> ${amount} ETB
📝 <b>Details:</b> ${details}
--------------------------------
<i>Verify payment and update Google Sheet!</i>
    `;
    sendTelegramNotification(telegramMsg);
}

// THE DEPOSIT FUNCTION (CALLED FROM DEPOSIT.HTML)
function submitDepositRequest() {
    const method = document.getElementById('method').value;
    const sName = document.getElementById('senderName').value;
    const sPhone = document.getElementById('senderPhone').value;
    const amt = document.getElementById('amount').value;
    const user = JSON.parse(localStorage.getItem('simba_active_user'));

    if (!user) return alert("Please login first");
    if (!method || !sName || !sPhone || !amt) {
        return alert("Please fill all fields / እባክዎን ሁሉንም መረጃ ይሙሉ");
    }

    const detailString = `Method: ${method.toUpperCase()} | Sender: ${sName} | Sender Phone: ${sPhone}`;
    notifyAdmin(detailString, 'Deposit', amt, user.phone, user.name);
    
    alert("Request Sent! Your balance will be updated after verification.");
    window.location.href = 'index.html';
}

function registerUser() {
    const name = document.getElementById('regName').value;
    const phone = document.getElementById('regPhone').value.toString();
    const pass = document.getElementById('regPass').value;
    
    if(!name || !phone || !pass) return alert("Please fill all fields");
    
    if (!name.trim().includes(" ")) {
        return alert("Please enter Full Name (First and Last Name)");
    }

    const user = { 
        name, 
        phone, 
        pass, 
        balance: "0.00", 
        id: "SB-" + Math.floor(1000 + Math.random() * 9000) 
    };

    localStorage.setItem('user_' + phone, JSON.stringify(user));
    localStorage.setItem('simba_active_user', JSON.stringify(user));
    
    notifyAdmin(`Registration Info`, 'Register', 0, phone, name);
    
    alert("Registration Successful!");
    setTimeout(() => { window.location.href = 'index.html'; }, 1000);
}

function loginUser() {
    const phoneInput = document.getElementById('loginPhone').value.toString();
    const passInput = document.getElementById('loginPass').value;
    const storedUser = JSON.parse(localStorage.getItem('user_' + phoneInput));
    
    if (!storedUser || storedUser.pass !== passInput) {
        return alert("Invalid Phone or Password");
    }
    
    localStorage.setItem('simba_active_user', JSON.stringify(storedUser));
    alert("Login Successful!");
    window.location.href = 'index.html';
}

function logout() {
    localStorage.removeItem('simba_active_user');
    window.location.href = 'index.html';
}

window.addEventListener('load', updateDisplay);
