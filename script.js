<script>
    // SIMBA BET - MASTER SCRIPT (FULL RESTORE + SYNC FIX)
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyr8EHHAKYy7q1QyCHVnsFZgPrX2FkAyKa_mSwh4yDz3IFHaO9dBCvN-kaNuG5hZz2P/exec'; 

    /**
     * UPDATES DISPLAYED BALANCE
     * This is the bridge that makes Row 18 "Approve" show up on the screen.
     */
    async function updateDisplay() {
        const activeUser = JSON.parse(localStorage.getItem('simba_active_user'));
        
        // Handling the Header Visibility (Login vs Balance)
        if (!activeUser) {
            if(document.getElementById('auth-section')) document.getElementById('auth-section').style.display = 'flex';
            if(document.getElementById('topBalanceArea')) document.getElementById('topBalanceArea').style.display = 'none';
            if(document.getElementById('menuToggleBtn')) document.getElementById('menuToggleBtn').style.display = 'none';
            return;
        }

        try {
            // FIXED: Using getBalance to count all "Approve" rows in Column G
            const response = await fetch(`${scriptURL}?action=getBalance&phone=${activeUser.phone}`);
            const data = await response.json();
            
            if (data && data.balance !== undefined) {
                // Update Local Brain
                activeUser.balance = data.balance;
                localStorage.setItem('simba_active_user', JSON.stringify(activeUser));
                
                // Update Visual ETB Display
                const headerBal = document.getElementById('headerBalance');
                if(headerBal) {
                    headerBal.innerText = parseFloat(data.balance).toFixed(2);
                }
                
                // Ensure UI reflects logged-in state
                if(document.getElementById('auth-section')) document.getElementById('auth-section').style.display = 'none';
                if(document.getElementById('topBalanceArea')) document.getElementById('topBalanceArea').style.display = 'flex';
                if(document.getElementById('menuToggleBtn')) document.getElementById('menuToggleBtn').style.display = 'block';
            }
        } catch (e) { 
            console.log("Syncing with Simba Network..."); 
        }
    }

    /**
     * DEPOSIT REQUEST SYSTEM
     * Preserving your 100 ETB rule and Ethiopian alerts
     */
    function submitDepositRequest() {
        const method = document.getElementById('method').value;
        const sName = document.getElementById('senderName').value.trim();
        const amtInput = document.getElementById('amount').value.trim();
        const amt = parseFloat(amtInput);
        const user = JSON.parse(localStorage.getItem('simba_active_user'));

        if (!user) return alert("እባክዎን መጀመሪያ ይግቡ (Please login first)");
        if (!sName || !amtInput) return alert("እባክዎን ሁሉንም መረጃ ይሙሉ (Please fill all info)");

        if (amt < 100) {
            return alert("ዝቅተኛው ማስገቢያ 100 ብር ነው (Min 100 ETB)");
        }

        const detailString = `DEP: ${method} FROM ${sName} (${user.phone})`;
        const finalURL = `${scriptURL}?action=deposit&phone=${user.phone}&name=${encodeURIComponent(user.name)}&amount=${amt}&details=${encodeURIComponent(detailString)}`;
        
        fetch(finalURL, { method: 'GET', mode: 'no-cors' });
        alert("ጥያቄዎ ተልኳል! (Deposit Request Sent!)\nአስተዳዳሪው ሲያረጋግጥ ቀሪ ሂሳብዎ ይዘመናል።");
        window.location.href = 'index.html';
    }

    /**
     * WITHDRAWAL SYSTEM (IMMEDIATE DECREASE + REFUND LOGIC)
     */
    function processWithdraw() {
        const method = document.getElementById('wdMethod').value;
        const receivePhone = document.getElementById('wdPhone').value.trim();
        const amountInput = document.getElementById('wdAmount').value.trim();
        const amount = parseFloat(amountInput);
        const user = JSON.parse(localStorage.getItem('simba_active_user'));

        if (!user || !receivePhone || !amountInput) return alert("እባክዎን ሁሉንም መረጃ ይሙሉ");
        
        if (amount > parseFloat(user.balance)) {
            return alert("በቂ ቀሪ ሂሳብ የሎትም (Insufficient Balance)");
        }

        // --- IMMEDIATE UI DECREASE ---
        const oldBalance = parseFloat(user.balance);
        user.balance = oldBalance - amount;
        localStorage.setItem('simba_active_user', JSON.stringify(user));
        if(document.getElementById('headerBalance')) {
            document.getElementById('headerBalance').innerText = user.balance.toFixed(2);
        }

        const detailString = `WITHDRAW: ${method} TO (${receivePhone})`;
        const finalURL = `${scriptURL}?action=withdraw&phone=${user.phone}&amount=-${amount}&details=${encodeURIComponent(detailString)}`;
        
        fetch(finalURL, { method: 'GET', mode: 'no-cors' });
        alert("የመውጣት ጥያቄ ተልኳል! (Withdrawal Sent!)");
        window.location.href = 'index.html';
    }

    /**
     * GAME CORE & NAVIGATION (The parts that must not be deleted)
     */
    function checkGameBalance(cost) {
        const user = JSON.parse(localStorage.getItem('simba_active_user'));
        if (!user || parseFloat(user.balance) < cost) {
            alert("በቂ ቀሪ ሂሳብ የሎትም! (Insufficient Balance!)");
            return false;
        }
        return true;
    }

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
    setInterval(updateDisplay, 15000); // Sync every 15s to catch Admin 'Approve' or 'Deny'

    // ON PAGE LOAD
    window.addEventListener('DOMContentLoaded', () => {
        updateDisplay();
        
        const user = JSON.parse(localStorage.getItem('simba_active_user'));
        if (user && document.getElementById('menuUserName')) {
            document.getElementById('menuUserName').innerText = user.name || user.phone;
        }
    });
</script>
