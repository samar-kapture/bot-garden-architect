// Search Functions

function filterBots() {
    const searchQuery = document.getElementById('bot-search').value;
    ComponentRenderer.renderBotLibrary(searchQuery);
}

// Make functions globally available
window.filterBots = filterBots;