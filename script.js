const grid = document.getElementById('grid');
const timerDisplay = document.getElementById('timer');

// Create 80 buttons
for (let i = 1; i <= 80; i++) {
    const btn = document.createElement('div');
    btn.innerText = i.toString().padStart(2, '0');
    btn.style.padding = "10px";
    btn.style.background = "#2a2a2a";
    btn.style.borderRadius = "5px";
    btn.style.cursor = "pointer";
    grid.appendChild(btn);
}

// Simple 2-minute countdown
let time = 120;
setInterval(() => {
    let mins = Math.floor(time / 60);
    let secs = time % 60;
    timerDisplay.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    if (time > 0) time--;
}, 1000);
