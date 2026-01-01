<script>
    // SIMBA BET MASTER - SYNCED & SECURE
    const scriptURL = 'PASTE_YOUR_NEW_DEPLOY_URL_HERE'; 

    /**
     * BALANCE SYNC: The "Bridge"
     * This fixes the 0.00 ETB by correctly asking the Sheet for 'getBalance'
     */
    async function updateDisplay() {
        const user = JSON.parse(localStorage.getItem('simba_active_user'));
        if (!user) {
            if(document.getElementById('auth-section')) document.getElementById('auth-section').style.display = 'flex';
            if(document.getElementById('topBalanceArea')) document.getElementById('topBalanceArea').style.display = 'none';
            return;
        }

        try {
            const response = await fetch(`${scriptURL}?action=getBalance&phone=${user.phone}`);
            const data = await response.json();
            
            if (data && data.balance !== undefined) {
                user.balance = data.balance;
                localStorage.setItem('simba_active_user', JSON.stringify(user));
                
                const balHeader = document.getElementById('headerBalance');
                if(balHeader) balHeader.innerText = parseFloat(data.balance).toFixed(2);
                
                if(document.getElementById('auth-section')) document.getElementById('auth-section').style.display = 'none';
                if(document.getElementById('topBalanceArea')) document.getElementById('topBalanceArea').style.display = 'flex';
            }
        } catch (e) { 
            console.log("Network sync in progress..."); 
        }
    }

    /**
     * GAME GATEKEEPER: DO NOT DELETE
     * Your Scratch and Multiplier games call this to allow/block play.
     */
    function checkGameBalance(cost) {
        const user = JSON.parse(localStorage.getItem('simba_active_user'));
        if (!user || parseFloat(user.balance) < cost) {
            alert("Insufficient Balance! / በቂ ቀሪ ሂሳብ የሎትም!");
            return false;
        }
        return true;
    }

    /**
     * DEPOSIT SYSTEM
     */
    function submitDepositRequest() {
        const method = document.getElementById('method').value;
        const sName = document.getElementById('senderName').value.trim();
        const amt = document.getElementById('amount').value;
        const user = JSON.parse(localStorage.getItem('simba_active_user'));

        if (!user || !sName || !amt) return alert("እባክዎን ሁሉንም መረጃ ይሙሉ");
        if (parseFloat(amt) < 100) return alert("Min 100 ETB");

        const details = `DEP: ${method} FROM ${sName}`;
        const finalURL = `${scriptURL}?action=deposit&phone=${user.phone}&name=${encodeURIComponent(user.name)}&amount=${amt}&details=${encodeURIComponent(details)}`;
        
        fetch(finalURL, { method: 'GET', mode: 'no-cors' });
        alert("ጥያቄዎ ተልኳል! Balance updates after Admin approval.");
        window.location.href = 'index.html';
    }

    /**
     * WITHDRAWAL SYSTEM (Immediate Local Deduction)
     */
    function processWithdraw() {
        const method = document.getElementById('wdMethod').value;
        const recPhone = document.getElementById('wdPhone').value.trim();
        const amtInput = document.getElementById('wdAmount').value;
        const amt = parseFloat(amtInput);
        const user = JSON.parse(localStorage.getItem('simba_active_user'));

        if (!user || !recPhone || isNaN(amt)) return alert("እባክዎን ሁሉንም መረጃ ይሙሉ");
        if (amt > parseFloat(user.balance)) return alert("Insufficient Balance");

        // Immediate Visual Update
        user.balance = parseFloat(user.balance) - amt;
        localStorage.setItem('simba_active_user', JSON.stringify(user));
        if(document.getElementById('headerBalance')) document.getElementById('headerBalance').innerText = user.balance.toFixed(2);

        const details = `WITHDRAW: ${method} TO ${recPhone}`;
        const finalURL = `${scriptURL}?action=withdraw&phone=${user.phone}&amount=-${amt}&details=${encodeURIComponent(details)}`;
        
        fetch(finalURL, { method: 'GET', mode: 'no-cors' });
        alert("የመውጣት ጥያቄ ተልኳል!");
        window.location.href = 'index.html';
    }

    /**
     * UI & NAVIGATION
     */
    function toggleMenu() {
        const menu = document.getElementById('sideMenu');
        if (menu) menu.style.left = (menu.style.left === '0px') ? '-260px' : '0px';
    }

    function logout() {
        if(confirm("Logout?")) {
            localStorage.clear();
            window.location.href = 'login.html';
        }
    }

    // Auto-refresh every 15 seconds
    setInterval(updateDisplay, 15000);
    window.onload = updateDisplay;
</script>
