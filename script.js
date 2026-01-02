<script>
    /**
     * SIMBA BET CORE SYSTEM ENGINE - v2.0.0
     * Optimized for Split-Screen Stable Assets & Google Sheets Sync
     */
    
    // 1. CONFIGURATION & ENDPOINTS
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzI2sCF2oVeQOSwND3nrF_c9I6wHUVKfb2CpQD6g_F__tZuBWc6NkpecpFwTtEd8bW5/exec'; 
    const REFRESH_RATE = 10000; // 10 seconds for faster balance updates
    
    /**
     * MAIN SYNC ENGINE: Updates balances, IDs, and UI visibility
     * Compatible with: headerLiveBalance, footerAccountID, displayID
     */
    async function updateDisplay() {
        const storedUser = localStorage.getItem('simba_active_user');
        
        // Safety Check: If no user, redirect or hide secure areas
        if (!storedUser) {
            console.warn("No active session found. Redirecting...");
            if(window.location.pathname.includes('index.html')) {
                window.location.href = 'login.html';
            }
            return;
        }

        const user = JSON.parse(storedUser);

        try {
            // Fetch live data from Google Sheet
            const response = await fetch(`${scriptURL}?action=getBalance&phone=${user.phone}`, {
                method: 'GET',
                redirect: 'follow'
            });
            
            if (!response.ok) throw new Error("Network response was not ok");
            
            const data = await response.json();
            
            if (data && (data.balance !== undefined || data.approvedAmount !== undefined)) {
                // Determine balance from either 'balance' or 'approvedAmount' columns
                const liveBalance = data.balance || data.approvedAmount || 0;
                
                // Update Local Storage for Game Persistence
                user.balance = liveBalance;
                localStorage.setItem('simba_active_user', JSON.stringify(user));
                
                // --- UI MAPPING ENGINE ---
                // Updates the Header Balance (Lobby + Games)
                const headerBal = document.getElementById('headerLiveBalance') || document.getElementById('headerBalance');
                if(headerBal) {
                    headerBal.innerText = parseFloat(liveBalance).toFixed(2);
                }
                
                // Updates User IDs in multiple formats
                const shortID = "SB-" + user.phone.toString().slice(-4);
                const idElements = ['footerAccountID', 'displayID', 'footID', 'footUID'];
                idElements.forEach(id => {
                    const el = document.getElementById(id);
                    if(el) el.innerText = shortID;
                });

                // Control Component Visibility
                const authSect = document.getElementById('auth-section');
                const balArea = document.getElementById('topBalanceArea');
                const menuBtn = document.getElementById('menuToggleBtn');

                if(authSect) authSect.style.display = 'none';
                if(balArea) balArea.style.display = 'flex';
                if(menuBtn) menuBtn.style.display = 'block';
                
                console.log(`System Sync Successful: ${shortID} | ${liveBalance} ETB`);
            }
        } catch (error) { 
            console.error("Syncing Balance... (Connection is active but waiting for Google Script)"); 
        }
    }

    /**
     * GAME GATEKEEPER: Prevents play if balance is too low
     * @param {number} cost - The entry fee or bet amount
     */
    function checkGameBalance(cost) {
        const stored = localStorage.getItem('simba_active_user');
        if (!stored) return false;
        
        const user = JSON.parse(stored);
        const currentBal = parseFloat(user.balance);

        if (currentBal < cost) {
            alert("⚠️ Insufficient Balance!\n\nሂሳብዎ በቂ አይደለም! እባክዎ ቀሪ ሂሳብዎን ይሙሉ::");
            return false;
        }
        return true;
    }

    /**
     * WITHDRAWAL ENGINE: Handles local deduction and Sheet logging
     */
    function processWithdraw() {
        const wdPhoneInput = document.getElementById('wdPhone');
        const wdAmountInput = document.getElementById('wdAmount');
        
        if (!wdPhoneInput || !wdAmountInput) return;

        const recPhone = wdPhoneInput.value.trim();
        const amt = parseFloat(wdAmountInput.value);
        const user = JSON.parse(localStorage.getItem('simba_active_user'));

        if (!user || !recPhone || isNaN(amt) || amt <= 0) {
            alert("Please provide a valid phone and amount!");
            return;
        }

        if (amt > parseFloat(user.balance)) {
            alert("Insufficient Balance for this withdrawal!");
            return;
        }

        // PRE-EMPTIVE DEDUCTION: Update UI locally to prevent double-click abuse
        const updatedLocalBal = parseFloat(user.balance) - amt;
        const oldUser = {...user}; // Backup
        user.balance = updatedLocalBal;
        localStorage.setItem('simba_active_user', JSON.stringify(user));
        
        // Visual Feedback
        const hb = document.getElementById('headerLiveBalance') || document.getElementById('headerBalance');
        if(hb) hb.innerText = updatedLocalBal.toFixed(2);

        // API INTEGRATION: Send negative amount to Sheet to represent deduction
        const negativeAmt = -Math.abs(amt);
        const details = encodeURIComponent(`WITHDRAW_REQ_TO_${recPhone}`);
        
        fetch(`${scriptURL}?action=deposit&phone=${user.phone}&amount=${negativeAmt}&details=${details}`, { 
            method: 'GET', 
            mode: 'no-cors' 
        }).then(() => {
            alert("✅ Withdrawal Request Sent!\nYour request is being processed by Simba Admin.");
            window.location.href = 'index.html';
        }).catch(err => {
            console.error("Withdrawal error:", err);
            // Revert on hard failure
            localStorage.setItem('simba_active_user', JSON.stringify(oldUser));
            alert("Network error. Please try again.");
        });
    }

    /**
     * SIDEBAR CONTROL: Robust toggle for the stable lobby
     */
    function toggleSidebarMenu() {
        const menu = document.getElementById('mainSidebar') || document.getElementById('sideMenu');
        const overlay = document.getElementById('menuOverlay');
        
        if (menu) {
            // Check if using the 'active/is-visible' class system or inline style
            if(menu.classList.contains('is-active') || menu.classList.contains('active') || menu.classList.contains('is-visible')) {
                menu.classList.remove('is-active', 'active', 'is-visible');
                if(overlay) overlay.style.display = 'none';
            } else {
                menu.classList.add('is-active'); // Matches our new lobby style
                if(overlay) overlay.style.display = 'block';
            }
        }
    }

    /**
     * LOGOUT: Clears session and returns to login
     */
    function logoutUser() { 
        if(confirm("Are you sure you want to logout?")) {
            localStorage.removeItem('simba_active_user'); 
            window.location.href = 'login.html'; 
        }
    }

    // --- INITIALIZATION ---
    // Start syncing immediately and set the interval
    window.addEventListener('DOMContentLoaded', () => {
        updateDisplay();
        setInterval(updateDisplay, REFRESH_RATE);
    });
</script>
