// SIMBA BET - MASTER SCRIPT (SYNCED WITH 100 ETB MIN)
const scriptURL = 'https://script.google.com/macros/s/AKfycbyr8EHHAKYy7q1QyCHVnsFZgPrX2FkAyKa_mSwh4yDz3IFHaO9dBCvN-kaNuG5hZz2P/exec'; 

async function updateDisplay() {
    const activeUser = JSON.parse(localStorage.getItem('simba_active_user'));
    if (!activeUser) return;
    try {
        const response = await fetch(`${scriptURL}?action=getUser&phone=${activeUser.phone}`);
        const data = await response.json();
        if (data && data.balance !== undefined) {
            activeUser.balance = data.balance;
            localStorage.setItem('simba_active_user', JSON.stringify(activeUser));
            if(document.getElementById('headerBalance')) {
                document.getElementById('headerBalance').innerText = parseFloat(data.balance).toFixed(2);
            }
        }
    } catch (e) { console.error("Balance update failed"); }
}

function submitDepositRequest() {
    const method = document.getElementById('method').value;
    const sName = document.getElementById('senderName').value.trim();
    const amt = document.getElementById('amount').value.trim();
    const user = JSON.parse(localStorage.getItem('simba_active_user'));

    if (!user) return alert("Please login first");
    if (!sName || !amt) return alert("እባክዎን ሁሉንም መረጃ ይሙሉ");

    // Enforcing the 100 ETB rule here as well
    if (parseFloat(amt) < 100) return alert("ዝቅተኛው ማስገቢያ 100 ብር ነው (Min 100 ETB)");

    const finalURL = `${scriptURL}?action=deposit&phone=${user.phone}&name=${encodeURIComponent(sName)}&amount=${amt}&method=${method}`;
    fetch(finalURL, { method: 'GET', mode: 'no-cors' });
    alert("ጥያቄዎ ተልኳል! (Deposit Request Sent!)");
    window.location.href = 'index.html';
}

function processWithdraw() {
    const method = document.getElementById('wdMethod').value;
    const receivePhone = document.getElementById('wdPhone').value.trim();
    const amount = parseFloat(document.getElementById('wdAmount').value);
    const user = JSON.parse(localStorage.getItem('simba_active_user'));

    if (!user) return alert("Please login first");
    if (!receivePhone || !amount) return alert("እባክዎን ሁሉንም መረጃ ይሙሉ");
    if (amount > parseFloat(user.balance)) return alert("Insufficient Balance");

    const finalURL = `${scriptURL}?action=withdraw&phone=${user.phone}&amount=${amount}&method=${method}&target=${receivePhone}`;
    fetch(finalURL, { method: 'GET', mode: 'no-cors' });
    alert("የመውጣት ጥያቄ ተልኳል!");
    window.location.href = 'index.html';
}

setInterval(updateDisplay, 30000);
window.onload = updateDisplay;
