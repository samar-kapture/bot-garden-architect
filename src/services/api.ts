// API Service Layer for Agent Builder Platform

export interface Bot {
  id: string;
  name: string;
  description: string;
  agentPrompt: string;
  selectedModel: string;
  functions: string[];
  messageConfig: any;
  createdAt: string;
  updatedAt: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export interface FlowData {
  id: string;
  name: string;
  nodes: any[];
  edges: any[];
  createdAt: string;
  updatedAt: string;
}

// Mock API service with localStorage persistence
class ApiService {
  private baseUrl = 'http://localhost:3000/api'; // Will be replaced with actual API
  private initialized = false;
  
  // Bot Management
  async createBot(botData: Omit<Bot, 'id' | 'createdAt' | 'updatedAt'>): Promise<Bot> {
    const bot: Bot = {
      ...botData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const bots = this.getBots();
    bots.push(bot);
    localStorage.setItem('bots', JSON.stringify(bots));
    
    return bot;
  }

  async updateBot(botId: string, botData: Partial<Bot>): Promise<Bot> {
    const bots = this.getBots();
    const index = bots.findIndex(b => b.id === botId);
    
    if (index === -1) throw new Error('Bot not found');
    
    bots[index] = {
      ...bots[index],
      ...botData,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem('bots', JSON.stringify(bots));
    return bots[index];
  }

  getBots(): Bot[] {
    this.ensureInitialized();
    const bots = localStorage.getItem('bots');
    return bots ? JSON.parse(bots) : [];
  }

  getBotById(botId: string): Bot | null {
    const bots = this.getBots();
    return bots.find(b => b.id === botId) || null;
  }

  async deleteBot(botId: string): Promise<void> {
    const bots = this.getBots();
    const filteredBots = bots.filter(b => b.id !== botId);
    localStorage.setItem('bots', JSON.stringify(filteredBots));
  }

  // Tool Management
  async createTool(toolData: Omit<Tool, 'id' | 'createdAt' | 'updatedAt'>): Promise<Tool> {
    const tool: Tool = {
      ...toolData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const tools = this.getTools();
    tools.push(tool);
    localStorage.setItem('tools', JSON.stringify(tools));
    
    return tool;
  }

  async updateTool(toolId: string, toolData: Partial<Tool>): Promise<Tool> {
    const tools = this.getTools();
    const index = tools.findIndex(t => t.id === toolId);
    
    if (index === -1) throw new Error('Tool not found');
    
    tools[index] = {
      ...tools[index],
      ...toolData,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem('tools', JSON.stringify(tools));
    return tools[index];
  }

  getTools(): Tool[] {
    this.ensureInitialized();
    const tools = localStorage.getItem('tools');
    return tools ? JSON.parse(tools) : [];
  }

  getToolById(toolId: string): Tool | null {
    const tools = this.getTools();
    return tools.find(t => t.id === toolId) || null;
  }

  async deleteTool(toolId: string): Promise<void> {
    const tools = this.getTools();
    const filteredTools = tools.filter(t => t.id !== toolId);
    localStorage.setItem('tools', JSON.stringify(filteredTools));
  }

  // Flow Management
  async saveFlow(flowData: Omit<FlowData, 'id' | 'createdAt' | 'updatedAt'>): Promise<FlowData> {
    const flows = this.getFlows();
    const existingIndex = flows.findIndex(f => f.name === flowData.name);
    
    if (existingIndex !== -1) {
      // Update existing flow
      flows[existingIndex] = {
        ...flows[existingIndex],
        ...flowData,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('flows', JSON.stringify(flows));
      return flows[existingIndex];
    } else {
      // Create new flow
      const flow: FlowData = {
        ...flowData,
        id: this.generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      flows.push(flow);
      localStorage.setItem('flows', JSON.stringify(flows));
      return flow;
    }
  }

  getFlows(): FlowData[] {
    const flows = localStorage.getItem('flows');
    return flows ? JSON.parse(flows) : [];
  }

  // Configuration saves
  async saveMessageConfig(botId: string, config: any): Promise<void> {
    const bot = this.getBotById(botId);
    if (bot) {
      await this.updateBot(botId, { messageConfig: config });
    }
  }

  async savePromptConfig(botId: string, prompt: string): Promise<void> {
    const bot = this.getBotById(botId);
    if (bot) {
      await this.updateBot(botId, { agentPrompt: prompt });
    }
  }

  // Testing functions
  async testBot(botId: string, testInput: any): Promise<any> {
    // Mock bot testing - would connect to actual LLM APIs
    return {
      success: true,
      response: "Bot test successful",
      timestamp: new Date().toISOString()
    };
  }

  private generateId(): string {
    return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  private ensureInitialized() {
    if (this.initialized) return;
    
    console.log('Initializing API service...');
    
    // Check if data already exists
    const existingBots = localStorage.getItem('bots');
    const existingTools = localStorage.getItem('tools');
    
    console.log('Existing bots:', existingBots);
    console.log('Existing tools:', existingTools);
    
    // Initialize with sample data if empty
    if (!existingBots || JSON.parse(existingBots).length === 0) {
      console.log('Initializing sample bots...');
      this.initializeSampleBots();
    }
    
    if (!existingTools || JSON.parse(existingTools).length === 0) {
      console.log('Initializing sample tools...');
      this.initializeSampleTools();
    }
    
    this.initialized = true;
    console.log('API service initialized!');
  }

  private initializeSampleBots() {
    const sampleBots = [];

    localStorage.setItem('bots', JSON.stringify(sampleBots));
  }

  private initializeSampleTools() {
    const sampleTools = [];

    localStorage.setItem('tools', JSON.stringify(sampleTools));
  }
}

export const apiService = new ApiService();