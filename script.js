<script>
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyr8EHHAKYy7q1QyCHVnsFZgPrX2FkAyKa_mSwh4yDz3IFHaO9dBCvN-kaNuG5hZz2P/exec'; 

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
        } catch (e) { console.log("Sync..."); }
    }

    function checkGameBalance(cost) {
        const user = JSON.parse(localStorage.getItem('simba_active_user'));
        if (!user || parseFloat(user.balance) < cost) {
            alert("Insufficient Balance! / በቂ ቀሪ ሂሳብ የሎትም!");
            return false;
        }
        return true;
    }

    function processWithdraw() {
        const recPhone = document.getElementById('wdPhone').value.trim();
        const amt = parseFloat(document.getElementById('wdAmount').value);
        const user = JSON.parse(localStorage.getItem('simba_active_user'));

        if (!user || !recPhone || isNaN(amt)) return alert("Fill all info");
        if (amt > parseFloat(user.balance)) return alert("Low Balance");

        user.balance = parseFloat(user.balance) - amt;
        localStorage.setItem('simba_active_user', JSON.stringify(user));
        if(document.getElementById('headerBalance')) document.getElementById('headerBalance').innerText = user.balance.toFixed(2);

        fetch(`${scriptURL}?action=withdraw&phone=${user.phone}&amount=-${amt}&details=WITHDRAW TO ${recPhone}`, { method: 'GET', mode: 'no-cors' });
        alert("Sent!");
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
