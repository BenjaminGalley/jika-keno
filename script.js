const fruitValues = {
    'assets/gold_7.jpg': 100,
    'assets/diamond.jpg': 50,
    'assets/melon.jpg': 30,
    'assets/grapes.jpg': 20,
    'assets/cherry.jpg': 10,
    'assets/orange.jpg': 5,
    'assets/lemon.jpg': 5
};

const paylines = [
    [0, 0, 0], // Top row
    [1, 1, 1], // Middle row
    [2, 2, 2], // Bottom row
    [0, 1, 2], // Diagonal down
    [2, 1, 0]  // Diagonal up
];

function checkWins() {
    let totalWin = 0;
    let currentGrid = [
        getReelSymbols(1),
        getReelSymbols(2),
        getReelSymbols(3)
    ];

    paylines.forEach((line, index) => {
        const s1 = currentGrid[0][line[0]];
        const s2 = currentGrid[1][line[1]];
        const s3 = currentGrid[2][line[2]];

        if (s1 === s2 && s2 === s3) {
            const val = fruitValues[s1] || 0;
            totalWin += val;
            highlightLine(index);
        }
    });

    if (totalWin > 0) {
        // Multiply by the random multiplier (1-5)
        const activeMultiplier = Math.floor(Math.random() * 5) + 1;
        const finalAmount = totalWin * activeMultiplier;
        showPopup(finalAmount);
    }
}

function showPopup(amount) {
    const popup = document.createElement('div');
    popup.className = 'win-popup ' + (amount >= 100 ? 'big-win' : 'small-win');
    popup.innerHTML = amount >= 100 ? `BIG WIN!<br>${amount} ETB` : `WIN<br>${amount} ETB`;
    
    document.body.appendChild(popup);
    setTimeout(() => popup.classList.add('show-win'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        popup.classList.remove('show-win');
        setTimeout(() => popup.remove(), 500);
    }, 3000);
}

// Helper to get image paths from the reels
function getReelSymbols(id) {
    const reel = document.getElementById(`reel${id}`);
    return Array.from(reel.querySelectorAll('img')).map(img => img.getAttribute('src'));
}
