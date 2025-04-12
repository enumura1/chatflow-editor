import React, { useState, useEffect } from 'react';
import Dialog from './Dialog';
import { ChatbotFlow } from '../../../types/chatbot';

interface EditOptionDialogProps {
  open: boolean;
  onClose: () => void;
  flow: ChatbotFlow;
  initialLabel?: string;
  initialNextId?: string;
  isEditing: boolean;
  onSaveOption: (label: string, nextId: number) => void;
}

const EditOptionDialog: React.FC<EditOptionDialogProps> = ({ 
  open, 
  onClose, 
  flow,
  initialLabel = '',
  initialNextId = '',
  isEditing,
  onSaveOption 
}) => {
  const [optionLabel, setOptionLabel] = useState(initialLabel);
  const [nextNodeId, setNextNodeId] = useState(initialNextId);
  const [error, setError] = useState<string | null>(null);
  
  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setOptionLabel(initialLabel);
      setNextNodeId(initialNextId);
      setError(null);
    }
  }, [open, initialLabel, initialNextId]);
  
  const validateAndSubmit = () => {
    // Validate inputs
    if (!optionLabel.trim()) {
      setError('選択肢のラベルを入力してください');
      return;
    }
    
    if (!nextNodeId) {
      setError('次のノードIDを入力してください');
      return;
    }
    
    const targetNodeId = parseInt(nextNodeId);
    
    // Check if target node exists
    if (!flow.some(node => node.id === targetNodeId)) {
      setError('指定されたノードIDが存在しません');
      return;
    }
    
    // All validations passed
    onSaveOption(optionLabel, targetNodeId);
    setError(null);
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      title={isEditing ? "選択肢を編集" : "選択肢を追加"}
      footer={
        <>
          <button 
            className="px-3 py-1 border rounded-md"
            onClick={onClose}
          >
            キャンセル
          </button>
          <button 
            className="px-3 py-1 bg-blue-600 text-white rounded-md"
            onClick={validateAndSubmit}
          >
            保存
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-2 rounded text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label className="text-sm font-medium">選択肢ラベル</label>
          <input
            className="w-full px-3 py-2 border rounded-md"
            value={optionLabel}
            onChange={(e) => setOptionLabel(e.target.value)}
            placeholder="選択肢のテキストを入力"
            autoFocus
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">次のノードID</label>
          <div className="flex space-x-2">
            <input
              className="w-full px-3 py-2 border rounded-md"
              type="number"
              value={nextNodeId}
              onChange={(e) => setNextNodeId(e.target.value)}
              placeholder="次に表示するノードのIDを入力"
            />
          </div>
          <div className="text-sm text-gray-500">
            使用可能なID: {flow.map(n => n.id).join(', ')}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default EditOptionDialog;
