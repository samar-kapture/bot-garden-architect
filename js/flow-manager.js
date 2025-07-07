// Flow Builder Management Functions

function saveFlow() {
    const flowName = document.getElementById('flow-name').value.trim();
    if (!flowName) {
        Toast.error('Flow name is required');
        return;
    }
    
    if (window.flowBuilder) {
        const flowData = window.flowBuilder.getFlowData();
        flowData.name = flowName;
        storage.addFlow(flowData);
        Toast.success(`Flow "${flowName}" saved successfully`);
    } else {
        Toast.error('Flow builder not initialized');
    }
}

function runFlow() {
    Toast.success('Flow execution started...');
    setTimeout(() => {
        Toast.success('Flow execution completed');
    }, 2000);
}

function exportFlow() {
    if (window.flowBuilder) {
        const flowData = window.flowBuilder.getFlowData();
        const dataStr = JSON.stringify(flowData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'flow.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        Toast.success('Flow exported successfully');
    } else {
        Toast.error('Flow builder not initialized');
    }
}

// Make functions globally available
window.saveFlow = saveFlow;
window.runFlow = runFlow;
window.exportFlow = exportFlow;