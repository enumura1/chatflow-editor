import { useState, useEffect, useRef } from 'react';
import { ChatNode } from '../../types/chatbot';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Message {
  type: 'bot' | 'user';
  content: string;
  nodeId?: number;
  showOptions?: boolean;
}

interface ChatPreviewProps {
  currentNode: ChatNode;
  flow: ChatNode[];
  onOptionClick: (nextId: number) => void;
}

const ChatPreview: React.FC<ChatPreviewProps> = ({ 
  currentNode, 
  flow,
  onOptionClick 
}) => {
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Build chat history
  useEffect(() => {
    const buildChatPath = (nodeId: number, path: number[] = []): number[] => {
      if (nodeId === 1) {
        return [1, ...path];
      }
      
      const node = flow.find(n => n.id === nodeId);
      if (!node || !node.parentId) {
        return [nodeId, ...path];
      }
      
      const parentNode = flow.find(n => n.id === node.parentId);
      if (!parentNode) {
        return [nodeId, ...path];
      }
      
      return buildChatPath(parentNode.id, [nodeId, ...path]);
    };
    
    const path = buildChatPath(currentNode.id);
    const history: Message[] = [];
    
    for (let i = 0; i < path.length; i++) {
      const nodeId = path[i];
      const node = flow.find(n => n.id === nodeId);
      
      if (node) {
        // Add bot message
        // Only show options for current node
        history.push({
          type: 'bot',
          content: node.title,
          nodeId: node.id,
          showOptions: node.id === currentNode.id
        });
        
        // Add user selection if there's a next node
        if (i < path.length - 1) {
          const nextNodeId = path[i + 1];
          const selectedOption = node.options.find(opt => opt.nextId === nextNodeId);
          
          if (selectedOption) {
            history.push({
              type: 'user',
              content: selectedOption.label
            });
          }
        }
      }
    }
    
    setChatHistory(history);
    
    // Auto-scroll
    setTimeout(() => {
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
      }
    }, 100);
  }, [currentNode.id, flow]);
  
  // Option click handler - updates chat history
  const handleOptionClick = (nextId: number) => {
    onOptionClick(nextId);
    
    // Set showOptions to false for current node after selection
    setChatHistory(prev => 
      prev.map(msg => 
        msg.nodeId === currentNode.id ? { ...msg, showOptions: false } : msg
      )
    );
  };
  
  return (
    <div className="flex flex-col h-full">
      <Card className="h-full flex flex-col overflow-hidden">
        <CardHeader className="py-3 px-4 border-b shrink-0">
          <CardTitle className="text-base">Chat Preview</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          {/* Message area - scrollable */}
          <div className="flex-1 overflow-auto" ref={scrollAreaRef}>
            <div className="p-4 space-y-4">
              {chatHistory.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.type === 'bot' && (
                    <div className="flex items-start max-w-[80%]">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-2 text-xs">
                        Bot
                      </div>
                      <div className={`bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg text-gray-800 dark:text-gray-100 ${message.nodeId === currentNode.id ? 'ring-2 ring-blue-300 dark:ring-blue-700' : ''}`}>
                        <div>{message.content}</div>
                        
                        {/* Show options if available */}
                        {message.showOptions && currentNode.options.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-blue-200 dark:border-blue-800">
                            {currentNode.options.map((opt, idx) => (
                              <Button
                                key={idx}
                                variant="outline"
                                className="w-full justify-start font-normal text-left h-auto py-2 mb-2 bg-white hover:bg-gray-100 text-gray-800 border-gray-200"
                                onClick={() => handleOptionClick(opt.nextId)}
                              >
                                {opt.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {message.type === 'user' && (
                    <div className="flex items-start max-w-[80%] flex-row-reverse">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center ml-2 text-xs">
                        User
                      </div>
                      <div className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-lg">
                        {message.content}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* No options footer */}
          {currentNode.options.length === 0 && (
            <div className="border-t bg-muted/20 shrink-0 text-base text-muted-foreground text-center py-1">
              No options available for this node
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatPreview;