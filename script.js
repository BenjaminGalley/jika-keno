<script>
    // SIMBA BET MASTER - PLAYER SYNC
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyr8EHHAKYy7q1QyCHVnsFZgPrX2FkAyKa_mSwh4yDz3IFHaO9dBCvN-kaNuG5hZz2P/exec'; 

    async function updateDisplay() {
        const user = JSON.parse(localStorage.getItem('simba_active_user'));
        if (!user) {
            if(document.getElementById('auth-section')) document.getElementById('auth-section').style.display = 'flex';
            if(document.getElementById('topBalanceArea')) document.getElementById('topBalanceArea').style.display = 'none';
            return;
        }

        try {
            // FIXED: Using getBalance to count all "Approve" rows in Column G
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
        } catch (e) { console.log("Syncing..."); }
    }

    function checkGameBalance(cost) {
        const user = JSON.parse(localStorage.getItem('simba_active_user'));
        if (!user || parseFloat(user.balance) < cost) {
            alert("Insufficient Balance! / በቂ ቀሪ ሂሳብ የሎትም!");
            return false;
        }
        return true;
    }

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
        alert("ጥያቄዎ ተልኳል! (Request Sent!)");
        window.location.href = 'index.html';
    }

    function processWithdraw() {
        const method = document.getElementById('wdMethod').value;
        const recPhone = document.getElementById('wdPhone').value.trim();
        const amtInput = document.getElementById('wdAmount').value;
        const amt = parseFloat(amtInput);
        const user = JSON.parse(localStorage.getItem('simba_active_user'));

        if (!user || !recPhone || isNaN(amt)) return alert("እባክዎን ሁሉንም መረጃ ይሙሉ");
        if (amt > parseFloat(user.balance)) return alert("Insufficient Balance");

        // Immediate Visual Decrease
        user.balance = parseFloat(user.balance) - amt;
        localStorage.setItem('simba_active_user', JSON.stringify(user));
        if(document.getElementById('headerBalance')) document.getElementById('headerBalance').innerText = user.balance.toFixed(2);

        const details = `WITHDRAW: ${method} TO ${recPhone}`;
        const finalURL = `${scriptURL}?action=withdraw&phone=${user.phone}&amount=-${amt}&details=${encodeURIComponent(details)}`;
        
        fetch(finalURL, { method: 'GET', mode: 'no-cors' });
        alert("የመውጣት ጥያቄ ተልኳል!");
        window.location.href = 'index.html';
    }

    function toggleMenu() {
        const menu = document.getElementById('sideMenu');
        if (menu) menu.style.left = (menu.style.left === '0px') ? '-260px' : '0px';
    }

    function logout() { localStorage.clear(); window.location.href = 'login.html'; }

    setInterval(updateDisplay, 15000);
    window.onload = updateDisplay;
</script>
