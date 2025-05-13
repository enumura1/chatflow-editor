// src/components/chatbot-editor/ChatPreview.tsx
import React from 'react';
import { ChatNode } from '../../types/chatbot';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ChatPreviewProps {
  currentNode: ChatNode;
  onOptionClick: (nextId: number) => void;
}

const ChatPreview: React.FC<ChatPreviewProps> = ({ 
  currentNode, 
  onOptionClick 
}) => {
  return (
    <div className="flex flex-col h-full">
      <Card className="h-full flex flex-col overflow-hidden">
        <CardHeader className="py-3 px-4 border-b shrink-0 bg-gray-50">
          <CardTitle className="text-base flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Chat Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden bg-gray-100">
          {/* スクロール可能なチャット領域 */}
          <ScrollArea className="h-full w-full">
            <div className="p-4 flex flex-col space-y-4">
              {/* ボットのメッセージ */}
              <div className="flex items-start">
                {/* アバター */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2">
                  B
                </div>
                
                {/* メッセージバブル内にタイトルと選択肢の両方を含める */}
                <div className="bg-white rounded-lg p-3 shadow-sm max-w-[85%]">
                  {/* メッセージテキスト */}
                  <div className="mb-3">
                    {currentNode.title}
                  </div>
                  
                  {/* 選択肢ボタン */}
                  {currentNode.options.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {currentNode.options.map((opt, idx) => (
                        <button
                          key={idx}
                          className="w-full text-left bg-gray-100 hover:bg-gray-200 transition-colors p-2 rounded text-sm border border-gray-200"
                          onClick={() => onOptionClick(opt.nextId)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {currentNode.options.length === 0 && (
                    <div className="text-gray-400 text-xs italic">
                      このノードには選択肢がありません
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatPreview;
