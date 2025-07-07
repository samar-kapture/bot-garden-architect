import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Bot, Save, Play, Settings, Plus, X, MessageCircle, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FunctionDialog } from "@/components/FunctionDialog";
import { MessageConfigDialog } from "@/components/MessageConfigDialog";
import { PromptDialog } from "@/components/PromptDialog";

const BotCreator = () => {
  const [botName, setBotName] = useState("");
  const [botDescription, setBotDescription] = useState("");
  const [functions, setFunctions] = useState<Array<{name: string; description: string; code: string}>>([]);
  const [selectedModel, setSelectedModel] = useState("OpenAI");
  const [agentPrompt, setAgentPrompt] = useState("");
  const [showFunctionDialog, setShowFunctionDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showPromptDialog, setShowPromptDialog] = useState(false);
  
  const { toast } = useToast();

  const models = ["Gemini", "OpenAI", "Deepseek"];

  const handleSaveBot = () => {
    if (!botName.trim()) {
      toast({
        title: "Validation Error",
        description: "Bot name is required",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Bot Saved",
      description: `Bot "${botName}" has been saved successfully!`,
    });
  };

  const handleTestBot = () => {
    toast({
      title: "Testing Bot",
      description: "Bot testing functionality will be implemented",
      variant: "default"
    });
  };

  const handleAddFunction = (func: {name: string; description: string; code: string}) => {
    setFunctions([...functions, func]);
  };

  const handleRemoveFunction = (index: number) => {
    setFunctions(functions.filter((_, i) => i !== index));
  };

  const handleMessageConfig = (config: any) => {
    console.log("Message config saved:", config);
  };

  const handlePromptSave = (prompt: string) => {
    setAgentPrompt(prompt);
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
              <h1 className="text-3xl font-bold">Bot Creator</h1>
              <p className="text-muted-foreground">Design and configure your intelligent agent</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleTestBot} variant="outline" className="gap-2 px-6">
              <Play className="w-4 h-4" />
              Test Bot
            </Button>
            <Button onClick={handleSaveBot} className="gap-2 px-6">
              <Save className="w-4 h-4" />
              Save Bot
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
            {/* Functions */}
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Settings className="w-5 h-5" />
                      Functions
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Create and add functions/APIs that are essential for the bot operations.
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => setShowFunctionDialog(true)}
                    variant="outline" 
                    className="gap-2 px-4"
                  >
                    <Plus className="w-4 h-4" />
                    Add Function
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {functions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-xl">
                    <Settings className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No Functions Available</p>
                    <p className="text-sm mt-1">Add your first function to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {functions.map((func, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-border rounded-xl bg-card/50">
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{func.name}</div>
                          <div className="text-sm text-muted-foreground mt-1">{func.description}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFunction(index)}
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
      />

      <PromptDialog
        open={showPromptDialog}
        onOpenChange={setShowPromptDialog}
        onSave={handlePromptSave}
        initialValue={agentPrompt}
      />
    </>
  );
};

export default BotCreator;