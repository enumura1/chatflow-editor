// src/components/chatbot-editor/ChatPreview.tsx
import React from 'react';
import { ChatNode } from '../../types/chatbot';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
        <CardHeader className="py-3 px-4 border-b shrink-0">
          <CardTitle className="text-base">Chat Preview</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          {/* メッセージ部分 */}
          <div className="flex-none p-4">
            <div className="flex flex-col gap-4">
              <div className="bg-primary/10 p-4 rounded-lg max-w-[80%] self-start">
                {currentNode.title}
              </div>
            </div>
          </div>
          
          {/* 選択肢部分 - スクロール可能 */}
          <div className="border-t bg-muted/20 flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-2">
                {currentNode.options.map((opt, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className="w-full justify-start font-normal text-left h-auto py-3"
                    onClick={() => onOptionClick(opt.nextId)}
                  >
                    {opt.label}
                  </Button>
                ))}
                
                {currentNode.options.length === 0 && (
                  <div className="text-muted-foreground text-sm p-2 text-center">
                    このノードには選択肢がありません
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatPreview;
