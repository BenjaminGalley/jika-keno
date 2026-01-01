<script>
    // SIMBA BET - MASTER SCRIPT (COMPLETE VERSION)
    // Synchronized with Admin Approval and Google Sheets
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyr8EHHAKYy7q1QyCHVnsFZgPrX2FkAyKa_mSwh4yDz3IFHaO9dBCvN-kaNuG5hZz2P/exec'; 

    /**
     * BALANCE & DISPLAY SYNC
     * This ensures the player's balance updates in real-time when you click "Approve"
     */
    async function updateDisplay() {
        const activeUser = JSON.parse(localStorage.getItem('simba_active_user'));
        if (!activeUser) {
            // If no user, ensure auth buttons are visible
            if(document.getElementById('auth-section')) document.getElementById('auth-section').style.display = 'flex';
            if(document.getElementById('topBalanceArea')) document.getElementById('topBalanceArea').style.display = 'none';
            return;
        }

        try {
            // FIXED: Using 'getBalance' to talk to the Google Script correctly
            const response = await fetch(`${scriptURL}?action=getBalance&phone=${activeUser.phone}`);
            const data = await response.json();
            
            if (data && data.balance !== undefined) {
                activeUser.balance = data.balance;
                localStorage.setItem('simba_active_user', JSON.stringify(activeUser));
                
                // Update UI Elements
                const headerBal = document.getElementById('headerBalance');
                if(headerBal) {
                    headerBal.innerText = parseFloat(data.balance).toFixed(2);
                }
                
                // Ensure User Area is visible
                if(document.getElementById('auth-section')) document.getElementById('auth-section').style.display = 'none';
                if(document.getElementById('topBalanceArea')) document.getElementById('topBalanceArea').style.display = 'flex';
                if(document.getElementById('menuToggleBtn')) document.getElementById('menuToggleBtn').style.display = 'block';
            }
        } catch (e) { 
            console.log("Syncing balance..."); 
        }
    }

    /**
     * DEPOSIT SYSTEM
     * Preserves your 100 ETB minimum and sender name logic
     */
    function submitDepositRequest() {
        const method = document.getElementById('method').value;
        const sName = document.getElementById('senderName').value.trim();
        const amtInput = document.getElementById('amount').value.trim();
        const amt = parseFloat(amtInput);
        const user = JSON.parse(localStorage.getItem('simba_active_user'));

        if (!user) return alert("እባክዎን መጀመሪያ ይግቡ (Please login first)");
        if (!sName || !amtInput) return alert("እባክዎን ሁሉንም መረጃ ይሙሉ (Please fill all info)");

        // 100 ETB Minimum Rule
        if (amt < 100) {
            return alert("ዝቅተኛው ማስገቢያ 100 ብር ነው (Min 100 ETB)");
        }

        // Format details for the Admin Page to read easily
        const detailString = `DEP: ${method} FROM ${sName} (${user.phone})`;
        
        // Final URL for Google Sheet
        const finalURL = `${scriptURL}?action=deposit&phone=${user.phone}&name=${encodeURIComponent(user.name)}&amount=${amt}&details=${encodeURIComponent(detailString)}`;
        
        // Send to sheet (no-cors for speed)
        fetch(finalURL, { method: 'GET', mode: 'no-cors' });
        
        alert("ጥያቄዎ ተልኳል! (Request Sent!)\nአስተዳዳሪው ሲያረጋግጥ ቀሪ ሂሳብዎ ይዘመናል።");
        window.location.href = 'index.html';
    }

    /**
     * WITHDRAWAL SYSTEM
     * Hand-in-hand with Admin and Google
     */
    function processWithdraw() {
        const method = document.getElementById('wdMethod').value;
        const receivePhone = document.getElementById('wdPhone').value.trim();
        const amountInput = document.getElementById('wdAmount').value.trim();
        const amount = parseFloat(amountInput);
        const user = JSON.parse(localStorage.getItem('simba_active_user'));

        if (!user) return alert("Please login first");
        if (!receivePhone || !amountInput) return alert("እባክዎን ሁሉንም መረጃ ይሙሉ");
        
        if (amount > parseFloat(user.balance)) {
            return alert("በቂ ቀሪ ሂሳብ የሎትም (Insufficient Balance)");
        }

        const detailString = `WITHDRAW: ${method} TO (${receivePhone})`;
        
        // Sends negative amount to Google Sheet
        const finalURL = `${scriptURL}?action=withdraw&phone=${user.phone}&amount=-${amount}&details=${encodeURIComponent(detailString)}`;
        
        fetch(finalURL, { method: 'GET', mode: 'no-cors' });
        
        alert("የመውጣት ጥያቄ ተልኳል! Admin will process it soon.");
        window.location.href = 'index.html';
    }

    /**
     * GAME CORE LOGIC
     * This is the "Hard Work" part—ensures games have balance to play
     */
    function checkGameBalance(cost) {
        const user = JSON.parse(localStorage.getItem('simba_active_user'));
        if (!user || parseFloat(user.balance) < cost) {
            alert("በቂ ቀሪ ሂሳብ የሎትም! እባክዎን ሂሳብዎን ይሙሉ (Insufficient Balance!)");
            window.location.href = 'deposit.html';
            return false;
        }
        return true;
    }

    /**
     * NAVIGATION & MENU
     */
    function toggleMenu() {
        const menu = document.getElementById('sideMenu');
        if (menu) {
            menu.style.left = (menu.style.left === '0px') ? '-260px' : '0px';
        }
    }

    function logout() {
        if(confirm("ለመውጣት እርግጠኛ ነዎት? (Logout?)")) {
            localStorage.removeItem('simba_active_user');
            window.location.href = 'login.html';
        }
    }

    // INTERVALS
    // Updates balance every 15 seconds to catch your manual approvals
    setInterval(updateDisplay, 15000);

    // Run once on load
    window.addEventListener('DOMContentLoaded', () => {
        updateDisplay();
        
        // Set user name in menu if it exists
        const user = JSON.parse(localStorage.getItem('simba_active_user'));
        const menuName = document.getElementById('menuUserName');
        if (user && menuName) {
            menuName.innerText = user.name || user.phone;
        }
    });
</script>
