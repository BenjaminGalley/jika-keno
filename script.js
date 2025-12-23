const fruits = [
    'assets/cherry.jpg', 'assets/diamond.jpg', 'assets/gold_7.jpg', 
    'assets/grapes.jpg', 'assets/lemon.jpg', 'assets/melon.jpg', 'assets/orange.jpg'
];

document.getElementById('spin-button').addEventListener('click', () => {
    spinReels();
    spinMultiplier();
});

function spinReels() {
    for (let i = 1; i <= 3; i++) {
        const reel = document.getElementById(`reel${i}`);
        reel.innerHTML = ''; // Clear old fruits
        
        // Add 3 random fruits to each reel
        for (let j = 0; j < 3; j++) {
            const randomFruit = fruits[Math.floor(Math.random() * fruits.length)];
            const img = document.createElement('img');
            img.src = randomFruit;
            img.className = 'symbol';
            reel.appendChild(img);
        }
    }
}

function spinMultiplier() {
    const strip = document.getElementById('multiplier-reel');
    // Random position to simulate landing on 1x, 2x, 3x, 4x, or 5x
    const randomStop = Math.floor(Math.random() * 5) * 100; 
    strip.style.transition = 'top 2s ease-out';
    strip.style.top = `-${randomStop}px`;
}
