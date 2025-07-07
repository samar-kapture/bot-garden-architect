// Local Storage Management
class Storage {
    constructor() {
        this.prefix = 'botbuilder_';
    }

    // Generic storage methods
    set(key, value) {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    get(key) {
        try {
            const item = localStorage.getItem(this.prefix + key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    }

    remove(key) {
        try {
            localStorage.removeItem(this.prefix + key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }

    clear() {
        try {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }

    // Bot-specific methods
    getBots() {
        return this.get('bots') || [];
    }

    saveBots(bots) {
        return this.set('bots', bots);
    }

    addBot(bot) {
        const bots = this.getBots();
        bot.id = this.generateId();
        bot.createdAt = new Date().toISOString();
        bot.updatedAt = new Date().toISOString();
        bots.push(bot);
        this.saveBots(bots);
        return bot;
    }

    updateBot(id, botData) {
        const bots = this.getBots();
        const index = bots.findIndex(bot => bot.id === id);
        if (index !== -1) {
            bots[index] = { ...bots[index], ...botData, updatedAt: new Date().toISOString() };
            this.saveBots(bots);
            return bots[index];
        }
        return null;
    }

    deleteBot(id) {
        const bots = this.getBots();
        const filteredBots = bots.filter(bot => bot.id !== id);
        this.saveBots(filteredBots);
        return filteredBots.length < bots.length;
    }

    getBotById(id) {
        const bots = this.getBots();
        return bots.find(bot => bot.id === id) || null;
    }

    // Tool-specific methods
    getTools() {
        return this.get('tools') || [];
    }

    saveTools(tools) {
        return this.set('tools', tools);
    }

    addTool(tool) {
        const tools = this.getTools();
        tool.id = this.generateId();
        tool.createdAt = new Date().toISOString();
        tool.updatedAt = new Date().toISOString();
        tools.push(tool);
        this.saveTools(tools);
        return tool;
    }

    updateTool(id, toolData) {
        const tools = this.getTools();
        const index = tools.findIndex(tool => tool.id === id);
        if (index !== -1) {
            tools[index] = { ...tools[index], ...toolData, updatedAt: new Date().toISOString() };
            this.saveTools(tools);
            return tools[index];
        }
        return null;
    }

    deleteTool(id) {
        const tools = this.getTools();
        const filteredTools = tools.filter(tool => tool.id !== id);
        this.saveTools(filteredTools);
        return filteredTools.length < tools.length;
    }

    getToolById(id) {
        const tools = this.getTools();
        return tools.find(tool => tool.id === id) || null;
    }

    // Flow-specific methods
    getFlows() {
        return this.get('flows') || [];
    }

    saveFlows(flows) {
        return this.set('flows', flows);
    }

    addFlow(flow) {
        const flows = this.getFlows();
        flow.id = this.generateId();
        flow.createdAt = new Date().toISOString();
        flow.updatedAt = new Date().toISOString();
        flows.push(flow);
        this.saveFlows(flows);
        return flow;
    }

    updateFlow(id, flowData) {
        const flows = this.getFlows();
        const index = flows.findIndex(flow => flow.id === id);
        if (index !== -1) {
            flows[index] = { ...flows[index], ...flowData, updatedAt: new Date().toISOString() };
            this.saveFlows(flows);
            return flows[index];
        }
        return null;
    }

    deleteFlow(id) {
        const flows = this.getFlows();
        const filteredFlows = flows.filter(flow => flow.id !== id);
        this.saveFlows(filteredFlows);
        return filteredFlows.length < flows.length;
    }

    // Utility methods
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Initialize with sample data if empty
    initializeSampleData() {
        if (this.getBots().length === 0) {
            const sampleBots = [
                {
                    name: "Customer Support Bot",
                    description: "Handles customer inquiries and support tickets",
                    functions: [],
                    selectedModel: "OpenAI",
                    agentPrompt: "You are a helpful customer support assistant. Be polite and professional.",
                    messageConfig: null
                },
                {
                    name: "Data Analysis Bot",
                    description: "Analyzes data and generates insights",
                    functions: [],
                    selectedModel: "Gemini",
                    agentPrompt: "You are a data analyst. Provide clear insights and recommendations.",
                    messageConfig: null
                }
            ];

            sampleBots.forEach(bot => this.addBot(bot));
        }

        if (this.getTools().length === 0) {
            const sampleTools = [
                {
                    name: "Email Sender",
                    description: "Sends emails to specified recipients",
                    code: "function sendEmail(to, subject, body) {\n  // Email sending logic\n  console.log('Sending email to:', to);\n  return { success: true, message: 'Email sent successfully' };\n}"
                },
                {
                    name: "Data Validator",
                    description: "Validates input data formats",
                    code: "function validateData(data) {\n  // Data validation logic\n  if (!data || typeof data !== 'object') {\n    return { valid: false, error: 'Invalid data format' };\n  }\n  return { valid: true };\n}"
                },
                {
                    name: "API Caller",
                    description: "Makes HTTP requests to external APIs",
                    code: "async function callAPI(url, method = 'GET', data = null) {\n  // API calling logic\n  try {\n    const response = await fetch(url, {\n      method,\n      headers: { 'Content-Type': 'application/json' },\n      body: data ? JSON.stringify(data) : null\n    });\n    return await response.json();\n  } catch (error) {\n    return { error: error.message };\n  }\n}"
                }
            ];

            sampleTools.forEach(tool => this.addTool(tool));
        }
    }
}

// Create global storage instance
window.storage = new Storage();