const fruits = ['gold_7.jpg', 'cherry.jpg', 'diamond.jpg', 'grapes.jpg', 'lemon.jpg', 'melon.jpg', 'orange.jpg'];
const values = { 'gold_7.jpg': 50, 'diamond.jpg': 20, 'melon.jpg': 10, 'grapes.jpg': 5, 'cherry.jpg': 2, 'orange.jpg': 1, 'lemon.jpg': 1 };

let balance = 10049.01;

// Front Page Handler
document.getElementById('start-button').addEventListener('click', () => {
    document.getElementById('entry-screen').classList.add('hidden');
});

// Spin Button Handler
document.getElementById('spin-button').addEventListener('click', () => {
    if (balance < 200) return;
    balance -= 200;
    document.getElementById('balance').innerText = balance.toFixed(2);

    // 1. Move Multiplier Strip
    const multiIdx = Math.floor(Math.random() * 5);
    document.getElementById('multiplier-reel').style.top = `-${multiIdx * 175}px`;

    // 2. Spin Fruit Reels
    let gridResults = [[], [], []];
    for (let i = 1; i <= 3; i++) {
        const reel = document.getElementById(`reel${i}`);
        reel.innerHTML = '';
        for (let j = 0; j < 3; j++) {
            const fName = fruits[Math.floor(Math.random() * fruits.length)];
            gridResults[i-1].push(fName);
            const img = document.createElement('img');
            img.src = 'assets/' + fName;
            img.className = 'symbol';
            reel.appendChild(img);
        }
    }

    // 3. Win Calculation
    setTimeout(() => {
        let win = 0;
        // Check Middle Row Horizontal Match
        if (gridResults[0][1] === gridResults[1][1] && gridResults[1][1] === gridResults[2][1]) {
            win = values[gridResults[0][1]] * 200 * (multiIdx + 1);
        }

        if (win > 0) {
            balance += win;
            document.getElementById('balance').innerText = balance.toFixed(2);
            showBigWin(win);
        }
    }, 2000);
});

function showBigWin(amt) {
    const over = document.getElementById('win-overlay');
    over.classList.remove('hidden');
    over.innerHTML = `<div style="text-align:center; color:gold;"><h1>BIG WIN</h1><h2 style="font-size:40px;">${amt.toFixed(2)} ETB</h2></div>`;
    setTimeout(() => over.classList.add('hidden'), 3500);
}
