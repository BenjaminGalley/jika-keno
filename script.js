const fruits = [
    'assets/gold_7.jpg', 'assets/cherry.jpg', 'assets/diamond.jpg',
    'assets/grapes.jpg', 'assets/lemon.jpg', 'assets/melon.jpg', 'assets/orange.jpg'
];

// Prices for 3-of-a-kind (Multiplied by 200 ETB bet)
const values = {
    'assets/gold_7.jpg': 50,    // 50x bet
    'assets/diamond.jpg': 20,   // 20x bet
    'assets/melon.jpg': 10,     // 10x bet
    'assets/grapes.jpg': 5,      // 5x bet
    'assets/cherry.jpg': 2,      // 2x bet
    'assets/orange.jpg': 1,      // 1x bet
    'assets/lemon.jpg': 1        // 1x bet
};

let balance = 10049.01;

document.getElementById('spin-button').addEventListener('click', () => {
    if (balance < 200) return alert("Insufficient Balance!");

    balance -= 200;
    document.getElementById('balance').innerText = balance.toFixed(2);
    
    const multiReel = document.getElementById('multiplier-reel');
    const multiplierIndex = Math.floor(Math.random() * 5); // 0=1x, 1=2x, etc.
    const multiplierValue = multiplierIndex + 1;
    
    // Spin Multiplier
    multiReel.style.top = `-${multiplierIndex * 160}px`;

    // Spin Fruits and store results
    let results = [[], [], []];
    for (let i = 1; i <= 3; i++) {
        const r = document.getElementById(`reel${i}`);
        r.innerHTML = '';
        for (let j = 0; j < 3; j++) {
            const fruit = fruits[Math.floor(Math.random() * fruits.length)];
            results[i-1].push(fruit);
            const img = document.createElement('img');
            img.src = fruit;
            img.className = 'symbol';
            r.appendChild(img);
        }
    }

    // Check for wins after animation (2.1 seconds)
    setTimeout(() => {
        let totalWin = 0;
        
        // Payline 1: Horizontal Top
        if(results[0][0] == results[1][0] && results[1][0] == results[2][0]) totalWin += values[results[0][0]] * 200;
        // Payline 2: Horizontal Middle
        if(results[0][1] == results[1][1] && results[1][1] == results[2][1]) totalWin += values[results[0][1]] * 200;
        // Payline 3: Horizontal Bottom
        if(results[0][2] == results[1][2] && results[1][2] == results[2][2]) totalWin += values[results[0][2]] * 200;
        // Payline 4: Diagonal Down
        if(results[0][0] == results[1][1] && results[1][1] == results[2][2]) totalWin += values[results[0][0]] * 200;
        // Payline 5: Diagonal Up
        if(results[0][2] == results[1][1] && results[1][1] == results[2][0]) totalWin += values[results[0][2]] * 200;

        if (totalWin > 0) {
            const finalWin = totalWin * multiplierValue;
            showWin(finalWin);
        }
    }, 2100);
});

function showWin(amount) {
    const overlay = document.getElementById('win-overlay');
    const isBig = amount >= 2000;
    
    overlay.innerHTML = `
        <h1 style="color:${isBig ? 'gold' : 'white'};">${isBig ? 'BIG WIN' : 'WIN'}</h1>
        <h2 style="font-size:35px;">${amount.toFixed(2)} ETB</h2>
    `;
    
    overlay.style.display = 'block';
    balance += amount;
    document.getElementById('balance').innerText = balance.toFixed(2);

    setTimeout(() => { overlay.style.display = 'none'; }, 3500);
}
