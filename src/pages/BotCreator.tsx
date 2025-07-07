import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Bot, Save, Play, Settings, Plus, X, MessageCircle, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FunctionDialog } from "@/components/FunctionDialog";
import { MessageConfigDialog } from "@/components/MessageConfigDialog";
import { PromptDialog } from "@/components/PromptDialog";
import { ToolLibrary } from "@/components/ToolLibrary";
import { apiService, Bot as BotType, Tool } from "@/services/api";

const BotCreator = () => {
  const [botName, setBotName] = useState("");
  const [botDescription, setBotDescription] = useState("");
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [allTools, setAllTools] = useState<Tool[]>([]);
  const [selectedModel, setSelectedModel] = useState("OpenAI");
  const [agentPrompt, setAgentPrompt] = useState("");
  const [messageConfig, setMessageConfig] = useState<any>(null);
  const [showFunctionDialog, setShowFunctionDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showPromptDialog, setShowPromptDialog] = useState(false);
  const [showToolLibrary, setShowToolLibrary] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBotId, setEditingBotId] = useState<string | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const models = ["Gemini", "OpenAI", "Deepseek"];

  useEffect(() => {
    loadTools();
    const botId = searchParams.get('edit');
    if (botId) {
      loadBotForEditing(botId);
    }
  }, [searchParams]);

  const loadTools = () => {
    const tools = apiService.getTools();
    setAllTools(tools);
  };

  const loadBotForEditing = (botId: string) => {
    const bot = apiService.getBotById(botId);
    if (bot) {
      setBotName(bot.name);
      setBotDescription(bot.description);
      setSelectedTools(bot.functions);
      setSelectedModel(bot.selectedModel);
      setAgentPrompt(bot.agentPrompt);
      setMessageConfig(bot.messageConfig);
      setIsEditing(true);
      setEditingBotId(botId);
    }
  };

  const handleSaveBot = async () => {
    if (!botName.trim()) {
      toast({
        title: "Validation Error",
        description: "Bot name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      const botData = {
        name: botName,
        description: botDescription,
        functions: selectedTools,
        selectedModel,
        agentPrompt,
        messageConfig
      };

      if (isEditing && editingBotId) {
        await apiService.updateBot(editingBotId, botData);
        toast({
          title: "Bot Updated",
          description: `Bot "${botName}" has been updated successfully!`,
        });
      } else {
        await apiService.createBot(botData);
        toast({
          title: "Bot Created",
          description: `Bot "${botName}" has been created successfully!`,
        });
      }
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save bot. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleTestBot = async () => {
    if (!botName.trim()) {
      toast({
        title: "Validation Error",
        description: "Bot name is required for testing",
        variant: "destructive"
      });
      return;
    }

    try {
      await apiService.testBot('test', { input: 'test' });
      toast({
        title: "Bot Test Successful",
        description: "Your bot configuration is working correctly!",
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Bot testing failed. Please check your configuration.",
        variant: "destructive"
      });
    }
  };

  const handleAddFunction = async (toolData: { name: string; description: string; code: string }) => {
    try {
      const newTool = await apiService.createTool(toolData);
      setAllTools([...allTools, newTool]);
      setSelectedTools([...selectedTools, newTool.id]);
      toast({
        title: "Tool Created",
        description: `Tool "${toolData.name}" has been created and added to this bot.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create tool. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveTool = (toolId: string) => {
    setSelectedTools(selectedTools.filter(id => id !== toolId));
  };

  const handleMessageConfig = (config: any) => {
    setMessageConfig(config);
    toast({
      title: "Message Configuration Saved",
      description: "Message settings have been updated.",
    });
  };

  const handlePromptSave = (prompt: string) => {
    setAgentPrompt(prompt);
    toast({
      title: "Agent Prompt Saved",
      description: "Agent prompt has been updated.",
    });
  };

  const getSelectedToolsData = () => {
    return allTools.filter(tool => selectedTools.includes(tool.id));
  };

  return (
    <>
      <div className="container mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
            <h1 className="text-3xl font-bold">{isEditing ? 'Edit Bot' : 'Bot Creator'}</h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Modify your intelligent agent' : 'Design and configure your intelligent agent'}
            </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleTestBot} variant="outline" className="gap-2 px-6">
              <Play className="w-4 h-4" />
              Test Bot
            </Button>
            <Button onClick={handleSaveBot} className="gap-2 px-6">
              <Save className="w-4 h-4" />
              {isEditing ? 'Update Bot' : 'Save Bot'}
            </Button>
          </div>
        </div>

        {/* Bot Details Section */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-xl">Bot Details</CardTitle>
            <CardDescription>
              Define your bot's basic information and identity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="bot-name">Bot Name</Label>
                <Input
                  id="bot-name"
                  placeholder="Enter bot name..."
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bot-description">Description</Label>
                <Textarea
                  id="bot-description"
                  placeholder="Describe what your bot does..."
                  value={botDescription}
                  onChange={(e) => setBotDescription(e.target.value)}
                  className="h-11 resize-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Tools */}
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Settings className="w-5 h-5" />
                      Tools
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Select and manage tools/functions that are essential for the bot operations.
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setShowToolLibrary(true)}
                      variant="outline" 
                      className="gap-2 px-4"
                    >
                      <Settings className="w-4 h-4" />
                      Manage Tools
                    </Button>
                    <Button 
                      onClick={() => setShowFunctionDialog(true)}
                      variant="outline" 
                      className="gap-2 px-4"
                    >
                      <Plus className="w-4 h-4" />
                      Create Tool
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {selectedTools.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-xl">
                    <Settings className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No Tools Selected</p>
                    <p className="text-sm mt-1">Select tools from the library or create a new one</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getSelectedToolsData().map((tool) => (
                      <div key={tool.id} className="flex items-center justify-between p-4 border border-border rounded-xl bg-card/50">
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{tool.name}</div>
                          <div className="text-sm text-muted-foreground mt-1">{tool.description}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Created: {new Date(tool.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTool(tool.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* LLM Model */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-xl">LLM Model</CardTitle>
                <CardDescription>
                  Select the language model that will power your bot's intelligence.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {models.map((model) => (
                    <div key={model} className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                      <input
                        type="radio"
                        id={model}
                        name="model"
                        checked={selectedModel === model}
                        onChange={() => setSelectedModel(model)}
                        className="w-4 h-4 text-primary"
                      />
                      <Label htmlFor={model} className="text-sm font-medium cursor-pointer flex-1">{model}</Label>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Agent Prompt</Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Configure the system prompt that defines your agent's behavior
                      </p>
                    </div>
                    <Button 
                      onClick={() => setShowPromptDialog(true)}
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Configure
                    </Button>
                  </div>
                  {agentPrompt && (
                    <div className="p-3 bg-accent/20 border border-border rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        {agentPrompt.substring(0, 100)}
                        {agentPrompt.length > 100 ? "..." : ""}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Message Configuration</Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Configure welcome, closing, and re-engagement messages
                      </p>
                    </div>
                    <Button 
                      onClick={() => setShowMessageDialog(true)}
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <FunctionDialog
        open={showFunctionDialog}
        onOpenChange={setShowFunctionDialog}
        onSave={handleAddFunction}
      />
      
      <MessageConfigDialog
        open={showMessageDialog}
        onOpenChange={setShowMessageDialog}
        onSave={handleMessageConfig}
        initialConfig={messageConfig}
      />

      <PromptDialog
        open={showPromptDialog}
        onOpenChange={setShowPromptDialog}
        onSave={handlePromptSave}
        initialValue={agentPrompt}
      />

      <ToolLibrary
        open={showToolLibrary}
        onOpenChange={setShowToolLibrary}
        selectedTools={selectedTools}
        onToolSelectionChange={setSelectedTools}
      />
    </>
  );
};

export default BotCreator;