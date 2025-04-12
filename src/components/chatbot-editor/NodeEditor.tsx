import React, { useState } from 'react';
import { ChatNode, ChatOption } from '../../types/chatbot';

interface NodeEditorProps {
  node: ChatNode;
  onUpdateNode: (title: string) => void;
  onAddOption: () => void;
  onEditOption: (index: number) => void;
  onRemoveOption: (index: number) => void;
}

const NodeEditor: React.FC<NodeEditorProps> = ({
  node,
  onUpdateNode,
  onAddOption,
  onEditOption,
  onRemoveOption
}) => {
  const [title, setTitle] = useState(node.title);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  
  const handleSave = () => {
    onUpdateNode(title);
  };
  
  return (
    <div className="mt-4 p-4 border rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">ノード {node.id} 編集</h3>
        <button 
          className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm"
          onClick={handleSave}
        >
          保存
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">タイトル</label>
          <input
            className="w-full px-3 py-2 border rounded-md"
            value={title}
            onChange={handleTitleChange}
            placeholder="ノードのタイトルを入力"
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">選択肢</label>
            <button 
              className="px-2 py-1 bg-blue-50 text-blue-800 rounded text-sm"
              onClick={onAddOption}
            >
              選択肢追加
            </button>
          </div>
          
          <div className="space-y-2">
            {node.options.map((opt: ChatOption, idx: number) => (
              <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <div className="text-sm">
                  <span className="font-medium">{opt.label}</span>
                  <span className="text-gray-500 text-xs ml-2">→ ノード {opt.nextId}</span>
                </div>
                <div className="flex space-x-1">
                  <button 
                    className="text-sm text-blue-600"
                    onClick={() => onEditOption(idx)}
                  >
                    編集
                  </button>
                  <button 
                    className="text-sm text-red-600 ml-2"
                    onClick={() => onRemoveOption(idx)}
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
            
            {node.options.length === 0 && (
              <div className="text-gray-500 text-sm p-2">
                選択肢がありません。「選択肢追加」ボタンから追加できます。
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeEditor;
