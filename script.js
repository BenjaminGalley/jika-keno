<script>
    // UPDATED WITH YOUR NEW DEPLOYMENT URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzI2sCF2oVeQOSwND3nrF_c9I6wHUVKfb2CpQD6g_F__tZuBWc6NkpecpFwTtEd8bW5/exec'; 

    async function updateDisplay() {
        const user = JSON.parse(localStorage.getItem('simba_active_user'));
        if (!user) {
            if(document.getElementById('auth-section')) document.getElementById('auth-section').style.display = 'flex';
            if(document.getElementById('topBalanceArea')) document.getElementById('topBalanceArea').style.display = 'none';
            return;
        }

        try {
            // Using action=getBalance to match the new Google Script
            const response = await fetch(`${scriptURL}?action=getBalance&phone=${user.phone}`, {
                method: 'GET',
                redirect: 'follow'
            });
            const data = await response.json();
            
            if (data && data.balance !== undefined) {
                user.balance = data.balance;
                localStorage.setItem('simba_active_user', JSON.stringify(user));
                
                const balHeader = document.getElementById('headerBalance');
                if(balHeader) balHeader.innerText = parseFloat(data.balance).toFixed(2);
                
                if(document.getElementById('auth-section')) document.getElementById('auth-section').style.display = 'none';
                if(document.getElementById('topBalanceArea')) document.getElementById('topBalanceArea').style.display = 'flex';
                if(document.getElementById('menuToggleBtn')) document.getElementById('menuToggleBtn').style.display = 'block';
                
                // Update the display ID based on the phone
                if(document.getElementById('displayID')) {
                    document.getElementById('displayID').innerText = "SB-" + user.phone.toString().slice(-4);
                }
            }
        } catch (e) { 
            console.log("Syncing balance..."); 
        }
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

        if (!user || !recPhone || isNaN(amt)) return alert("Please fill all information!");
        if (amt > parseFloat(user.balance)) return alert("Insufficient Balance!");

        // Update UI locally immediately to prevent double-spending
        const newLocalBal = parseFloat(user.balance) - amt;
        user.balance = newLocalBal;
        localStorage.setItem('simba_active_user', JSON.stringify(user));
        
        if(document.getElementById('headerBalance')) {
            document.getElementById('headerBalance').innerText = newLocalBal.toFixed(2);
        }

        // Send to sheet - For your current Script, we send it as a 'deposit' action 
        // with a negative number so it subtracts from the balance.
        const withdrawAmt = -Math.abs(amt);
        const details = encodeURIComponent(`WITHDRAW TO ${recPhone}`);
        
        fetch(`${scriptURL}?action=deposit&phone=${user.phone}&amount=${withdrawAmt}&details=${details}`, { 
            method: 'GET', 
            mode: 'no-cors' 
        });

        alert("Withdrawal request sent! Admin will process it shortly.");
        window.location.href = 'index.html';
    }

    function toggleMenu() {
        const menu = document.getElementById('sideMenu');
        const overlay = document.getElementById('menuOverlay');
        if (menu) {
            const isOpen = menu.style.left === '0px';
            menu.style.left = isOpen ? '-260px' : '0px';
            if (overlay) overlay.style.display = isOpen ? 'none' : 'block';
        }
    }

    function logout() { 
        localStorage.removeItem('simba_active_user'); 
        window.location.href = 'login.html'; 
    }

    // Auto-sync balance every 15 seconds
    setInterval(updateDisplay, 15000);
    window.onload = updateDisplay;
</script>
