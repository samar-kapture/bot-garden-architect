// Modal Management and Configuration Dialog Functions

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

// Make functions globally available
window.openModal = openModal;
window.closeModal = closeModal;
window.openPromptDialog = openPromptDialog;
window.savePrompt = savePrompt;
window.openMessageDialog = openMessageDialog;
window.saveMessageConfig = saveMessageConfig;
window.addReengageMessage = addReengageMessage;
window.removeReengageMessage = removeReengageMessage;
window.updateReengageMessage = updateReengageMessage;