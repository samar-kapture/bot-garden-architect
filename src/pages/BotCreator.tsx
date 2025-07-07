import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Editor from '@monaco-editor/react';
import { Bot, Save, Play, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BotCreator = () => {
  const [botName, setBotName] = useState("");
  const [botDescription, setBotDescription] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [toolCode, setToolCode] = useState(`// Define your bot's tools here
function exampleTool(input) {
  // Your tool logic
  return {
    success: true,
    data: "Tool executed successfully"
  };
}

// Export your tools
export const tools = {
  exampleTool
};`);
  
  const { toast } = useToast();

  const handleSaveBot = () => {
    if (!botName.trim()) {
      toast({
        title: "Validation Error",
        description: "Bot name is required",
        variant: "destructive"
      });
      return;
    }

    // TODO: Save bot logic
    toast({
      title: "Bot Saved",
      description: `Bot "${botName}" has been saved successfully!`,
    });
  };

  const handleTestBot = () => {
    // TODO: Test bot logic
    toast({
      title: "Testing Bot",
      description: "Bot testing functionality will be implemented",
      variant: "default"
    });
  };

  return (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bot Configuration */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Bot Configuration
              </CardTitle>
              <CardDescription>
                Configure your bot's basic settings
              </CardDescription>
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

              <div className="space-y-2">
                <Label htmlFor="system-prompt">System Prompt</Label>
                <Textarea
                  id="system-prompt"
                  placeholder="Define your bot's personality and behavior..."
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Code Editor */}
        <div className="lg:col-span-2">
          <Card className="shadow-card h-full">
            <CardHeader>
              <CardTitle>Tool Development</CardTitle>
              <CardDescription>
                Write JavaScript functions to extend your bot's capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="tools" className="h-full">
                <TabsList className="w-full justify-start rounded-none border-b">
                  <TabsTrigger value="tools">Tools</TabsTrigger>
                  <TabsTrigger value="config">Config</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                
                <TabsContent value="tools" className="m-0 h-[600px]">
                  <div className="h-full border border-code-border rounded-b-lg overflow-hidden">
                    <Editor
                      height="100%"
                      defaultLanguage="javascript"
                      value={toolCode}
                      onChange={(value) => setToolCode(value || "")}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: "on",
                        wordWrap: "on",
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                      }}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="config" className="m-4">
                  <div className="space-y-4">
                    <h3 className="font-medium">Tool Configuration</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure how your tools interact with external APIs and services.
                    </p>
                    {/* TODO: Add tool configuration interface */}
                  </div>
                </TabsContent>
                
                <TabsContent value="preview" className="m-4">
                  <div className="space-y-4">
                    <h3 className="font-medium">Bot Preview</h3>
                    <div className="p-4 bg-code-bg rounded-lg border border-code-border">
                      <pre className="text-sm">
                        {JSON.stringify({
                          name: botName || "Untitled Bot",
                          description: botDescription || "No description",
                          systemPrompt: systemPrompt || "No system prompt",
                          tools: "Custom tools defined"
                        }, null, 2)}
                      </pre>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BotCreator;