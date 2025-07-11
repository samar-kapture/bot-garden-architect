import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Editor from '@monaco-editor/react';
import { Tool } from "@/services/api";
import { API_BASE_URL } from "@/config";

interface FunctionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (func: {
    name: string;
    description: string;
    code: string;
    task_id?: string;
    original_name?: string;
    status?: string;
  }) => void;
  initialTool?: Tool | null;
}

export const FunctionDialog = ({ open, onOpenChange, onSave, initialTool }: FunctionDialogProps) => {
  const [functionName, setFunctionName] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState(`# Function implementation\ndef function_name():\n    # Your code here\n    return {\n        'success': True,\n        'data': 'Function executed successfully'\n    }\n`);
  const [entryFunction, setEntryFunction] = useState("");
  const [queryFields, setQueryFields] = useState([
    { key: '', description: '', type: '' }
  ]);
  const [requirements, setRequirements] = useState("");
  const [envVars, setEnvVars] = useState("{}");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [polling, setPolling] = useState(false);
  const [pollingMsg, setPollingMsg] = useState("");
  let pollingInterval: NodeJS.Timeout | null = null;

  useEffect(() => {
    if (initialTool) {
      setFunctionName((initialTool as any).name);
      setDescription((initialTool as any).description);
      setEntryFunction((initialTool as any).entry_function || "");
      // Prefill queryFields from query_description (object with keys)
      let qFields: { key: string; description: string; type: string }[] = [];
      const queryDesc = (initialTool as any).query_description;
      if (queryDesc) {
        let qd = queryDesc;
        if (typeof qd === 'string') {
          try {
            qd = JSON.parse(qd);
          } catch {
            // fallback: treat as empty
            qd = {};
          }
        }
        if (qd && typeof qd === 'object' && !Array.isArray(qd)) {
          Object.entries(qd).forEach(([key, val]: [string, any]) => {
            if (val && typeof val === 'object') {
              qFields.push({
                key: key || '',
                description: typeof val.description === 'string' ? val.description : '',
                type: typeof val.type === 'string' ? val.type : ''
              });
            } else {
              qFields.push({ key: key || '', description: '', type: '' });
            }
          });
        }
      }
      // Always set at least one empty field for UI
      setQueryFields(qFields.length > 0 ? qFields : [{ key: '', description: '', type: '' }]);
      // Prefill requirements as comma-separated string
      const reqs = (initialTool as any).requirements;
      if (Array.isArray(reqs)) {
        setRequirements(reqs.join(', '));
      } else if (typeof reqs === 'string') {
        try {
          const arr = JSON.parse(reqs);
          if (Array.isArray(arr)) {
            setRequirements(arr.join(', '));
          } else {
            setRequirements(reqs);
          }
        } catch {
          setRequirements(reqs);
        }
      } else {
        setRequirements("");
      }
      // Prefill envVars as pretty JSON
      let envVarsStr = '{}';
      const envVarsVal = (initialTool as any).env_vars;
      if (envVarsVal) {
        let ev = envVarsVal;
        if (typeof ev === 'string') {
          try {
            ev = JSON.parse(ev);
          } catch {
            // fallback: keep as string
          }
        }
        if (typeof ev === 'object') {
          envVarsStr = JSON.stringify(ev, null, 2);
        } else if (typeof ev === 'string') {
          envVarsStr = ev;
        }
      }
      setEnvVars(envVarsStr);
      setCode((initialTool as any).code);
    } else {
      // Reset form for new tool
      setFunctionName("");
      setDescription("");
      setEntryFunction("");
      setQueryFields([{ key: '', description: '', type: '' }]);
      setRequirements("");
      setEnvVars("{}");
      setCode(`# Function implementation\ndef function_name():\n    # Your code here\n    return {\n        'success': True,\n        'data': 'Function executed successfully'\n    }\n`);
    }
    setError("");
  }, [initialTool, open]);

  const handleAddQueryField = () => {
    setQueryFields([...queryFields, { key: '', description: '', type: '' }]);
  };

  const handleRemoveQueryField = (idx: number) => {
    setQueryFields(queryFields.filter((_, i) => i !== idx));
  };

  const handleQueryFieldChange = (idx: number, field: string, value: string) => {
    setQueryFields(queryFields.map((q, i) => i === idx ? { ...q, [field]: value } : q));
  };

  // Polling is now handled in ToolLibrary, not here

  const handleSave = async () => {
    setError("");
    setPolling(false);
    setPollingMsg("");
    if (!functionName.trim() || !entryFunction.trim() || !code.trim()) {
      setError("Function name, entry function, and code are required.");
      return;
    }
    // Validate query fields
    for (const q of queryFields) {
      if (!q.key.trim() || !q.type.trim()) {
        setError("Each query field must have a key and type.");
        return;
      }
    }
    setLoading(true);
    try {
      const reqs = requirements.split(",").map(r => r.trim()).filter(Boolean);
      // Build queryDescription JSON from fields
      const queryDescObj: Record<string, { description: string; type: string }> = {};
      queryFields.forEach(q => {
        if (q.key.trim()) {
          queryDescObj[q.key.trim()] = {
            description: q.description.trim(),
            type: q.type.trim()
          };
        }
      });
      let envVarsObj = {};
      try {
        envVarsObj = JSON.parse(envVars);
      } catch (e) {
        setError("Env Vars must be valid JSON.");
        setLoading(false);
        return;
      }
      const params = new URLSearchParams();
      params.append("entry_function", entryFunction);
      params.append("function_name", functionName);
      params.append("description", description);
      params.append("query_description", JSON.stringify(queryDescObj));
      reqs.forEach(r => params.append("requirements", r));
      params.append("env_vars", JSON.stringify(envVarsObj));
      const url = `${API_BASE_URL}/multiagent-core/tools/clients/kapture/deploy-tools?${params.toString()}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "text/plain"
        },
        body: code
      });
      if (!response.ok) {
        setError("Failed to create tool. Please check your input and try again.");
        setLoading(false);
        return;
      }
      const toolResp = await response.json();
      if (toolResp.status === "task-submitted" && toolResp.task_id) {
        // Pass tool info and task_id to parent for background polling
        onSave({
          name: functionName,
          description,
          code,
          task_id: toolResp.task_id,
          original_name: functionName,
          status: 'deploying',
        });
        // Reset form
        setFunctionName("");
        setDescription("");
        setEntryFunction("");
        setQueryFields([{ key: '', description: '', type: '' }]);
        setRequirements("");
        setEnvVars("{}");
        setCode("");
        setLoading(false);
        onOpenChange(false);
      } else {
        setError("Unexpected response from server.");
        setLoading(false);
      }
    } catch (e) {
      setError("Failed to create tool. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {initialTool ? 'Edit Tool' : 'Create Tool'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6 h-full">
          {/* Left side - Form */}
          <div className="space-y-4 flex flex-col h-full max-h-[70vh] overflow-auto pr-2">
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
              <Label htmlFor="entry-function">Entry Function Name</Label>
              <Input
                id="entry-function"
                placeholder="e.g. check_delivery_availability"
                value={entryFunction}
                onChange={e => setEntryFunction(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter function description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Query Description</Label>
              {queryFields.map((q, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <Input
                    placeholder="Key Name"
                    value={q.key}
                    onChange={e => handleQueryFieldChange(idx, 'key', e.target.value)}
                    className="w-1/4"
                  />
                  <Input
                    placeholder="Key Description"
                    value={q.description}
                    onChange={e => handleQueryFieldChange(idx, 'description', e.target.value)}
                    className="w-2/4"
                  />
                  <Input
                    placeholder="Type (e.g. str, int)"
                    value={q.type}
                    onChange={e => handleQueryFieldChange(idx, 'type', e.target.value)}
                    className="w-1/4"
                  />
                  {queryFields.length > 1 && (
                    <Button type="button" variant="ghost" onClick={() => handleRemoveQueryField(idx)} className="text-destructive px-2">✕</Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={handleAddQueryField} className="mt-1">+ Add Field</Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements (comma separated)</Label>
              <Input
                id="requirements"
                placeholder=""
                value={requirements}
                onChange={e => setRequirements(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="env-vars">Env Vars (JSON)</Label>
              <Textarea
                id="env-vars"
                placeholder='{"KEY": "VALUE"}'
                value={envVars}
                onChange={e => setEnvVars(e.target.value)}
                rows={2}
                className="font-mono"
              />
            </div>
            {error && <div className="text-destructive text-sm pt-2">{error}</div>}
          </div>
          
          {/* Right side - Code Editor and Save Button */}
          <div className="space-y-2 flex flex-col h-full">
            <Label>Function Code</Label>
            <div className="h-[500px] border border-code-border rounded-lg overflow-hidden flex-1">
              <Editor
                height="100%"
                defaultLanguage="python"
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
            {polling && (
              <div className="text-center text-sm text-muted-foreground py-2">{pollingMsg}</div>
            )}
            <div className="pt-4">
              <Button onClick={handleSave} className="w-full" disabled={loading || polling}>
                {loading || polling ? "Saving..." : "Save & Update"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};