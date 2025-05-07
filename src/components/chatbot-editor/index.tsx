import React, { useState } from 'react';
import FlowDiagram from './FlowDiagram';
import NodeEditor from './NodeEditor';
import ChatPreview from './ChatPreview';
import AddNodeDialog from './dialogs/AddNodeDialog';
import EditOptionDialog from './dialogs/EditOptionDialog';
import ImportDialog from './dialogs/ImportDialog';
import { generateNodePositions, generateNewId, exportFlowToFile, updateFlowWithHierarchyPaths } from './utils';
import { ChatbotFlow, ChatNode } from '../../types/chatbot';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// 初期フローデータ
const initialFlow: ChatbotFlow = [
  {
    id: 1,
    title: "hello chatbot!!",
    options: [
      { label: "node1 label", nextId: 2 },
      { label: "node2 label", nextId: 3 },
      { label: "node3 label", nextId: 4 }
    ],
    hierarchyPath: "1"
  },
  {
    id: 2,
    title: "node2 title",
    options: [],
    parentId: 1,
    hierarchyPath: "1-1"
  },
  {
    id: 3,
    title: "node3 title",
    options: [],
    parentId: 1,
    hierarchyPath: "1-2"
  },
  {
    id: 4,
    title: "node4 title",
    options: [],
    parentId: 1,
    hierarchyPath: "1-3"
  }
];

const ChatbotEditor: React.FC = () => {
  // useStateの前に初期フローを階層パスで更新
  const hierarchicalInitialFlow = updateFlowWithHierarchyPaths(initialFlow);
  
  // State
  const [flow, setFlow] = useState<ChatbotFlow>(hierarchicalInitialFlow );
  const [currentNodeId, setCurrentNodeId] = useState<number>(1);
  const [isAddNodeOpen, setIsAddNodeOpen] = useState<boolean>(false);
  const [isAddOptionOpen, setIsAddOptionOpen] = useState<boolean>(false);
  const [isImportOpen, setIsImportOpen] = useState<boolean>(false);
  const [editingOptionIndex, setEditingOptionIndex] = useState<number | null>(null);
  
  // 現在のノードを取得
  const currentNode = flow.find((n) => n.id === currentNodeId) || flow[0];
  
  // ノードの位置を計算
  const nodePositions = generateNodePositions(flow);
  
  // ノード選択ハンドラ
  const handleNodeSelect = (nodeId: number) => {
    setCurrentNodeId(nodeId);
  };
  
  // オプションクリックハンドラ (チャットプレビュー用)
  const handleOptionClick = (nextId: number) => {
    setCurrentNodeId(nextId);
  };
  
  // ノード追加ハンドラ
  const handleAddNode = (title: string) => {
    const newId = generateNewId(flow);
    const parentNode = flow.find(node => node.id === currentNodeId);
    
    if (!parentNode) return;
    
    // 親ノードの階層パスを取得
    const parentPath = parentNode.hierarchyPath || parentNode.id.toString();
    
    // 同じ親を持つノードの数を数える
    const siblings = flow.filter(node => node.parentId === parentNode.id);
    const childIndex = siblings.length + 1;
    
    // 新しいノードの階層パスを作成
    const hierarchyPath = `${parentPath}-${childIndex}`;
    
    const newNode: ChatNode = {
      id: newId,
      title: title,
      options: [],
      parentId: parentNode.id,
      hierarchyPath: hierarchyPath
    };
    
    setFlow([...flow, newNode]);
    setCurrentNodeId(newNode.id);
    setIsAddNodeOpen(false);
  };
  
  // ノード更新ハンドラ
  const handleUpdateNode = (title: string) => {
    const updatedFlow = flow.map(node => 
      node.id === currentNodeId 
        ? { ...node, title } 
        : node
    );
    setFlow(updatedFlow);
  };
  
  // オプション追加ダイアログを開く
  const handleOpenAddOption = () => {
    setEditingOptionIndex(null);
    setIsAddOptionOpen(true);
  };
  
  // オプション編集ダイアログを開く
  const handleEditOption = (index: number) => {
    setEditingOptionIndex(index);
    setIsAddOptionOpen(true);
  };
  
  // オプション保存ハンドラ (追加&編集)
  const handleSaveOption = (label: string, nextId: number) => {
    const updatedFlow = flow.map(node => {
      if (node.id === currentNodeId) {
        let updatedOptions;
        
        if (editingOptionIndex !== null) {
          // 既存オプションを更新
          updatedOptions = node.options.map((opt, idx) => 
            idx === editingOptionIndex 
              ? { label, nextId } 
              : opt
          );
        } else {
          // 新しいオプションを追加
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
  
  // オプション削除ハンドラ
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
  
  // インポートハンドラ
  const handleImport = (importedFlow: ChatbotFlow) => {
    setFlow(importedFlow);
    setCurrentNodeId(importedFlow[0].id);
    setIsImportOpen(false);
  };
  
  // エクスポートハンドラ
  const handleExport = () => {
    exportFlowToFile(flow);
  };
  
  // 編集するオプションを取得
  const getEditingOption = () => {
    if (editingOptionIndex !== null && currentNode.options[editingOptionIndex]) {
      return currentNode.options[editingOptionIndex];
    }
    return null;
  };
  
  const editingOption = getEditingOption();
  
  return (
    <div className="flex h-screen w-full bg-background text-foreground p-4 gap-4">
      {/* 左側: ワークフロー図 (60%) */}
      <div className="w-3/5 h-full flex flex-col">
        <Card className="h-full flex flex-col overflow-hidden">
          <CardHeader className="py-2 px-4 border-b shrink-0">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">WorkFlow Editor</CardTitle>
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
                  onClick={handleExport}
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
      
      {/* 右側: チャットプレビューとノード編集 (40%) */}
      <div className="w-2/5 h-full flex flex-col gap-4">
        {/* チャットプレビュー (上半分) */}
        <div className="h-[calc(50%-8px)]">
          <ChatPreview 
            currentNode={currentNode}
            onOptionClick={handleOptionClick}
          />
        </div>
        
        {/* ノード編集 (下半分) */}
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
      
      {/* ダイアログコンポーネント */}
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
    </div>
  );
};

export default ChatbotEditor;
