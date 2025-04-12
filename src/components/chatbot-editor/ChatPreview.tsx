import React from 'react';
import { ChatNode } from '../../types/chatbot';

interface ChatPreviewProps {
  currentNode: ChatNode;
  onOptionClick: (nextId: number) => void;
}

const ChatPreview: React.FC<ChatPreviewProps> = ({ currentNode, onOptionClick }) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <div className="bg-blue-100 p-3 rounded-lg mb-4">
          {currentNode.title}
        </div>
        
        <div className="space-y-2">
          {currentNode.options.map((opt, idx) => (
            <button
              key={idx}
              className="w-full py-2 px-4 border rounded-md text-left hover:bg-gray-50 transition-colors"
              onClick={() => onOptionClick(opt.nextId)}
            >
              {opt.label} →
            </button>
          ))}
          
          {currentNode.options.length === 0 && (
            <div className="text-gray-500 text-sm p-2 text-center">
              このノードには選択肢がありません
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPreview;
