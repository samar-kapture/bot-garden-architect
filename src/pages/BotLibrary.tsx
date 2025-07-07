import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Book, Search, Edit, Trash2, Play, Copy } from "lucide-react";

// Mock data for demonstration
const mockBots = [
  {
    id: "1",
    name: "Data Analyst Bot",
    description: "Analyzes datasets and generates insights with custom Python tools",
    systemPrompt: "You are a data analyst bot specialized in statistical analysis...",
    tools: ["data_analyzer", "chart_generator", "statistical_tests"],
    createdAt: "2024-01-15",
    lastModified: "2024-01-20"
  },
  {
    id: "2", 
    name: "Content Writer Bot",
    description: "Creates engaging content with SEO optimization tools",
    systemPrompt: "You are a creative content writer focused on engagement...",
    tools: ["seo_optimizer", "grammar_checker", "tone_analyzer"],
    createdAt: "2024-01-10",
    lastModified: "2024-01-18"
  },
  {
    id: "3",
    name: "API Integration Bot", 
    description: "Handles complex API integrations and data transformations",
    systemPrompt: "You are an API integration specialist...",
    tools: ["api_caller", "data_transformer", "webhook_handler"],
    createdAt: "2024-01-05",
    lastModified: "2024-01-22"
  }
];

const BotLibrary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [bots] = useState(mockBots);

  const filteredBots = bots.filter(bot =>
    bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bot.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditBot = (botId: string) => {
    console.log("Edit bot:", botId);
    // TODO: Navigate to bot editor
  };

  const handleDeleteBot = (botId: string) => {
    console.log("Delete bot:", botId);
    // TODO: Delete bot with confirmation
  };

  const handleTestBot = (botId: string) => {
    console.log("Test bot:", botId);
    // TODO: Test bot functionality
  };

  const handleCloneBot = (botId: string) => {
    console.log("Clone bot:", botId);
    // TODO: Clone bot to creator
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Book className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Bot Library</h1>
            <p className="text-muted-foreground">Manage and organize your created bots</p>
          </div>
        </div>
        <Button className="gap-2">
          <Book className="w-4 h-4" />
          Import Bot
        </Button>
      </div>

      {/* Search */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search bots by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Bots</p>
                <p className="text-2xl font-bold">{bots.length}</p>
              </div>
              <Book className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Bots</p>
                <p className="text-2xl font-bold">{bots.length}</p>
              </div>
              <Play className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tools</p>
                <p className="text-2xl font-bold">
                  {bots.reduce((acc, bot) => acc + bot.tools.length, 0)}
                </p>
              </div>
              <Edit className="w-8 h-8 text-info" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p className="text-sm font-bold">Jan 22, 2024</p>
              </div>
              <Book className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bot Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBots.map((bot) => (
          <Card key={bot.id} className="shadow-card hover:shadow-glow transition-all duration-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{bot.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {bot.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Tools */}
              <div>
                <p className="text-sm font-medium mb-2">Tools ({bot.tools.length})</p>
                <div className="flex flex-wrap gap-1">
                  {bot.tools.slice(0, 3).map((tool) => (
                    <Badge key={tool} variant="secondary" className="text-xs">
                      {tool}
                    </Badge>
                  ))}
                  {bot.tools.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{bot.tools.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Created: {bot.createdAt}</p>
                <p>Modified: {bot.lastModified}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTestBot(bot.id)}
                  className="flex-1 gap-1"
                >
                  <Play className="w-3 h-3" />
                  Test
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditBot(bot.id)}
                  className="flex-1 gap-1"
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCloneBot(bot.id)}
                  className="gap-1"
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteBot(bot.id)}
                  className="gap-1 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBots.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="p-8 text-center">
            <Book className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No bots found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? "No bots match your search criteria. Try adjusting your search terms."
                : "You haven't created any bots yet. Start building your first intelligent agent!"
              }
            </p>
            {!searchQuery && (
              <Button>Create Your First Bot</Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BotLibrary;