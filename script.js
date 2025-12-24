// SIMBA BET CORE ENGINE
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwJR101WlDBmvIyQAhBhAwrnvhDMg-w0BV-dL3wEQqtlnLLqtThJKJJA7YrUd8zMB8y/exec";
const BOT_TOKEN = "8048151095:AAHHJfE21m9JIcGTNOLDzvG81MfWWM16TJ0Y";
const ADMIN_CHAT_ID = "6688537446";

// 1. UPDATE DISPLAY & SYNC BALANCE
function updateDisplay() {
    const activeUser = JSON.parse(localStorage.getItem('simba_active_user'));
    const balEl = document.getElementById('balanceAmount') || document.getElementById('gameBalance');
    if (activeUser && balEl) {
        balEl.innerText = parseFloat(activeUser.balance).toFixed(2);
    }
}

// 2. SEND NOTIFICATION TO ADMIN BOT
function notifyAdmin(message, type, amount, phone) {
    const inlineKeyboard = {
        inline_keyboard: [[
            { text: "✅ APPROVE", callback_data: `confirm_${type}_${amount}_${phone}` },
            { text: "❌ REJECT", callback_data: `reject_${type}_${amount}_${phone}` }
        ]]
    };

    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: ADMIN_CHAT_ID,
            text: message,
            parse_mode: 'HTML',
            reply_markup: inlineKeyboard
        })
    }).then(res => res.json()).then(data => {
        console.log("Admin notified:", data);
    });
}

// 3. AUTOMATIC BALANCE WATCHER (Checks every 3 seconds)
function startBalanceWatcher() {
    setInterval(() => {
        const activeUser = JSON.parse(localStorage.getItem('simba_active_user'));
        if (!activeUser) return;

        // Check the individual user storage for changes made by the system
        const globalUser = JSON.parse(localStorage.getItem(`user_${activeUser.phone}`));
        
        if (globalUser && globalUser.balance !== activeUser.balance) {
            console.log("Balance change detected! Syncing...");
            activeUser.balance = globalUser.balance;
            localStorage.setItem('simba_active_user', JSON.stringify(activeUser));
            updateDisplay();
        }
    }, 3000);
}

// 4. TOAST NOTIFICATIONS
function showToast(msg) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.innerText = msg;
        toast.className = "toast-visible";
        setTimeout(() => { toast.className = "toast-hidden"; }, 3000);
    } else {
        alert(msg);
    }
}

window.onload = () => {
    updateDisplay();
    startBalanceWatcher();
};
