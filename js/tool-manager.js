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

// Make functions globally available
window.openCreateTool = openCreateTool;
window.editTool = editTool;
window.saveTool = saveTool;
window.deleteTool = deleteTool;
window.openToolLibrary = openToolLibrary;
window.toggleToolSelection = toggleToolSelection;
window.removeToolFromBot = removeToolFromBot;