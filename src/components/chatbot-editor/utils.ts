import { ChatbotFlow, NodePositions } from "../../types/chatbot";

// Generate a new unique ID for a node
export const generateNewId = (flow: ChatbotFlow): number => {
  const ids = flow.map(node => node.id);
  return Math.max(...ids, 0) + 1;
};

// Generate positions for the workflow diagram
export const generateNodePositions = (flow: ChatbotFlow): NodePositions => {
  const positions: NodePositions = {};
  const rootNode = flow.find(n => n.id === 1);
  
  if (!rootNode) return positions;
  
  // Position root node at the top center
  positions[rootNode.id] = { x: 150, y: 40 };
  
  // Map to track visited nodes to avoid cycles
  const visited = new Set<number>();
  
  // Recursive function to position nodes
  const positionNodes = (nodeId: number, level: number, index: number, totalSiblings: number) => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    
    const node = flow.find(n => n.id === nodeId);
    if (!node) return;
    
    // Position based on level and index
    const levelY = 40 + level * 110;
    let levelX;
    
    if (level === 0) {
      levelX = 150; // Root at center
    } else {
      const width = 400;
      const step = width / (totalSiblings + 1);
      levelX = step * (index + 1);
    }
    
    positions[nodeId] = { x: levelX, y: levelY };
    
    // Position children
    if (node.options.length > 0) {
      node.options.forEach((opt, idx) => {
        positionNodes(opt.nextId, level + 1, idx, node.options.length);
      });
    }
  };
  
  // Start positioning from root
  positionNodes(rootNode.id, 0, 0, 1);
  
  return positions;
};

// Export flow to JSON file
export const exportFlowToFile = (flow: ChatbotFlow) => {
  const jsonString = JSON.stringify(flow, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'chatbot-flow.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Parse imported JSON
export const parseImportedJson = (jsonString: string): ChatbotFlow | null => {
  try {
    const parsedFlow = JSON.parse(jsonString);
    if (Array.isArray(parsedFlow) && parsedFlow.length > 0) {
      return parsedFlow;
    }
    return null;
  } catch (error) {
    console.error("Invalid JSON:", error);
    return null;
  }
};
