// ===============================
// SIMBA BET - WEBSITE MAIN SCRIPT
// ===============================

// 🔗 GOOGLE APPS SCRIPT WEB APP URL
// (You already have this – keep it exactly)
const scriptURL =
  "https://script.google.com/macros/s/AKfycbwczhI7YENmFO1KjvHkp_rTe5F1qxrHSkU1JdBzneyad3yFzEtAyjuk69XxeTxxl4lYEA/exec";

// ===============================
// SEND DEPOSIT TO TELEGRAM BOT
// ===============================
async function notifyAdmin(details, type, amount, phone, name) {

  const finalURL =
    `${scriptURL}` +
    `?action=${encodeURIComponent(type)}` +
    `&name=${encodeURIComponent(name)}` +
    `&user=${encodeURIComponent(phone)}` +
    `&amt=${encodeURIComponent(amount)}` +
    `&ref=${encodeURIComponent(details)}`;

  try {
    // RELIABLE METHOD (works on GitHub Pages & mobile)
    await fetch(finalURL, {
      method: "GET",
      mode: "no-cors"
    });

    console.log("✅ Deposit notification sent");

  } catch (err) {
    console.error("❌ Failed to notify admin", err);
  }
}

// ===============================
// USER REGISTRATION
// ===============================
function registerUser() {
  const name = document.getElementById("regName").value;
  const phone = document.getElementById("regPhone").value.toString();
  const pass = document.getElementById("regPass").value;

  if (!name || !phone || !pass) {
    alert("Please fill all fields");
    return;
  }

  if (localStorage.getItem("user_" + phone)) {
    alert("Phone already registered");
    return;
  }

  const user = {
    name: name,
    phone: phone,
    pass: pass,
    balance: 0,
    id: Math.floor(1000 + Math.random() * 9000)
  };

  localStorage.setItem("user_" + phone, JSON.stringify(user));
  localStorage.setItem("simba_active_user", JSON.stringify(user));

  notifyAdmin(
    "New user registered",
    "Register",
    0,
    phone,
    name
  );

  alert("Registration successful");
  location.reload();
}

// ===============================
// LOGIN
// ===============================
function loginUser() {
  const phone = document.getElementById("loginPhone").value.toString();
  const pass = document.getElementById("loginPass").
