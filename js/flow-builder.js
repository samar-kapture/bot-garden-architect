// Flow Builder with Canvas-based Visual Graph
class FlowBuilder {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.selectedNode = null;
        this.dragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.connecting = false;
        this.connectionStart = null;
        this.mouse = { x: 0, y: 0 };
        
        this.setupCanvas();
        this.bindEvents();
        this.animate();
    }

    setupCanvas() {
        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Set default styles
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }

    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.draw();
    }

    bindEvents() {
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.canvas.addEventListener('click', (e) => this.onClick(e));
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.onRightClick(e);
        });
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    onMouseDown(e) {
        this.mouse = this.getMousePos(e);
        const clickedNode = this.getNodeAt(this.mouse.x, this.mouse.y);
        
        if (clickedNode) {
            if (e.shiftKey) {
                // Start connection
                this.connecting = true;
                this.connectionStart = clickedNode;
            } else {
                // Start dragging
                this.dragging = true;
                this.selectedNode = clickedNode;
                this.dragOffset = {
                    x: this.mouse.x - clickedNode.x,
                    y: this.mouse.y - clickedNode.y
                };
            }
        }
    }

    onMouseMove(e) {
        this.mouse = this.getMousePos(e);
        
        if (this.dragging && this.selectedNode) {
            this.selectedNode.x = this.mouse.x - this.dragOffset.x;
            this.selectedNode.y = this.mouse.y - this.dragOffset.y;
            this.draw();
        } else if (this.connecting) {
            this.draw();
        }
    }

    onMouseUp(e) {
        if (this.connecting && this.connectionStart) {
            const targetNode = this.getNodeAt(this.mouse.x, this.mouse.y);
            if (targetNode && targetNode !== this.connectionStart) {
                this.addConnection(this.connectionStart, targetNode);
            }
            this.connecting = false;
            this.connectionStart = null;
        }
        
        this.dragging = false;
        this.selectedNode = null;
        this.draw();
    }

    onClick(e) {
        this.mouse = this.getMousePos(e);
        const clickedNode = this.getNodeAt(this.mouse.x, this.mouse.y);
        
        if (clickedNode) {
            this.selectNode(clickedNode);
        } else {
            this.selectedNode = null;
        }
        
        this.draw();
    }

    onRightClick(e) {
        this.mouse = this.getMousePos(e);
        const clickedNode = this.getNodeAt(this.mouse.x, this.mouse.y);
        
        if (clickedNode) {
            this.showNodeContextMenu(clickedNode, this.mouse.x, this.mouse.y);
        }
    }

    addBot(botId) {
        const bot = storage.getBotById(botId);
        if (!bot) return;

        const node = {
            id: `node_${Date.now()}`,
            botId: botId,
            name: bot.name,
            description: bot.description,
            x: Math.random() * (this.canvas.width - 200) + 100,
            y: Math.random() * (this.canvas.height - 100) + 50,
            width: 180,
            height: 80,
            color: ColorUtils.getColorByIndex(this.nodes.length)
        };

        this.nodes.push(node);
        this.draw();
        this.updateStats();
    }

    removeNode(nodeId) {
        this.nodes = this.nodes.filter(node => node.id !== nodeId);
        this.connections = this.connections.filter(conn => 
            conn.from.id !== nodeId && conn.to.id !== nodeId
        );
        this.draw();
        this.updateStats();
    }

    addConnection(fromNode, toNode) {
        // Check if connection already exists
        const exists = this.connections.some(conn => 
            conn.from.id === fromNode.id && conn.to.id === toNode.id
        );
        
        if (!exists) {
            this.connections.push({
                id: `conn_${Date.now()}`,
                from: fromNode,
                to: toNode
            });
            this.updateStats();
        }
    }

    getNodeAt(x, y) {
        return this.nodes.find(node => 
            x >= node.x && x <= node.x + node.width &&
            y >= node.y && y <= node.y + node.height
        );
    }

    selectNode(node) {
        this.selectedNode = node;
        // Update UI to show selected node actions
        const nodeActionsCard = document.getElementById('node-actions-card');
        if (nodeActionsCard) {
            nodeActionsCard.style.display = 'block';
        }
    }

    showNodeContextMenu(node, x, y) {
        // Create context menu
        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.style.position = 'absolute';
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        menu.style.background = 'var(--bg-primary)';
        menu.style.border = '1px solid var(--border-light)';
        menu.style.borderRadius = 'var(--radius-md)';
        menu.style.boxShadow = 'var(--shadow-lg)';
        menu.style.zIndex = '1000';
        menu.style.padding = 'var(--spacing-sm)';
        
        menu.innerHTML = `
            <div class="menu-item" onclick="flowBuilder.removeNode('${node.id}'); this.parentElement.remove();">
                <i class="fas fa-trash"></i> Remove Node
            </div>
            <div class="menu-item" onclick="flowBuilder.duplicateNode('${node.id}'); this.parentElement.remove();">
                <i class="fas fa-copy"></i> Duplicate
            </div>
        `;
        
        document.body.appendChild(menu);
        
        // Remove menu when clicking elsewhere
        setTimeout(() => {
            document.addEventListener('click', function removeMenu() {
                if (menu.parentElement) {
                    menu.remove();
                }
                document.removeEventListener('click', removeMenu);
            });
        }, 10);
    }

    duplicateNode(nodeId) {
        const originalNode = this.nodes.find(node => node.id === nodeId);
        if (originalNode) {
            const newNode = {
                ...originalNode,
                id: `node_${Date.now()}`,
                x: originalNode.x + 20,
                y: originalNode.y + 20
            };
            this.nodes.push(newNode);
            this.draw();
            this.updateStats();
        }
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.drawGrid();
        
        // Draw connections
        this.connections.forEach(conn => this.drawConnection(conn));
        
        // Draw temporary connection if connecting
        if (this.connecting && this.connectionStart) {
            this.drawTempConnection(this.connectionStart, this.mouse);
        }
        
        // Draw nodes
        this.nodes.forEach(node => this.drawNode(node));
    }

    drawGrid() {
        const gridSize = 20;
        this.ctx.strokeStyle = '#e5e7eb';
        this.ctx.lineWidth = 1;
        
        for (let x = 0; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    drawNode(node) {
        const isSelected = this.selectedNode && this.selectedNode.id === node.id;
        
        // Draw node background
        this.ctx.fillStyle = node.color;
        this.ctx.strokeStyle = isSelected ? '#1f2937' : ColorUtils.darken(node.color, 0.2);
        this.ctx.lineWidth = isSelected ? 3 : 2;
        
        this.roundRect(node.x, node.y, node.width, node.height, 8);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Draw node text
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Node title
        this.ctx.fillText(
            node.name.length > 20 ? node.name.substring(0, 20) + '...' : node.name,
            node.x + node.width / 2,
            node.y + node.height / 2 - 10
        );
        
        // Node description
        this.ctx.font = '11px Arial';
        this.ctx.fillStyle = '#e5e7eb';
        this.ctx.fillText(
            node.description.length > 25 ? node.description.substring(0, 25) + '...' : node.description,
            node.x + node.width / 2,
            node.y + node.height / 2 + 8
        );
        
        // Draw connection points
        this.drawConnectionPoints(node);
    }

    drawConnectionPoints(node) {
        const pointSize = 6;
        const points = [
            { x: node.x, y: node.y + node.height / 2 }, // left
            { x: node.x + node.width, y: node.y + node.height / 2 }, // right
            { x: node.x + node.width / 2, y: node.y }, // top
            { x: node.x + node.width / 2, y: node.y + node.height } // bottom
        ];
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.strokeStyle = '#374151';
        this.ctx.lineWidth = 2;
        
        points.forEach(point => {
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, pointSize, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.stroke();
        });
    }

    drawConnection(connection) {
        const from = connection.from;
        const to = connection.to;
        
        // Calculate connection points
        const fromPoint = {
            x: from.x + from.width,
            y: from.y + from.height / 2
        };
        const toPoint = {
            x: to.x,
            y: to.y + to.height / 2
        };
        
        // Draw curved connection
        this.ctx.strokeStyle = '#6b7280';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        const cp1x = fromPoint.x + 50;
        const cp1y = fromPoint.y;
        const cp2x = toPoint.x - 50;
        const cp2y = toPoint.y;
        
        this.ctx.moveTo(fromPoint.x, fromPoint.y);
        this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, toPoint.x, toPoint.y);
        this.ctx.stroke();
        
        // Draw arrow
        this.drawArrow(toPoint.x, toPoint.y, Math.atan2(toPoint.y - cp2y, toPoint.x - cp2x));
    }

    drawTempConnection(from, to) {
        const fromPoint = {
            x: from.x + from.width / 2,
            y: from.y + from.height / 2
        };
        
        this.ctx.strokeStyle = '#3b82f6';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        
        this.ctx.beginPath();
        this.ctx.moveTo(fromPoint.x, fromPoint.y);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.stroke();
        
        this.ctx.setLineDash([]);
    }

    drawArrow(x, y, angle) {
        const arrowLength = 10;
        const arrowWidth = 6;
        
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(angle);
        
        this.ctx.fillStyle = '#6b7280';
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(-arrowLength, -arrowWidth);
        this.ctx.lineTo(-arrowLength, arrowWidth);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.restore();
    }

    roundRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }

    updateStats() {
        StatsUpdater.updateFlowStats();
    }

    clear() {
        this.nodes = [];
        this.connections = [];
        this.selectedNode = null;
        this.draw();
        this.updateStats();
    }

    exportData() {
        return {
            nodes: this.nodes,
            connections: this.connections
        };
    }

    importData(data) {
        if (data.nodes) this.nodes = data.nodes;
        if (data.connections) this.connections = data.connections;
        this.draw();
        this.updateStats();
    }
}

