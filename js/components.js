// Component management and rendering functions

// Global state for the current editing bot
let currentEditingBot = null;
let selectedBotTools = [];
let currentBotPrompt = '';
let currentMessageConfig = null;

// Render functions for different components
const ComponentRenderer = {
    // Render recent bots on dashboard
    renderRecentBots() {
        const container = document.getElementById('recent-bots');
        const bots = storage.getBots().slice(-6); // Show last 6 bots
        
        if (bots.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-robot"></i>
                    <p>No bots created yet</p>
                    <small>Create your first bot to get started</small>
                </div>
            `;
            return;
        }

        container.innerHTML = bots.map(bot => `
            <div class="bot-card">
                <h3>${bot.name}</h3>
                <p>${StringUtils.truncate(bot.description, 100)}</p>
                <div class="bot-tools">
                    <h4>Tools (${bot.functions.length})</h4>
                    <div class="tools-badges">
                        ${bot.functions.slice(0, 3).map(toolId => {
                            const tool = storage.getToolById(toolId);
                            return tool ? `<span class="badge">${tool.name}</span>` : '';
                        }).join('')}
                        ${bot.functions.length > 3 ? `<span class="badge">+${bot.functions.length - 3} more</span>` : ''}
                    </div>
                </div>
                <div class="bot-meta">
                    <p>Created: ${DateUtils.formatDate(bot.createdAt)}</p>
                    <p>Modified: ${DateUtils.formatDate(bot.updatedAt)}</p>
                </div>
                <div class="bot-actions">
                    <button class="btn btn-outline btn-sm" onclick="editBot('${bot.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="testBot('${bot.id}')">
                        <i class="fas fa-play"></i> Test
                    </button>
                </div>
            </div>
        `).join('');
    },

    // Render all bots in library
    renderBotLibrary(searchQuery = '') {
        const container = document.getElementById('bots-container');
        let bots = storage.getBots();
        
        if (searchQuery) {
            bots = bots.filter(bot => 
                bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                bot.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (bots.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-robot"></i>
                    <p>${searchQuery ? 'No bots found' : 'No bots created yet'}</p>
                    <small>${searchQuery ? 'Try adjusting your search terms' : 'Create your first bot to get started'}</small>
                    ${!searchQuery ? '<button class="btn btn-primary" onclick="navigateTo(\'create\')">Create First Bot</button>' : ''}
                </div>
            `;
            return;
        }

        container.innerHTML = bots.map(bot => `
            <div class="bot-card">
                <h3>${bot.name}</h3>
                <p>${StringUtils.truncate(bot.description, 100)}</p>
                <div class="bot-tools">
                    <h4>Tools (${bot.functions.length})</h4>
                    <div class="tools-badges">
                        ${bot.functions.slice(0, 3).map(toolId => {
                            const tool = storage.getToolById(toolId);
                            return tool ? `<span class="badge">${tool.name}</span>` : '';
                        }).join('')}
                        ${bot.functions.length > 3 ? `<span class="badge">+${bot.functions.length - 3} more</span>` : ''}
                    </div>
                </div>
                <div class="bot-meta">
                    <p>Created: ${DateUtils.formatDate(bot.createdAt)}</p>
                    <p>Modified: ${DateUtils.formatDate(bot.updatedAt)}</p>
                </div>
                <div class="bot-actions">
                    <button class="btn btn-outline btn-sm" onclick="testBot('${bot.id}')">
                        <i class="fas fa-play"></i> Test
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="editBot('${bot.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="cloneBot('${bot.id}')">
                        <i class="fas fa-copy"></i> Clone
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="deleteBot('${bot.id}')" style="color: var(--error);">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    },

    // Render tools library
    renderToolsLibrary() {
        const container = document.getElementById('tools-container');
        const tools = storage.getTools();
        
        if (tools.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-tools"></i>
                    <p>No tools created yet</p>
                    <small>Create your first tool to get started</small>
                    <button class="btn btn-primary" onclick="openCreateTool()">Create First Tool</button>
                </div>
            `;
            return;
        }

        container.innerHTML = tools.map(tool => `
            <div class="tool-item">
                <div class="tool-info">
                    <h4>${tool.name}</h4>
                    <p>${StringUtils.truncate(tool.description, 150)}</p>
                    <small>Created: ${DateUtils.formatDate(tool.createdAt)} | Modified: ${DateUtils.formatDate(tool.updatedAt)}</small>
                </div>
                <div class="tool-actions">
                    <button class="btn btn-outline btn-sm" onclick="editTool('${tool.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="deleteTool('${tool.id}')" style="color: var(--error);">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    },

    // Render selected tools in bot creator
    renderSelectedTools() {
        const container = document.getElementById('selected-tools');
        const tools = storage.getTools().filter(tool => selectedBotTools.includes(tool.id));
        
        if (tools.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-tools"></i>
                    <p>No Tools Selected</p>
                    <small>Select tools from the library or create a new one</small>
                </div>
            `;
            return;
        }

        container.innerHTML = tools.map(tool => `
            <div class="tool-item">
                <div class="tool-info">
                    <h4>${tool.name}</h4>
                    <p>${StringUtils.truncate(tool.description, 100)}</p>
                    <small>Created: ${DateUtils.formatDate(tool.createdAt)}</small>
                </div>
                <button class="btn btn-outline btn-sm" onclick="removeToolFromBot('${tool.id}')" style="color: var(--error);">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    },

    // Render tool library modal
    renderToolLibraryModal() {
        const container = document.getElementById('tool-library-content');
        const tools = storage.getTools();
        
        if (tools.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-tools"></i>
                    <p>No tools available</p>
                    <small>Create a tool first</small>
                </div>
            `;
            return;
        }

        container.innerHTML = tools.map(tool => `
            <div class="tool-item ${selectedBotTools.includes(tool.id) ? 'selected' : ''}" onclick="toggleToolSelection('${tool.id}')">
                <div class="tool-info">
                    <h4>${tool.name}</h4>
                    <p>${StringUtils.truncate(tool.description, 100)}</p>
                    <small>Created: ${DateUtils.formatDate(tool.createdAt)}</small>
                </div>
                <div class="tool-checkbox">
                    <i class="fas fa-${selectedBotTools.includes(tool.id) ? 'check-circle' : 'circle'}"></i>
                </div>
            </div>
        `).join('');
    },

    // Render available bots for flow builder
    renderFlowBuilderBots() {
        const container = document.getElementById('flow-bots-list');
        const bots = storage.getBots();
        
        if (bots.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-robot"></i>
                    <p>No bots available</p>
                    <small>Create a bot first to add it to your flow</small>
                </div>
            `;
            return;
        }

        container.innerHTML = bots.map((bot, index) => `
            <div class="bot-list-item" onclick="addBotToFlow('${bot.id}')">
                <div class="bot-color" style="background-color: ${ColorUtils.getColorByIndex(index)};"></div>
                <div class="bot-list-info">
                    <h4>${bot.name}</h4>
                    <p>${StringUtils.truncate(bot.description, 50)}</p>
                </div>
                <i class="fas fa-plus"></i>
            </div>
        `).join('');
    },

    // Render re-engage messages in message config
    renderReengageMessages() {
        const container = document.getElementById('reengage-messages');
        const messages = currentMessageConfig?.reEngageMessages || [
            { time: 30, message: "Are you still there?" },
            { time: 30, message: "" }
        ];

        container.innerHTML = messages.map((msg, index) => `
            <div class="reengage-item">
                <span class="reengage-number">${index + 1}.</span>
                <div class="reengage-time">
                    <label>Time</label>
                    <div class="time-input">
                        <input type="number" value="${msg.time}" onchange="updateReengageMessage(${index}, 'time', this.value)" min="1">
                        <span>Sec</span>
                    </div>
                </div>
                <div class="reengage-message">
                    <label>Message</label>
                    <input type="text" value="${msg.message}" placeholder="Enter message" onchange="updateReengageMessage(${index}, 'message', this.value)">
                </div>
                <button type="button" class="btn btn-outline btn-sm" onclick="removeReengageMessage(${index})" style="color: var(--error);">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
};

// Stats updating functions
const StatsUpdater = {
    updateDashboardStats() {
        const bots = storage.getBots();
        const tools = storage.getTools();
        const flows = storage.getFlows();

        document.getElementById('total-bots').textContent = bots.length;
        document.getElementById('total-tools').textContent = tools.length;
        document.getElementById('total-flows').textContent = flows.length;
    },

    updateFlowStats() {
        const nodes = window.flowBuilder ? window.flowBuilder.nodes.length : 0;
        const connections = window.flowBuilder ? window.flowBuilder.connections.length : 0;
        
        document.getElementById('nodes-count').textContent = nodes;
        document.getElementById('connections-count').textContent = connections;
    }
};

// Make components globally available
window.ComponentRenderer = ComponentRenderer;
window.StatsUpdater = StatsUpdater;