// Bot Management Functions

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

// Make functions globally available
window.editBot = editBot;
window.saveBot = saveBot;
window.testBot = testBot;
window.cloneBot = cloneBot;
window.deleteBot = deleteBot;
window.resetBotForm = resetBotForm;