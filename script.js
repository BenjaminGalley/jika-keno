const fruitAssets = [
    'assets/gold_7.jpg', 'assets/cherry.jpg', 'assets/diamond.jpg',
    'assets/grapes.jpg', 'assets/lemon.jpg', 'assets/melon.jpg', 'assets/orange.jpg'
];

let balance = 10049;

document.getElementById('spin-button').addEventListener('click', () => {
    if (balance < 200) return alert("Not enough Birr!");
    
    balance -= 200;
    document.getElementById('balance').innerText = balance;
    
    startSpin();
});

function startSpin() {
    // 1. Spin Multiplier
    const multiReel = document.getElementById('multiplier-reel');
    const randomStop = Math.floor(Math.random() * 5); // 0 to 4
    multiReel.style.top = `-${randomStop * 150}px`;

    // 2. Spin Fruit Reels
    for (let i = 1; i <= 3; i++) {
        const reel = document.getElementById(`reel${i}`);
        reel.innerHTML = ''; 
        for (let j = 0; j < 3; j++) {
            const img = document.createElement('img');
            img.src = fruitAssets[Math.floor(Math.random() * fruitAssets.length)];
            img.className = 'symbol';
            reel.appendChild(img);
        }
    }

    // 3. Fake a Win for testing
    setTimeout(() => {
        showBigWin(8000);
    }, 2000);
}

function showBigWin(amount) {
    const overlay = document.getElementById('win-overlay');
    overlay.innerHTML = `<div class="big-win"><h1>BIG WIN</h1><h2>${amount} ETB</h2></div>`;
    overlay.classList.remove('hidden');
    
    balance += amount;
    document.getElementById('balance').innerText = balance;

    setTimeout(() => overlay.classList.add('hidden'), 4000);
}
