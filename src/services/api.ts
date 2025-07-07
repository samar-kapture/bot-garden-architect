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
    
    // Initialize with sample data if empty
    if (this.getBots().length === 0) {
      this.initializeSampleBots();
    }
    
    if (this.getTools().length === 0) {
      this.initializeSampleTools();
    }
    
    this.initialized = true;
  }

  private initializeSampleBots() {
    const sampleBots = [
      {
        name: "Customer Support Assistant",
        description: "Intelligent assistant for handling customer inquiries and support tickets with natural language processing.",
        functions: [],
        selectedModel: "OpenAI",
        agentPrompt: "You are a helpful customer support assistant. Be polite, professional, and provide accurate information to resolve customer issues efficiently.",
        messageConfig: {
          welcomeMessage: "Hello! I'm your customer support assistant. How can I help you today?",
          reEngageMessages: [
            { time: 30, message: "Are you still there? I'm here to help." },
            { time: 60, message: "Is there anything else I can assist you with?" }
          ],
          closingMessage: "Thank you for contacting us. Have a great day!"
        }
      },
      {
        name: "Data Analysis Bot",
        description: "Advanced AI agent for analyzing datasets, generating insights, and creating visualizations from complex data.",
        functions: [],
        selectedModel: "Gemini",
        agentPrompt: "You are a data analyst assistant. Provide clear insights, identify patterns, and make data-driven recommendations with detailed explanations.",
        messageConfig: {
          welcomeMessage: "Welcome! I'm your data analysis assistant. Let's explore your data together.",
          reEngageMessages: [
            { time: 45, message: "Would you like me to continue with the analysis?" }
          ],
          closingMessage: "Analysis complete. Feel free to return for more insights!"
        }
      },
      {
        name: "Sales Automation Agent",
        description: "AI-powered sales assistant that manages leads, follows up with prospects, and automates sales workflows.",
        functions: [],
        selectedModel: "Deepseek",
        agentPrompt: "You are a sales assistant focused on helping qualify leads and supporting the sales process. Be engaging and persuasive while maintaining professionalism.",
        messageConfig: {
          welcomeMessage: "Hi there! I'm here to help you with your sales inquiries.",
          reEngageMessages: [
            { time: 30, message: "Can I help you find the right solution?" }
          ],
          closingMessage: "Thanks for your interest! Our team will follow up with you soon."
        }
      }
    ];

    sampleBots.forEach(bot => {
      this.createBot(bot);
    });
  }

  private initializeSampleTools() {
    const sampleTools = [
      {
        name: "Email Sender",
        description: "Sends formatted emails to specified recipients with customizable templates and attachments.",
        code: `async function sendEmail(to, subject, body, attachments = []) {
  // Email sending implementation
  try {
    const emailData = {
      to: to,
      subject: subject,
      html: body,
      attachments: attachments
    };
    
    console.log('Sending email:', emailData);
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      messageId: 'msg_' + Date.now(),
      message: 'Email sent successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}`
      },
      {
        name: "Data Validator",
        description: "Validates and sanitizes input data according to specified schemas and business rules.",
        code: `function validateData(data, schema = {}) {
  // Data validation implementation
  const errors = [];
  
  if (!data || typeof data !== 'object') {
    return { 
      valid: false, 
      errors: ['Invalid data format - expected object'] 
    };
  }
  
  // Check required fields
  if (schema.required) {
    schema.required.forEach(field => {
      if (!(field in data) || data[field] === null || data[field] === undefined) {
        errors.push(\`Missing required field: \${field}\`);
      }
    });
  }
  
  // Validate field types
  if (schema.fields) {
    Object.keys(schema.fields).forEach(field => {
      if (field in data) {
        const expectedType = schema.fields[field];
        const actualType = typeof data[field];
        if (actualType !== expectedType) {
          errors.push(\`Field \${field} should be \${expectedType}, got \${actualType}\`);
        }
      }
    });
  }
  
  return {
    valid: errors.length === 0,
    errors: errors,
    data: data
  };
}`
      },
      {
        name: "API Caller",
        description: "Makes HTTP requests to external APIs with error handling, retries, and response validation.",
        code: `async function callAPI(url, options = {}) {
  // API calling implementation
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 10000
  };
  
  const config = { ...defaultOptions, ...options };
  
  try {
    console.log(\`Making \${config.method} request to: \${url}\`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);
    
    const response = await fetch(url, {
      ...config,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      status: response.status,
      data: data,
      headers: Object.fromEntries(response.headers.entries())
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message,
      code: error.name
    };
  }
}`
      },
      {
        name: "File Processor",
        description: "Processes and transforms various file formats including CSV, JSON, and XML with data extraction capabilities.",
        code: `async function processFile(file, options = {}) {
  // File processing implementation
  const { format = 'auto', encoding = 'utf-8' } = options;
  
  try {
    let content;
    
    if (typeof file === 'string') {
      // File path or URL
      content = await fetch(file).then(res => res.text());
    } else if (file instanceof File) {
      // File object
      content = await file.text();
    } else {
      throw new Error('Invalid file input');
    }
    
    let parsedData;
    const detectedFormat = format === 'auto' ? detectFormat(content) : format;
    
    switch (detectedFormat) {
      case 'json':
        parsedData = JSON.parse(content);
        break;
      case 'csv':
        parsedData = parseCSV(content);
        break;
      case 'xml':
        parsedData = parseXML(content);
        break;
      default:
        parsedData = { raw: content };
    }
    
    return {
      success: true,
      format: detectedFormat,
      data: parsedData,
      size: content.length
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

function detectFormat(content) {
  const trimmed = content.trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) return 'json';
  if (trimmed.startsWith('<')) return 'xml';
  if (trimmed.includes(',') && trimmed.includes('\\n')) return 'csv';
  return 'text';
}

function parseCSV(content) {
  const lines = content.split('\\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    return headers.reduce((obj, header, index) => {
      obj[header] = values[index] || '';
      return obj;
    }, {});
  });
  return { headers, rows, count: rows.length };
}`
      }
    ];

    sampleTools.forEach(tool => {
      this.createTool(tool);
    });
  }
}

export const apiService = new ApiService();