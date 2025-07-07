import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Plus, Settings, Search, Edit, Trash2 } from "lucide-react";
import { apiService, Tool } from "@/services/api";
import { FunctionDialog } from "@/components/FunctionDialog";

interface ToolLibraryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTools: string[];
  onToolSelectionChange: (toolIds: string[]) => void;
}

export const ToolLibrary = ({ open, onOpenChange, selectedTools, onToolSelectionChange }: ToolLibraryProps) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFunctionDialog, setShowFunctionDialog] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);

  useEffect(() => {
    if (open) {
      loadTools();
    }
  }, [open]);

  const loadTools = () => {
    const allTools = apiService.getTools();
    setTools(allTools);
  };

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToolToggle = (toolId: string) => {
    const newSelection = selectedTools.includes(toolId)
      ? selectedTools.filter(id => id !== toolId)
      : [...selectedTools, toolId];
    onToolSelectionChange(newSelection);
  };

  const handleCreateTool = async (toolData: { name: string; description: string; code: string }) => {
    try {
      await apiService.createTool(toolData);
      loadTools();
      setShowFunctionDialog(false);
    } catch (error) {
      console.error('Error creating tool:', error);
    }
  };

  const handleUpdateTool = async (toolData: { name: string; description: string; code: string }) => {
    if (!editingTool) return;
    
    try {
      await apiService.updateTool(editingTool.id, toolData);
      loadTools();
      setShowFunctionDialog(false);
      setEditingTool(null);
    } catch (error) {
      console.error('Error updating tool:', error);
    }
  };

  const handleDeleteTool = async (toolId: string) => {
    try {
      await apiService.deleteTool(toolId);
      loadTools();
      // Remove from selection if it was selected
      if (selectedTools.includes(toolId)) {
        onToolSelectionChange(selectedTools.filter(id => id !== toolId));
      }
    } catch (error) {
      console.error('Error deleting tool:', error);
    }
  };

  const handleEditTool = (tool: Tool) => {
    setEditingTool(tool);
    setShowFunctionDialog(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Tool Library
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col h-full">
            {/* Header Actions */}
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                onClick={() => {
                  setEditingTool(null);
                  setShowFunctionDialog(true);
                }}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Tool
              </Button>
            </div>

            {/* Tools Grid */}
            <div className="flex-1 overflow-auto">
              {filteredTools.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-xl">
                  <Settings className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No Tools Available</p>
                  <p className="text-sm mt-1">Create your first tool to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTools.map((tool) => (
                    <Card key={tool.id} className="relative">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={selectedTools.includes(tool.id)}
                              onCheckedChange={() => handleToolToggle(tool.id)}
                            />
                            <div className="min-w-0 flex-1">
                              <CardTitle className="text-base truncate">{tool.name}</CardTitle>
                              <CardDescription className="text-sm mt-1 line-clamp-2">
                                {tool.description}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex gap-1 ml-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditTool(tool)}
                              className="p-1 h-6 w-6"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTool(tool.id)}
                              className="p-1 h-6 w-6 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Created: {formatDate(tool.createdAt)}</span>
                          {tool.updatedAt !== tool.createdAt && (
                            <Badge variant="outline" className="text-xs">
                              Updated
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {selectedTools.length} of {filteredTools.length} tools selected
              </div>
              <Button onClick={() => onOpenChange(false)}>
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <FunctionDialog
        open={showFunctionDialog}
        onOpenChange={setShowFunctionDialog}
        onSave={editingTool ? handleUpdateTool : handleCreateTool}
        initialTool={editingTool}
      />
    </>
  );
};