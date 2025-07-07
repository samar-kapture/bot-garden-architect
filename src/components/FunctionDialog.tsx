import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Editor from '@monaco-editor/react';
import { Tool } from "@/services/api";

interface FunctionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (func: {
    name: string;
    description: string;
    code: string;
  }) => void;
  initialTool?: Tool | null;
}

export const FunctionDialog = ({ open, onOpenChange, onSave, initialTool }: FunctionDialogProps) => {
  const [functionName, setFunctionName] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState(`// Function implementation
function functionName() {
  // Your code here
  return {
    success: true,
    data: "Function executed successfully"
  };
}`);

  useEffect(() => {
    if (initialTool) {
      setFunctionName(initialTool.name);
      setDescription(initialTool.description);
      setCode(initialTool.code);
    } else {
      // Reset form for new tool
      setFunctionName("");
      setDescription("");
      setCode(`// Function implementation
function functionName() {
  // Your code here
  return {
    success: true,
    data: "Function executed successfully"
  };
}`);
    }
  }, [initialTool, open]);

  const handleSave = () => {
    if (!functionName.trim()) return;
    
    onSave({
      name: functionName,
      description,
      code
    });
    
    // Reset form
    setFunctionName("");
    setDescription("");
    setCode("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {initialTool ? 'Edit Tool' : 'Create Tool'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-6 h-full">
          {/* Left side - Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="function-name">Function Name</Label>
              <Input
                id="function-name"
                placeholder="Enter name"
                value={functionName}
                onChange={(e) => setFunctionName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="mt-auto pt-4">
              <Button onClick={handleSave} className="w-full">
                Save & Update
              </Button>
            </div>
          </div>
          
          {/* Right side - Code Editor */}
          <div className="space-y-2">
            <Label>Function Code</Label>
            <div className="h-[500px] border border-code-border rounded-lg overflow-hidden">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                value={code}
                onChange={(value) => setCode(value || "")}
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};