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

// Bot Management Functions
function editBot(botId) {
    const bot = storage.getBotById(botId);
    if (!bot) {
        Toast.error('Bot not found');
        return;
    }

    // Set editing mode
    currentEditingBot = bot;
    selectedBotTools = [...bot.functions];
    currentBotPrompt = bot.agentPrompt || '';
    currentMessageConfig = bot.messageConfig;

    // Fill form
    document.getElementById('bot-name').value = bot.name;
    document.getElementById('bot-description').value = bot.description;
    
    // Set model
    const modelRadio = document.querySelector(`input[name="model"][value="${bot.selectedModel}"]`);
    if (modelRadio) modelRadio.checked = true;

    // Update UI
    document.getElementById('create-title').textContent = 'Edit Bot';
    document.getElementById('save-btn-text').textContent = 'Update Bot';

    // Navigate to create page
    app.navigateTo('create');
    
    // Re-render selected tools
    ComponentRenderer.renderSelectedTools();
    app.updatePromptPreview();
}

function saveBot() {
    const name = document.getElementById('bot-name').value.trim();
    const description = document.getElementById('bot-description').value.trim();
    const selectedModel = document.querySelector('input[name="model"]:checked').value;

    if (!name) {
        Toast.error('Bot name is required');
        return;
    }

    const botData = {
        name,
        description,
        functions: [...selectedBotTools],
        selectedModel,
        agentPrompt: currentBotPrompt,
        messageConfig: currentMessageConfig
    };

    try {
        if (currentEditingBot) {
            // Update existing bot
            storage.updateBot(currentEditingBot.id, botData);
            Toast.success(`Bot "${name}" updated successfully`);
        } else {
            // Create new bot
            storage.addBot(botData);
            Toast.success(`Bot "${name}" created successfully`);
        }

        // Reset form and state
        resetBotForm();
        
        // Navigate to library
        app.navigateTo('library');
        
    } catch (error) {
        Toast.error('Failed to save bot');
        console.error('Save bot error:', error);
    }
}

function testBot(botId = null) {
    const targetBot = botId ? storage.getBotById(botId) : currentEditingBot;
    
    if (!targetBot && !document.getElementById('bot-name').value.trim()) {
        Toast.error('No bot to test');
        return;
    }

    // Simulate bot testing
    Toast.success('Bot test started...');
    
    setTimeout(() => {
        Toast.success('Bot test completed successfully');
    }, 1500);
}

function cloneBot(botId) {
    const bot = storage.getBotById(botId);
    if (!bot) {
        Toast.error('Bot not found');
        return;
    }

    const clonedBot = {
        ...bot,
        name: `${bot.name} (Copy)`
    };

    delete clonedBot.id;
    delete clonedBot.createdAt;
    delete clonedBot.updatedAt;

    storage.addBot(clonedBot);
    Toast.success('Bot cloned successfully');
    
    // Re-render library
    if (app.currentPage === 'library') {
        ComponentRenderer.renderBotLibrary();
    }
}

function deleteBot(botId) {
    if (!confirm('Are you sure you want to delete this bot?')) {
        return;
    }

    if (storage.deleteBot(botId)) {
        Toast.success('Bot deleted successfully');
        
        // Re-render current page
        app.renderCurrentPage();
    } else {
        Toast.error('Failed to delete bot');
    }
}

function resetBotForm() {
    document.getElementById('bot-form').reset();
    currentEditingBot = null;
    selectedBotTools = [];
    currentBotPrompt = '';
    currentMessageConfig = null;
    
    document.getElementById('create-title').textContent = 'Create Bot';
    document.getElementById('save-btn-text').textContent = 'Save Bot';
    document.querySelector('input[name="model"][value="Gemini"]').checked = true;
    
    ComponentRenderer.renderSelectedTools();
    app.updatePromptPreview();
}

// Tool Management Functions
function openCreateTool() {
    document.getElementById('tool-modal-title').textContent = 'Create Tool';
    document.getElementById('tool-save-text').textContent = 'Create Tool';
    document.getElementById('tool-form').reset();
    currentEditingTool = null;
    openModal('tool-modal');
}

function editTool(toolId) {
    const tool = storage.getToolById(toolId);
    if (!tool) {
        Toast.error('Tool not found');
        return;
    }

    currentEditingTool = tool;
    document.getElementById('tool-modal-title').textContent = 'Edit Tool';
    document.getElementById('tool-save-text').textContent = 'Update Tool';
    document.getElementById('tool-name').value = tool.name;
    document.getElementById('tool-description').value = tool.description;
    document.getElementById('tool-code').value = tool.code;
    
    openModal('tool-modal');
}

