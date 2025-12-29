// ==========================================
// SIMBA BET - MASTER WEBSITE SCRIPT (FINAL)
// ==========================================

// ✅ MATCHES YOUR CORRECT GOOGLE SCRIPT DEPLOYMENT
const scriptURL = 'https://script.google.com/macros/s/AKfycbzeG_Ua6ZYrvIcmVjfuwgn8DY2ddCABFYhkvzMg4ieOnBiLDB57t9HXyYpN89gpMpIj2g/exec'; 

// 1. SYNC BALANCE FROM GOOGLE
async function updateDisplay() {
    const activeUser = JSON.parse(localStorage.getItem('simba_active_user'));
    if (!activeUser) return;

    try {
        // Uses phone parameter to match your Google Script doGet logic
        const response = await fetch(`${scriptURL}?action=getUser&phone=${activeUser.phone}`);
        const data = await response.json();
        
        if (data && data.balance !== undefined) {
            activeUser.balance = data.balance;
            localStorage.setItem('simba_active_user', JSON.stringify(activeUser));
            
            if(document.getElementById('headerBalance')) {
                document.getElementById('headerBalance').innerText = parseFloat(data.balance).toFixed(2);
            }
        }
    } catch (e) { 
        console.error("Balance update failed"); 
    }
}

// 2. SUBMIT DEPOSIT (Sends data to Google Script which alerts Telegram)
function submitDepositRequest() {
    const method = document.getElementById('method').value;
    const sName = document.getElementById('senderName').value.trim();
    const amt = document.getElementById('amount').value.trim();
    const user = JSON.parse(localStorage.getItem('simba_active_user'));

    if (!user) return alert("Please login first");
    if (!sName || !amt) return alert("እባክዎን ሁሉንም መረጃ ይሙሉ (Fill all info)");

    if (parseFloat(amt) < 100) return alert("ዝቅተኛው ማስገቢያ 100 ብር ነው (Min 100 ETB)");

    // ✅ MATCHES GOOGLE SCRIPT PARAMETERS: action, phone, name, amount, method
    const finalURL = `${scriptURL}?action=deposit&phone=${user.phone}&name=${encodeURIComponent(sName)}&amount=${amt}&method=${method}`;
    
    fetch(finalURL, { method: 'GET', mode: 'no-cors' });
    
    alert("ጥያቄዎ ተልኳል! (Deposit Request Sent!)");
    window.location.href = 'index.html';
}

// 3. PROCESS WITHDRAWAL
function processWithdraw() {
    const method = document.getElementById('wdMethod').value;
    const receivePhone = document.getElementById('wdPhone').value.trim();
    const amount = parseFloat(document.getElementById('wdAmount').value);
    const user = JSON.parse(localStorage.getItem('simba_active_user'));

    if (!user) return alert("Please login first");
    if (!receivePhone || !amount) return alert("እባክዎን ሁሉንም መረጃ ይሙሉ");
