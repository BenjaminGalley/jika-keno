// Side Menu Toggle (if you add one later)
function toggleMenu() {
    console.log("Menu Toggled");
}

// Ensure the page loads at the top
window.onload = function() {
    window.scrollTo(0, 0);
};

// Handle Join/Deposit Button clicks
document.querySelectorAll('.auth-btns button').forEach(btn => {
    btn.addEventListener('click', () => {
        alert(btn.innerText + " feature coming soon!");
    });
});

// Logic to navigate to games
function openGame(gameName) {
    window.location.href = gameName + ".html";
}
