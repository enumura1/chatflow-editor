import React, { useState, useRef } from 'react';
import Dialog from './Dialog';
import { parseImportedJson } from '../utils';
import { ChatbotFlow } from '../../../types/chatbot';

interface ImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (flow: ChatbotFlow) => void;
}

const ImportDialog: React.FC<ImportDialogProps> = ({ open, onClose, onImport }) => {
  const [importJson, setImportJson] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImportJson(e.target.result as string);
          setError(null);
        }
      };
      reader.onerror = () => {
        setError('ファイルの読み込みに失敗しました');
      };
      reader.readAsText(file);
    }
  };
  
  const handleImport = () => {
    const parsedFlow = parseImportedJson(importJson);
    
    if (parsedFlow) {
      onImport(parsedFlow);
      setImportJson('');
      setError(null);
    } else {
      setError('無効なJSONフォーマットです。ノードの配列が必要です。');
    }
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      title="JSONをインポート"
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
            onClick={handleImport}
            disabled={!importJson.trim()}
          >
            インポート
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
        
        <button 
          className="px-3 py-2 border rounded-md w-full text-center"
          onClick={() => fileInputRef.current?.click()}
        >
          JSONファイルを選択
        </button>
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".json"
          onChange={handleFileChange}
        />
        
        <div className="space-y-2">
          <label className="text-sm font-medium">または、JSONを直接貼り付け</label>
          <textarea
            className="w-full px-3 py-2 border rounded-md"
            value={importJson}
            onChange={(e) => {
              setImportJson(e.target.value);
              setError(null);
            }}
            placeholder='[{"id":1,"title":"例","options":[]}]'
            rows={10}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default ImportDialog;
