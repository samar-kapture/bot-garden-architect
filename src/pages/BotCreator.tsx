import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Bot, Save, Play, Settings, Plus, X, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FunctionDialog } from "@/components/FunctionDialog";
import { MessageConfigDialog } from "@/components/MessageConfigDialog";

const BotCreator = () => {
  const [botName, setBotName] = useState("");
  const [botDescription, setBotDescription] = useState("");
  const [functions, setFunctions] = useState<Array<{name: string; description: string; code: string}>>([]);
  const [selectedModel, setSelectedModel] = useState("OpenAI");
  const [apiKey, setApiKey] = useState("");
  const [prompts, setPrompts] = useState<string[]>([]);
  const [actions, setActions] = useState<Array<{name: string; description: string}>>([
    { name: "orderstatus", description: "status of the order" },
    { name: "meeshocustomerdata", description: "customer data of meesho" },
    { name: "meeshocustomerdata1", description: "data of the customer" },
    { name: "ordersingledetails", description: "details of the order" }
  ]);
  const [showFunctionDialog, setShowFunctionDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  
  const { toast } = useToast();

  const models = ["Vitos", "Gemini", "OpenAI", "Deepseek"];

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

  const handleAddPrompt = () => {
    setPrompts([...prompts, ""]);
  };

  const handleRemovePrompt = (index: number) => {
    setPrompts(prompts.filter((_, i) => i !== index));
  };

  const handlePromptChange = (index: number, value: string) => {
    const updated = prompts.map((prompt, i) => i === index ? value : prompt);
    setPrompts(updated);
  };

  const handleAddAction = (action: {name: string; description: string}) => {
    setActions([...actions, action]);
  };

  const handleMessageConfig = (config: any) => {
    console.log("Message config saved:", config);
  };

  return (
    <>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Bot Creator</h1>
              <p className="text-muted-foreground">Design and configure your intelligent agent</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleTestBot} variant="outline" className="gap-2">
              <Play className="w-4 h-4" />
              Test Bot
            </Button>
            <Button onClick={handleSaveBot} className="gap-2">
              <Save className="w-4 h-4" />
              Save Bot
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Functions */}
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Functions
                  </CardTitle>
                  <Button 
                    onClick={() => setShowFunctionDialog(true)}
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add New
                  </Button>
                </div>
                <CardDescription>
                  Create and add function/APIs that are essential for the bot operations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {functions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-lg">
                    No Functions Available
                  </div>
                ) : (
                  <div className="space-y-2">
                    {functions.map((func, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <div className="font-medium">{func.name}</div>
                          <div className="text-sm text-muted-foreground">{func.description}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFunction(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Available Actions */}
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Available Actions</CardTitle>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Action
                  </Button>
                </div>
                <CardDescription>
                  Proceed to select existing actions or add new
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {actions.map((action, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-primary">{action.name}</div>
                        <div className="text-sm text-muted-foreground">{action.description}</div>
                      </div>
                      <Button variant="outline" size="sm">
                        + Add
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* LLM Model */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>LLM Model</CardTitle>
                <CardDescription>
                  Leverages a LLM to enhance business logic.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {models.map((model) => (
                    <div key={model} className="flex items-center gap-2">
                      <input
                        type="radio"
                        id={model}
                        name="model"
                        checked={selectedModel === model}
                        onChange={() => setSelectedModel(model)}
                        className="w-4 h-4"
                      />
                      <Label htmlFor={model} className="text-sm">{model}</Label>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-key">
                    API Key <span className="text-destructive">*</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Provides a secure API Key to enable speech-to-text transcription in the Transcriber UI.
                  </p>
                  <Input
                    id="api-key"
                    placeholder="Enter API Key"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Agent Prompts</Label>
                    <Button 
                      onClick={handleAddPrompt}
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Prompt
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Attach files and Add appropriate prompts to train the bot
                  </p>
                  {prompts.length > 0 && (
                    <div className="space-y-2">
                      {prompts.map((prompt, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={prompt}
                            onChange={(e) => handlePromptChange(index, e.target.value)}
                            placeholder="Enter prompt..."
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemovePrompt(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Message Configuration</Label>
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
                  <p className="text-xs text-muted-foreground">
                    Configure welcome, closing wait period messages and logics.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Bot Configuration */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Bot Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bot-name">Bot Name</Label>
                  <Input
                    id="bot-name"
                    placeholder="Enter bot name..."
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bot-description">Description</Label>
                  <Textarea
                    id="bot-description"
                    placeholder="Describe what your bot does..."
                    value={botDescription}
                    onChange={(e) => setBotDescription(e.target.value)}
                    rows={3}
                  />
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
    </>
  );
};

export default BotCreator;