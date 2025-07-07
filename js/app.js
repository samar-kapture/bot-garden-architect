// Main Application Logic
class BotBuilderApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.init();
    }

    init() {
        // Initialize storage with sample data
        storage.initializeSampleData();
        
        // Bind navigation events
        this.bindNavigation();
        
        // Initialize current page
        this.showPage('dashboard');
        
        // Update stats
        StatsUpdater.updateDashboardStats();
        
        // Render initial content
        this.renderCurrentPage();
        
        console.log('Bot Builder App initialized');
    }

    bindNavigation() {
        // Sidebar navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.navigateTo(page);
            });
        });
    }

    navigateTo(page) {
        // Update active navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Show page
        this.showPage(page);
        this.currentPage = page;
        
        // Render page content
        this.renderCurrentPage();
    }

    showPage(page) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });
        
        // Show target page
        document.getElementById(`${page}-page`).classList.add('active');
    }

    renderCurrentPage() {
        switch(this.currentPage) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'create':
                this.renderCreatePage();
                break;
            case 'library':
                this.renderLibraryPage();
                break;
            case 'flow':
                this.renderFlowPage();
                break;
            case 'tools':
                this.renderToolsPage();
                break;
        }
    }

    renderDashboard() {
        StatsUpdater.updateDashboardStats();
        ComponentRenderer.renderRecentBots();
    }

    renderCreatePage() {
        ComponentRenderer.renderSelectedTools();
        this.updatePromptPreview();
    }

    renderLibraryPage() {
        ComponentRenderer.renderBotLibrary();
    }

    renderFlowPage() {
        if (!window.flowBuilder) {
            initializeFlowBuilder();
        }
        ComponentRenderer.renderFlowBuilderBots();
        StatsUpdater.updateFlowStats();
    }

    renderToolsPage() {
        ComponentRenderer.renderToolsLibrary();
    }

    updatePromptPreview() {
        const preview = document.getElementById('prompt-preview');
        const text = document.getElementById('prompt-text');
        
        if (currentBotPrompt) {
            preview.style.display = 'block';
            text.textContent = StringUtils.truncate(currentBotPrompt, 100);
        } else {
            preview.style.display = 'none';
        }
    }
}

// Global Navigation Function
function navigateTo(page) {
    app.navigateTo(page);
}

// Global variables
let app;
let currentEditingTool = null;
let currentEditingBot = null;
let selectedBotTools = [];
let currentBotPrompt = '';
let currentMessageConfig = null;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    app = new BotBuilderApp();
    window.app = app;
    
    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            const modalId = e.target.id;
            closeModal(modalId);
        }
    });
    
    console.log('Bot Builder Application Ready');
});