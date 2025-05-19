import { useState } from 'react';
import FlowDiagram from './FlowDiagram';
import NodeEditor from './NodeEditor';
import ChatPreview from './ChatPreview';
import AddNodeDialog from './dialogs/AddNodeDialog';
import EditOptionDialog from './dialogs/EditOptionDialog';
import ImportDialog from './dialogs/ImportDialog';
import ExportDialog from './dialogs/ExportDialog';
import { generateNodePositions, generateNewId, exportFlowToFile, updateFlowWithHierarchyPaths } from './utils';
import { ChatbotFlow, ChatNode } from '../../types/chatbot';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Initial flow data - English version
const initialFlow: ChatbotFlow = [
  {
    id: 1,
    title: "Welcome to the chatflow",
    options: [
      { label: "Option 1", nextId: 2 },
      { label: "Option 2", nextId: 3 },
      { label: "Option 3", nextId: 4 }
    ],
    hierarchyPath: "1"
  },
  {
    id: 2,
    title: "Node 2 content",
    options: [],
    parentId: 1,
    hierarchyPath: "1-1"
  },
  {
    id: 3,
    title: "Node 3 content",
    options: [],
    parentId: 1,
    hierarchyPath: "1-2"
  },
  {
    id: 4,
    title: "Node 4 content",
    options: [],
    parentId: 1,
    hierarchyPath: "1-3"
  }
];

