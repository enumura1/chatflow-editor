import React, { useState } from 'react';
import FlowDiagram from './FlowDiagram';
import NodeEditor from './NodeEditor';
import ChatPreview from './ChatPreview';
import AddNodeDialog from './dialogs/AddNodeDialog';
import EditOptionDialog from './dialogs/EditOptionDialog';
import ImportDialog from './dialogs/ImportDialog';
import { generateNodePositions, generateNewId, exportFlowToFile } from './utils';
import { ChatbotFlow, ChatNode } from '../../types/chatbot';

// 初期フローデータ
const initialFlow: ChatbotFlow = [
  {
    id: 1,
    title: "hello chatbot!!",
    options: [
      { label: "node1 label", nextId: 2 },
      { label: "node2 label", nextId: 3 },
      { label: "node3 label", nextId: 4 }
    ]
  },
  {
    id: 2,
    title: "node2 title",
    options: []
  },
  {
    id: 3,
    title: "node3 title",
    options: []
  },
  {
    id: 4,
    title: "node4 title",
    options: []
  }
];

const ChatbotEditor: React.FC = () => {
  // State
  const [flow, setFlow] = useState<ChatbotFlow>(initialFlow);
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
    const newNode: ChatNode = {
      id: generateNewId(flow),
      title: title,
      options: []
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
    <div className="flex h-screen w-full">
      {/* 左側: ワークフロー図 (70%) */}
      <div className="w-7/10 border-r p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">ワークフロー構成</h2>
          <div className="flex space-x-2">
            <button 
              className="px-3 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md text-sm" 
              onClick={() => setIsAddNodeOpen(true)}
            >
              ノード追加
            </button>
            <button 
              className="px-3 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md text-sm" 
              onClick={handleExport}
            >
              エクスポート
            </button>
            <button 
              className="px-3 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md text-sm" 
              onClick={() => setIsImportOpen(true)}
            >
              インポート
            </button>
          </div>
        </div>
        
        <FlowDiagram 
          flow={flow}
          nodePositions={nodePositions}
          currentNodeId={currentNodeId}
          onNodeSelect={handleNodeSelect}
        />
        
        <NodeEditor 
          node={currentNode}
          onUpdateNode={handleUpdateNode}
          onAddOption={handleOpenAddOption}
          onEditOption={handleEditOption}
          onRemoveOption={handleRemoveOption}
        />
      </div>
      
      {/* 右側: チャットプレビュー (30%) */}
      <div className="w-3/10 p-4">
        <h2 className="text-lg font-bold mb-4">チャットプレビュー</h2>
        <ChatPreview 
          currentNode={currentNode}
          onOptionClick={handleOptionClick}
        />
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
