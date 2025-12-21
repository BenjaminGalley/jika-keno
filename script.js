// JIKA KENO HD - Engine
const grid = document.getElementById('grid');
const timerDisplay = document.getElementById('timer');
let timeLeft = 120; // 2 minutes

// 1. Create the 80 Keno Numbers
for (let i = 1; i <= 80; i++) {
    const btn = document.createElement('div');
    btn.innerText = i;
    btn.classList.add('number-btn');
    
    // Make numbers clickable
    btn.onclick = () => {
        btn.classList.toggle('selected');
    };
    
    grid.appendChild(btn);
}

// 2. The Countdown Timer
function startTimer() {
    const countdown = setInterval(() => {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        
        // Format as 00:00
        seconds = seconds < 10 ? '0' + seconds : seconds;
        timerDisplay.innerText = `0${minutes}:${seconds}`;

        if (timeLeft <= 0) {
            timeLeft = 120; // Reset timer for next round
        } else {
            timeLeft--;
        }
    }, 1000);
}

// Start the game logic
startTimer();