const ChatbotEditor: React.FC = () => {
  // Update initial flow with hierarchy paths
  const hierarchicalInitialFlow = updateFlowWithHierarchyPaths(initialFlow);
  
  // State
  const [flow, setFlow] = useState<ChatbotFlow>(hierarchicalInitialFlow);
  const [currentNodeId, setCurrentNodeId] = useState<number>(1);
  const [isAddNodeOpen, setIsAddNodeOpen] = useState<boolean>(false);
  const [isAddOptionOpen, setIsAddOptionOpen] = useState<boolean>(false);
  const [isImportOpen, setIsImportOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [editingOptionIndex, setEditingOptionIndex] = useState<number | null>(null);
  
  // Get current node
  const currentNode = flow.find((n) => n.id === currentNodeId) || flow[0];
  
  // Calculate node positions
  const nodePositions = generateNodePositions(flow);
  
  // Node selection handler
  const handleNodeSelect = (nodeId: number) => {
    setCurrentNodeId(nodeId);
  };
  
  // Option click handler (for chat preview)
  const handleOptionClick = (nextId: number) => {
    setCurrentNodeId(nextId);
  };
  
  // Add node handler
  const handleAddNode = (title: string) => {
    const newId = generateNewId(flow);
    const parentNode = flow.find(node => node.id === currentNodeId);
    
    if (!parentNode) return;
    
    // Get parent path
    const parentPath = parentNode.hierarchyPath || parentNode.id.toString();
    
    // Count siblings with the same parent
    const siblings = flow.filter(node => node.parentId === parentNode.id);
    const childIndex = siblings.length + 1;
    
    // Create hierarchy path
    const hierarchyPath = `${parentPath}-${childIndex}`;
    
    const newNode: ChatNode = {
      id: newId,
      title: title,
      options: [],
      parentId: parentNode.id,
      hierarchyPath: hierarchyPath
    };
  
    // Add new option to parent node
    const updatedParentNode = {
      ...parentNode,
      options: [
        ...parentNode.options,
        { label: `Option to ${title}`, nextId: newId }
      ]
    };
    
    // Update flow
    const updatedFlow = flow.map(node => 
      node.id === parentNode.id ? updatedParentNode : node
    );
    
    setFlow([...updatedFlow, newNode]);
    setCurrentNodeId(newId);
    setIsAddNodeOpen(false);
  };
  
  // Update node handler
  const handleUpdateNode = (title: string) => {
    const updatedFlow = flow.map(node => 
      node.id === currentNodeId 
        ? { ...node, title } 
        : node
    );
    setFlow(updatedFlow);
  };
  
  // Open add option dialog
  const handleOpenAddOption = () => {
    setEditingOptionIndex(null);
    setIsAddOptionOpen(true);
  };
  
  // Open edit option dialog
  const handleEditOption = (index: number) => {
    setEditingOptionIndex(index);
    setIsAddOptionOpen(true);
  };
  
  // Save option handler (add & edit)
  const handleSaveOption = (label: string, nextId: number) => {
    const updatedFlow = flow.map(node => {
      if (node.id === currentNodeId) {
        let updatedOptions;
        
        if (editingOptionIndex !== null) {
          // Update existing option
          updatedOptions = node.options.map((opt, idx) => 
            idx === editingOptionIndex 
              ? { label, nextId } 
              : opt
          );
        } else {
          updatedOptions = [
            ...node.options, 
            { label, nextId }
          ];
        }
        
        return { ...node, options: updatedOptions };
      }
      return node;
    });
    
    setFlow(updatedFlow);
    setIsAddOptionOpen(false);
    setEditingOptionIndex(null);
  };
  
  // Remove option handler
  const handleRemoveOption = (index: number) => {
    const updatedFlow = flow.map(node => {
      if (node.id === currentNodeId) {
        const newOptions = [...node.options];
        newOptions.splice(index, 1);
        return { ...node, options: newOptions };
      }
      return node;
    });
    
    setFlow(updatedFlow);
  };
  
  // Import handler
  const handleImport = (importedFlow: ChatbotFlow) => {
    setFlow(importedFlow);
    setCurrentNodeId(importedFlow[0].id);
    setIsImportOpen(false);
  };
  
  // Export button click handler
  const handleExportClick = () => {
    setIsExportOpen(true);
  };
  
  // Actual export handler
  const handleExport = () => {
    exportFlowToFile(flow);
  };
  
  // Get editing option
  const getEditingOption = () => {
    if (editingOptionIndex !== null && currentNode.options[editingOptionIndex]) {
      return currentNode.options[editingOptionIndex];
    }
    return null;
  };
  
  const editingOption = getEditingOption();
  
  return (
    <div className="flex h-screen w-full bg-background text-foreground p-4 gap-4">
      {/* Left: Workflow diagram (60%) */}
      <div className="w-3/5 h-full flex flex-col">
        <Card className="h-full flex flex-col overflow-hidden">
          <CardHeader className="py-2 px-4 border-b shrink-0">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Workflow Editor</CardTitle>
              <div className="flex space-x-2">
                <Button 
                  variant="outline"
                  className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-800 px-4 py-2 h-auto text-sm font-medium"
                  onClick={() => setIsAddNodeOpen(true)}
                >
                  Add Node
                </Button>
                <Button 
                  variant="outline"
                  className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-800 px-4 py-1 h-auto text-sm font-medium"
                  onClick={handleExportClick}
                >
                  Export
                </Button>
                <Button 
                  variant="outline"
                  className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-800 px-4 py-1 h-auto text-sm font-medium"
                  onClick={() => setIsImportOpen(true)}
                >
                  Import
                </Button>
              </div>
            </div>
          </CardHeader>
                  
          <CardContent className="p-0 flex-1 overflow-hidden">
            <FlowDiagram 
              flow={flow}
              nodePositions={nodePositions}
              currentNodeId={currentNodeId}
              onNodeSelect={handleNodeSelect}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Right: Chat preview and node editor (40%) */}
      <div className="w-2/5 h-full flex flex-col gap-4">
        {/* Chat preview (top half) */}
        <div className="h-[calc(50%-8px)]">
          <ChatPreview 
            currentNode={currentNode}
            flow={flow}
            onOptionClick={handleOptionClick}
          />
        </div>
        
        {/* Node editor (bottom half) */}
        <div className="h-[calc(50%-8px)]">
          <NodeEditor 
            node={currentNode}
            onUpdateNode={handleUpdateNode}
            onAddOption={handleOpenAddOption}
            onEditOption={handleEditOption}
            onRemoveOption={handleRemoveOption}
          />
        </div>
      </div>
      
      {/* Dialog components */}
      <AddNodeDialog 
        open={isAddNodeOpen}
        onClose={() => setIsAddNodeOpen(false)}
        onAddNode={handleAddNode}
      />
      
      <EditOptionDialog 
        open={isAddOptionOpen}
        onClose={() => {
          setIsAddOptionOpen(false);
          setEditingOptionIndex(null);
        }}
        flow={flow}
        initialLabel={editingOption?.label || ''}
        initialNextId={editingOption?.nextId.toString() || ''}
        isEditing={editingOptionIndex !== null}
        onSaveOption={handleSaveOption}
      />
      
      <ImportDialog 
        open={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={handleImport}
      />
      
      <ExportDialog 
        open={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        flow={flow}
        onExport={handleExport}
      />
    </div>
  );
};

export default ChatbotEditor;
