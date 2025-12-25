// ===============================
// SIMBA BET - MASTER WEBSITE SCRIPT
// ===============================

// --- 1. GOOGLE SCRIPT URL (Your New Deployment) ---
const scriptURL = 'https://script.google.com/macros/s/AKfycby6hEBXA4DZPU3hoWEWW0zNyNH5YdBAEV9ZYyJ8-hJmoJMag1_14LtJwQiNkKi4x7fHUQ/exec';

// --- 2. SEND NOTIFICATIONS TO ADMIN (Deposit / Withdraw / Register) ---
async function notifyAdmin(details, type, amount, phone, name) {
  const finalURL = `${scriptURL}?action=${encodeURIComponent(type)}&user=${encodeURIComponent(phone)}&amt=${encodeURIComponent(amount)}&ref=${encodeURIComponent(details)}&name=${encodeURIComponent(name)}`;
  
  // Using Image ping to avoid CORS issues on mobile
  const ping = new Image();
  ping.src = finalURL;

  console.log(`${type} Notification Sent to Admin: ${name} - ${phone} - ${amount}`);
}

// --- 3. USER AUTHENTICATION ---
function registerUser() {
  const name = document.getElementById('regName').value;
  const phone = document.getElementById('regPhone').value.toString();
  const pass = document.getElementById('regPass').value;

  if(!name || !phone || !pass) return alert("Please fill all fields");
  
  if(localStorage.getItem('user_' + phone)) {
      alert("Phone already registered");
      return;
  }

  // ❗ TEMPORARY: do not create user yet, admin must approve
  const pendingUser = { 
      name: name, 
      phone: phone, 
      pass: pass, 
      balance: 0.00, 
      id: Math.floor(1000 + Math.random() * 9000) 
  };
  localStorage.setItem('pending_register_' + phone, JSON.stringify(pendingUser));

  // Notify admin
  notifyAdmin(`New registration request`, 'Register', 0, phone, name);

  alert("Registration request sent! Waiting for admin approval.");
  setTimeout(() => { location.href = 'login.html'; }, 1000);
}

function loginUser() {
  const phone = document.getElementById('loginPhone').value.toString();
  const pass = document.getElementById('loginPass').value;
  const user = JSON.parse(localStorage.getItem('user_' + phone));

  if (!user || user.pass !== pass) {
      alert("Invalid Phone or Password");
      return;
  }

  localStorage.setItem('simba_active_user', JSON.stringify(user));
  alert("Login Successful!");
  setTimeout(() => { location.reload(); }, 1000);
}

function logout() {
  localStorage.removeItem('simba_active_user');
  location.reload();
}

// --- 4. UPDATE HEADER BALANCE & AUTH DISPLAY ---
function updateDisplay() {
  const activeUser = JSON.parse(localStorage.getItem('simba_active_user'));
  const headerBal = document.getElementById('headerBalance');
  const authSection = document.getElementById('auth-section');

  if (activeUser) {
      if(headerBal) headerBal.innerText = parseFloat(activeUser.balance).toFixed(2);
      if(authSection) authSection.innerHTML = `<span style="color:gold; font-weight:bold;">ID: ${activeUser.id}</span>`;
  }
}

window.onload = updateDisplay;

// --- 5. DEPOSIT FUNCTION ---
function processDeposit() {
  const method = document.getElementById('depMethod').value;
  const phone = document.getElementById('depPhone').value;
  const amount = Number(document.getElementById('depAmount').value);
  const user = JSON.parse(localStorage.getItem('simba_active_user'));

  if(!user) return alert("Please login first");
  if(!phone || !amount) return alert("Fill all fields");
  if(amount < 100 || amount > 10000) return alert("Limit: 100 - 10,000 ETB");

  const details = `Method: ${method}, Paid from: ${phone}`;
  
  notifyAdmin(details, 'Deposit', amount, user.phone, user.name);
  
  alert("Request sent to Admin! Your balance will update once approved.");
  window.location.href = 'index.html';
}

// --- 6. WITHDRAW FUNCTION ---
function processWithdraw() {
  const method = document.getElementById('wdMethod').value;
  const receivePhone = document.getElementById('wdPhone').value;
  const amount = Number(document.getElementById('wdAmount').value);
  const user = JSON.parse(localStorage.getItem('simba_active_user'));

  if (!user) {
    alert("Please login first");
    return;
  }
  if (!receivePhone || !amount) {
    alert("Fill all fields");
    return;
  }
  if (amount < 100) {
    alert("Minimum withdrawal is 100 ETB");
    return;
  }
  if (amount > user.balance) {
    alert("Insufficient balance");
    return;
  }

  const details = `Method: ${method}, Send to: ${receivePhone}`;
  notifyAdmin(details, 'Withdraw', amount, user.phone, user.name);

  alert("Withdrawal request sent. Waiting for admin approval.");
  window.location.href = 'index.html';
}
