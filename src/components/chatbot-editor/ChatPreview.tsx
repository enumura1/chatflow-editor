import { useState, useEffect, useRef } from 'react';
import { ChatNode } from '../../types/chatbot';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Message {
 type: 'bot' | 'user';
 content: string;
 nodeId?: number;
}

interface ChatPreviewProps {
 currentNode: ChatNode;
 flow: ChatNode[]; // フロー全体を追加
 onOptionClick: (nextId: number) => void;
}

const ChatPreview: React.FC<ChatPreviewProps> = ({ 
 currentNode, 
 flow,
 onOptionClick 
}) => {
 const [chatHistory, setChatHistory] = useState<Message[]>([]);
 const scrollAreaRef = useRef<HTMLDivElement>(null);
 
 // チャット履歴の構築
 useEffect(() => {
   // 選択されたノードまでのパスを構築
   const buildChatPath = (nodeId: number, path: number[] = []): number[] => {
     if (nodeId === 1) {
       return [1, ...path];
     }
     
     // 親ノードを見つける
     const node = flow.find(n => n.id === nodeId);
     if (!node || !node.parentId) {
       return [nodeId, ...path];
     }
     
     // 親ノードの選択肢（どの選択肢からこのノードに来たか）を見つける
     const parentNode = flow.find(n => n.id === node.parentId);
     if (!parentNode) {
       return [nodeId, ...path];
     }
     
     return buildChatPath(parentNode.id, [nodeId, ...path]);
   };
   
   // ノードまでのパスを取得
   const path = buildChatPath(currentNode.id);
   
   // パスに基づいてチャット履歴を構築
   const history: Message[] = [];
   
   for (let i = 0; i < path.length; i++) {
     const nodeId = path[i];
     const node = flow.find(n => n.id === nodeId);
     
     if (node) {
       // ボットのメッセージを追加
       history.push({
         type: 'bot',
         content: node.title,
         nodeId: node.id
       });
       
       // 次のノードがある場合、ユーザーの選択肢を追加
       if (i < path.length - 1) {
         const nextNodeId = path[i + 1];
         // どの選択肢が次のノードにつながるか見つける
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
   
   // チャット履歴が更新されたら、自動的に一番下にスクロール
   setTimeout(() => {
     if (scrollAreaRef.current) {
       scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
     }
   }, 100);
 }, [currentNode.id, flow]);
 
 return (
   <div className="flex flex-col h-full">
     <Card className="h-full flex flex-col overflow-hidden">
       <CardHeader className="py-3 px-4 border-b shrink-0">
         <CardTitle className="text-base">Chat Preview</CardTitle>
       </CardHeader>
       <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
         {/* メッセージ部分 - スクロール可能 */}
         <div className="flex-1 overflow-auto" ref={scrollAreaRef}>
           <div className="p-4 space-y-4">
             {chatHistory.map((message, index) => (
               <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                 {message.type === 'bot' && (
                   <div className="flex items-start max-w-[80%]">
                     <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-2 text-xs">
                       Bot
                     </div>
                     <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg text-gray-800 dark:text-gray-100">
                       {message.content}
                       {message.nodeId === currentNode.id && (
                         <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                           (現在のノード)
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
         
         {/* 現在の選択肢部分 */}
         <div className="border-t bg-muted/20 p-4 space-y-2 shrink-0">
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
       </CardContent>
     </Card>
   </div>
 );
};

export default ChatPreview;