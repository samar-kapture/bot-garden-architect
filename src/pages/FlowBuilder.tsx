import { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder, Save, Play, Plus, Download } from "lucide-react";

// Initial nodes and edges
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default',
    position: { x: 250, y: 5 },
    data: { 
      label: 'Data Analyst Bot',
      description: 'Processes data input'
    },
    style: {
      background: 'hsl(217 91% 60%)',
      color: 'white',
      border: '1px solid hsl(217 91% 50%)',
      borderRadius: '8px',
      padding: '10px',
    }
  },
  {
    id: '2',
    type: 'default', 
    position: { x: 100, y: 100 },
    data: { 
      label: 'Content Writer Bot',
      description: 'Generates content'
    },
    style: {
      background: 'hsl(262 83% 58%)',
      color: 'white', 
      border: '1px solid hsl(262 83% 48%)',
      borderRadius: '8px',
      padding: '10px',
    }
  },
  {
    id: '3',
    type: 'default',
    position: { x: 400, y: 100 },
    data: { 
      label: 'API Integration Bot',
      description: 'Handles API calls'
    },
    style: {
      background: 'hsl(142 76% 36%)',
      color: 'white',
      border: '1px solid hsl(142 76% 26%)', 
      borderRadius: '8px',
      padding: '10px',
    }
  },
];

const initialEdges: Edge[] = [
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2',
    style: { stroke: 'hsl(217 91% 60%)' }
  },
  { 
    id: 'e1-3', 
    source: '1', 
    target: '3',
    style: { stroke: 'hsl(217 91% 60%)' }
  },
];

// Available bots that can be added to the flow
const availableBots = [
  { id: 'data-analyst', name: 'Data Analyst Bot', color: 'hsl(217 91% 60%)' },
  { id: 'content-writer', name: 'Content Writer Bot', color: 'hsl(262 83% 58%)' },
  { id: 'api-integration', name: 'API Integration Bot', color: 'hsl(142 76% 36%)' },
  { id: 'seo-optimizer', name: 'SEO Optimizer Bot', color: 'hsl(38 92% 50%)' },
  { id: 'image-generator', name: 'Image Generator Bot', color: 'hsl(0 72% 51%)' },
];

const FlowBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedBot, setSelectedBot] = useState<string | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const addBotToFlow = (bot: typeof availableBots[0]) => {
    const newId = `${bot.id}-${Date.now()}`;
    const newNode: Node = {
      id: newId,
      type: 'default',
      position: { x: Math.random() * 400, y: Math.random() * 300 },
      data: { 
        label: bot.name,
        description: 'Bot instance'
      },
      style: {
        background: bot.color,
        color: 'white',
        border: `1px solid ${bot.color}`,
        borderRadius: '8px',
        padding: '10px',
      }
    };
    
    setNodes((nds) => [...nds, newNode]);
  };

  const saveFlow = () => {
    const flowData = {
      nodes,
      edges,
      timestamp: new Date().toISOString()
    };
    console.log('Saving flow:', flowData);
    // TODO: Implement save functionality
  };

  const runFlow = () => {
    console.log('Running flow with nodes:', nodes.length, 'edges:', edges.length);
    // TODO: Implement flow execution
  };

  const exportFlow = () => {
    const flowData = { nodes, edges };
    const blob = new Blob([JSON.stringify(flowData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agent-flow.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 bg-card border-r border-border p-4 space-y-4 overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Folder className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Flow Builder</h1>
            <p className="text-sm text-muted-foreground">Design agent workflows</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={saveFlow} size="sm" className="flex-1 gap-1">
            <Save className="w-3 h-3" />
            Save
          </Button>
          <Button onClick={runFlow} size="sm" variant="outline" className="flex-1 gap-1">
            <Play className="w-3 h-3" />
            Run
          </Button>
          <Button onClick={exportFlow} size="sm" variant="outline" className="gap-1">
            <Download className="w-3 h-3" />
          </Button>
        </div>

        {/* Available Bots */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Available Bots</CardTitle>
            <CardDescription>
              Drag these bots into your workflow
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {availableBots.map((bot) => (
              <div
                key={bot.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => addBotToFlow(bot)}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: bot.color }}
                  />
                  <span className="text-sm font-medium">{bot.name}</span>
                </div>
                <Plus className="w-4 h-4 text-muted-foreground" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Flow Stats */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Flow Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Nodes:</span>
              <span className="font-medium">{nodes.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Connections:</span>
              <span className="font-medium">{edges.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-medium text-success">Ready</span>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Click bots above to add them to the flow</p>
            <p>• Drag nodes to reposition them</p>
            <p>• Connect nodes by dragging from one to another</p>
            <p>• Use controls to zoom and pan</p>
            <p>• Save your work before closing</p>
          </CardContent>
        </Card>
      </div>

      {/* Flow Canvas */}
      <div className="flex-1 relative bg-background">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          attributionPosition="top-right"
        >
          <Controls />
          <MiniMap 
            style={{
              height: 120,
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))'
            }}
            zoomable
            pannable
          />
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={20} 
            size={1}
            color="hsl(var(--border))"
          />
        </ReactFlow>
      </div>
    </div>
  );
};

export default FlowBuilder;