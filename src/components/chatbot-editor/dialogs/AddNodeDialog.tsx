import React, { useState, useEffect } from 'react';
import Dialog from './Dialog';

interface AddNodeDialogProps {
  open: boolean;
  onClose: () => void;
  initialTitle?: string;
  onAddNode: (title: string) => void;
}

const AddNodeDialog: React.FC<AddNodeDialogProps> = ({ 
  open, 
  onClose, 
  initialTitle = '',
  onAddNode 
}) => {
  const [nodeTitle, setNodeTitle] = useState(initialTitle);
  
  // Reset title when dialog opens
  useEffect(() => {
    if (open) {
      setNodeTitle(initialTitle);
    }
  }, [open, initialTitle]);
  
  const handleSubmit = () => {
    if (nodeTitle.trim()) {
      onAddNode(nodeTitle);
      setNodeTitle('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      title="新しいノードを追加"
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
            onClick={handleSubmit}
          >
            追加
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">表示する文言</label>
          <input
            className="w-full px-3 py-2 border rounded-md"
            value={nodeTitle}
            onChange={(e) => setNodeTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="チャットに表示する文言を入力"
            autoFocus
          />
        </div>
      </div>
    </Dialog>
  );
};

export default AddNodeDialog;