function saveTool() {
    const name = document.getElementById('tool-name').value.trim();
    const description = document.getElementById('tool-description').value.trim();
    const code = document.getElementById('tool-code').value.trim();

    if (!name || !code) {
        Toast.error('Tool name and code are required');
        return;
    }

    const toolData = { name, description, code };

    try {
        if (currentEditingTool) {
            storage.updateTool(currentEditingTool.id, toolData);
            Toast.success(`Tool "${name}" updated successfully`);
        } else {
            const newTool = storage.addTool(toolData);
            Toast.success(`Tool "${name}" created successfully`);
            
            // Auto-select in current bot if in create mode
            if (app.currentPage === 'create') {
                selectedBotTools.push(newTool.id);
                ComponentRenderer.renderSelectedTools();
            }
        }

        closeModal('tool-modal');
        
        // Re-render tools page if active
        if (app.currentPage === 'tools') {
            ComponentRenderer.renderToolsLibrary();
        }
        
    } catch (error) {
        Toast.error('Failed to save tool');
        console.error('Save tool error:', error);
    }
}

function deleteTool(toolId) {
    if (!confirm('Are you sure you want to delete this tool?')) {
        return;
    }

    if (storage.deleteTool(toolId)) {
        Toast.success('Tool deleted successfully');
        
        // Remove from selected tools if present
        selectedBotTools = selectedBotTools.filter(id => id !== toolId);
        
        // Re-render current page
        app.renderCurrentPage();
    } else {
        Toast.error('Failed to delete tool');
    }
}

// Tool Selection Functions
function openToolLibrary() {
    ComponentRenderer.renderToolLibraryModal();
    openModal('tool-library-modal');
}

function toggleToolSelection(toolId) {
    if (selectedBotTools.includes(toolId)) {
        selectedBotTools = selectedBotTools.filter(id => id !== toolId);
    } else {
        selectedBotTools.push(toolId);
    }
    
    ComponentRenderer.renderToolLibraryModal();
    ComponentRenderer.renderSelectedTools();
}

function removeToolFromBot(toolId) {
    selectedBotTools = selectedBotTools.filter(id => id !== toolId);
    ComponentRenderer.renderSelectedTools();
}

// Modal Functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('open');
    document.body.style.overflow = 'auto';
}

// Configuration Dialog Functions
function openPromptDialog() {
    document.getElementById('agent-prompt').value = currentBotPrompt;
    openModal('prompt-modal');
}

function savePrompt() {
    currentBotPrompt = document.getElementById('agent-prompt').value;
    closeModal('prompt-modal');
    app.updatePromptPreview();
    Toast.success('Agent prompt saved');
}

function openMessageDialog() {
    // Initialize default values if not set
    if (!currentMessageConfig) {
        currentMessageConfig = {
            welcomeMessage: "Thank you for calling. This is Luna, your virtual assistant. I'm here to help you.",
            reEngageMessages: [
                { time: 30, message: "Are you still there?" },
                { time: 30, message: "" }
            ],
            closingMessage: "Thank you for your time. Have a great day!"
        };
    }

    // Populate form
    document.getElementById('welcome-message').value = currentMessageConfig.welcomeMessage;
    document.getElementById('closing-message').value = currentMessageConfig.closingMessage;
    
    ComponentRenderer.renderReengageMessages();
    openModal('message-modal');
}

function saveMessageConfig() {
    currentMessageConfig = {
        welcomeMessage: document.getElementById('welcome-message').value,
        reEngageMessages: currentMessageConfig?.reEngageMessages || [],
        closingMessage: document.getElementById('closing-message').value
    };
    
    closeModal('message-modal');
    Toast.success('Message configuration saved');
}

function addReengageMessage() {
    if (!currentMessageConfig) {
        currentMessageConfig = { reEngageMessages: [] };
    }
    
    currentMessageConfig.reEngageMessages.push({ time: 30, message: "" });
    ComponentRenderer.renderReengageMessages();
}

function removeReengageMessage(index) {
    if (currentMessageConfig && currentMessageConfig.reEngageMessages) {
        currentMessageConfig.reEngageMessages.splice(index, 1);
        ComponentRenderer.renderReengageMessages();
    }
}

function updateReengageMessage(index, field, value) {
    if (currentMessageConfig && currentMessageConfig.reEngageMessages[index]) {
        currentMessageConfig.reEngageMessages[index][field] = field === 'time' ? parseInt(value) || 30 : value;
    }
}

// Search Functions
function filterBots() {
    const searchQuery = document.getElementById('bot-search').value;
    ComponentRenderer.renderBotLibrary(searchQuery);
}

// Flow Builder Functions
function saveFlow() {
    const flowName = document.getElementById('flow-name').value.trim();
    if (!flowName) {
        Toast.error('Flow name is required');
        return;
    }
    
    if (window.flowBuilder) {
        const flowData = window.flowBuilder.getFlowData();
        flowData.name = flowName;
        storage.addFlow(flowData);
        Toast.success(`Flow "${flowName}" saved successfully`);
    } else {
        Toast.error('Flow builder not initialized');
    }
}

function runFlow() {
    Toast.success('Flow execution started...');
    setTimeout(() => {
        Toast.success('Flow execution completed');
    }, 2000);
}

function exportFlow() {
    if (window.flowBuilder) {
        const flowData = window.flowBuilder.getFlowData();
        const dataStr = JSON.stringify(flowData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'flow.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        Toast.success('Flow exported successfully');
    } else {
        Toast.error('Flow builder not initialized');
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