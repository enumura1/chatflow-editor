// src/components/chatbot-editor/NodeEditor.tsx
import React, { useState, useEffect } from 'react';
import { ChatNode, ChatOption } from '../../types/chatbot';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  
  // nodeが変更されたらtitleも更新
  useEffect(() => {
    setTitle(node.title);
  }, [node.id, node.title]);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  
  const handleSave = () => {
    onUpdateNode(title);
  };
  
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="py-3 px-4 border-b flex-row justify-between items-center shrink-0">
        <CardTitle className="text-base">ノード {node.id} 編集</CardTitle>
        <Button 
          onClick={handleSave}
          size="sm"
          variant="outline"
          className="bg-green-100 text-green-800 hover:bg-green-200 border-green-300"
        >
          保存
        </Button>
      </CardHeader>
      
      <CardContent className="p-4 flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="shrink-0">
          <label className="block text-sm font-medium mb-2" htmlFor="node-title">
            タイトル
          </label>
          <Input
            id="node-title"
            value={title}
            onChange={handleTitleChange}
            placeholder="ノードのタイトルを入力"
            className="w-full"
          />
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <div className="flex justify-between items-center mb-3 shrink-0">
            <label className="block text-sm font-medium">選択肢</label>
            <Button 
              onClick={onAddOption}
              size="sm"
              variant="outline"
              className="bg-blue-50 text-blue-800 hover:bg-blue-100 border-blue-200"
            >
              選択肢追加
            </Button>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full w-full">
              <div className="space-y-2 pr-3">
                {node.options.map((opt: ChatOption, idx: number) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-100">
                    <div className="text-sm truncate mr-2 flex-1">
                      <span className="font-medium">{opt.label}</span>
                      <span className="text-gray-500 text-xs ml-2">→ ノード {opt.nextId}</span>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button 
                        size="sm"
                        variant="ghost"
                        className="text-blue-600 h-8 px-2 py-1"
                        onClick={() => onEditOption(idx)}
                      >
                        編集
                      </Button>
                      <Button 
                        size="sm"
                        variant="ghost"
                        className="text-red-600 h-8 px-2 py-1"
                        onClick={() => onRemoveOption(idx)}
                      >
                        削除
                      </Button>
                    </div>
                  </div>
                ))}
                
                {node.options.length === 0 && (
                  <div className="text-gray-500 text-sm p-4 text-center bg-gray-50 rounded-md">
                    選択肢がありません。「選択肢追加」ボタンから追加できます。
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NodeEditor;