// Initialize flow builder when needed
let flowBuilder = null;

function initializeFlowBuilder() {
    if (!flowBuilder) {
        flowBuilder = new FlowBuilder('flowCanvas');
        window.flowBuilder = flowBuilder;
    }
}

// Flow builder specific functions
function addBotToFlow(botId) {
    if (!flowBuilder) initializeFlowBuilder();
    flowBuilder.addBot(botId);
    Toast.success('Bot added to flow');
}

function saveFlow() {
    if (!flowBuilder) {
        Toast.error('No flow to save');
        return;
    }
    
    const flowName = document.getElementById('flow-name').value || 'Untitled Flow';
    const flowData = {
        name: flowName,
        ...flowBuilder.exportData()
    };
    
    storage.addFlow(flowData);
    Toast.success(`Flow "${flowName}" saved successfully`);
}

function runFlow() {
    if (!flowBuilder || flowBuilder.nodes.length === 0) {
        Toast.error('No flow to run');
        return;
    }
    
    Toast.success('Flow execution started');
    
    // Simulate flow execution
    setTimeout(() => {
        Toast.success('Flow execution completed');
    }, 2000);
}

function exportFlow() {
    if (!flowBuilder) {
        Toast.error('No flow to export');
        return;
    }
    
    const flowData = flowBuilder.exportData();
    const blob = new Blob([JSON.stringify(flowData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flow-export.json';
    a.click();
    URL.revokeObjectURL(url);
    
    Toast.success('Flow exported successfully');
}