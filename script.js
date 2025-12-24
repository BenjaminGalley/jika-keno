// Function to handle game selection
function startApp() {
    console.log("Simba Bet Loaded");
}

// Redirect logic for placeholders
document.querySelectorAll('.placeholder').forEach(card => {
    card.addEventListener('click', () => {
        alert("This game is coming soon to Simba Bet!");
    });
});

window.onload = startApp;
