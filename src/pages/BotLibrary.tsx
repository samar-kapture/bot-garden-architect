import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Book, Search, Edit, Trash2, Play, Copy, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService, Bot as BotType, Tool } from "@/services/api";

const BotLibrary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [bots, setBots] = useState<BotType[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allBots = apiService.getBots();
    const allTools = apiService.getTools();
    setBots(allBots);
    setTools(allTools);
  };

  const filteredBots = bots.filter(bot =>
    bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bot.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditBot = (botId: string) => {
    navigate(`/create?edit=${botId}`);
  };

  const handleDeleteBot = async (botId: string) => {
    try {
      await apiService.deleteBot(botId);
      loadData();
      toast({
        title: "Bot Deleted",
        description: "Bot has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete bot. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleTestBot = async (botId: string) => {
    try {
      await apiService.testBot(botId, { input: 'test' });
      toast({
        title: "Bot Test Successful",
        description: "Your bot is working correctly!",
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Bot testing failed. Please check your configuration.",
        variant: "destructive"
      });
    }
  };

  const handleCloneBot = async (botId: string) => {
    try {
      const originalBot = apiService.getBotById(botId);
      if (originalBot) {
        const clonedBot = {
          ...originalBot,
          name: `${originalBot.name} (Copy)`,
        };
        delete (clonedBot as any).id;
        delete (clonedBot as any).createdAt;
        delete (clonedBot as any).updatedAt;
        
        await apiService.createBot(clonedBot);
        loadData();
        toast({
          title: "Bot Cloned",
          description: "Bot has been successfully cloned.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clone bot. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getBotTools = (bot: BotType) => {
    return tools.filter(tool => bot.functions.includes(tool.id));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
        <Button asChild className="gap-2">
          <Link to="/create">
            <Bot className="w-4 h-4" />
            Create Bot
          </Link>
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
                  {bots.reduce((acc, bot) => acc + bot.functions.length, 0)}
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
                <p className="text-sm font-bold">
                  {bots.length > 0 ? formatDate(Math.max(...bots.map(b => new Date(b.updatedAt).getTime())).toString()) : 'N/A'}
                </p>
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
                <p className="text-sm font-medium mb-2">Tools ({bot.functions.length})</p>
                <div className="flex flex-wrap gap-1">
                  {getBotTools(bot).slice(0, 3).map((tool) => (
                    <Badge key={tool.id} variant="secondary" className="text-xs">
                      {tool.name}
                    </Badge>
                  ))}
                  {bot.functions.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{bot.functions.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Created: {formatDate(bot.createdAt)}</p>
                <p>Modified: {formatDate(bot.updatedAt)}</p>
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
              <Button asChild>
                <Link to="/create">Create Your First Bot</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BotLibrary;