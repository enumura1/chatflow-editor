import React from 'react';
import { ChatbotFlow, ChatNode, NodePositions } from '../../types/chatbot';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FlowDiagramProps {
  flow: ChatbotFlow;
  nodePositions: NodePositions;
  currentNodeId: number;
  onNodeSelect: (nodeId: number) => void;
}

// 階層構造のノードを表すインターフェース
interface TreeNode {
  node: ChatNode;
  depth: number;
  index: number;
  children: TreeNode[];
}

const FlowDiagram: React.FC<FlowDiagramProps> = ({
  flow,
  currentNodeId,
  onNodeSelect
}) => {
  // 階層構造を構築する関数
  const buildHierarchy = (): TreeNode | null => {
    const rootNode = flow.find(node => node.id === 1);
    if (!rootNode) return null;
    
    // ノードIDからノードを取得するマップを作成
    const nodeMap = flow.reduce<Record<number, ChatNode>>((map, node) => {
      map[node.id] = node;
      return map;
    }, {});
    
    // 訪問済みノードを追跡して循環参照を防ぐ
    const visited = new Set<number>();
    
    // 階層構造を再帰的に構築する関数
    const buildNodeTree = (nodeId: number, depth: number, index: number): TreeNode | null => {
      // 循環参照チェック
      if (visited.has(nodeId)) return null;
      visited.add(nodeId);
      
      const node = nodeMap[nodeId];
      if (!node) return null;
      
      // このノードの直接の子ノードを見つける
      const childNodes = flow.filter(n => n.parentId === node.id);
      
      // 子ノードと選択肢から次のノードを構築
      const children: TreeNode[] = [];
      
      // まず直接の子ノードを追加
      childNodes.forEach((childNode, idx) => {
        const childTree = buildNodeTree(childNode.id, depth + 1, idx);
        if (childTree) {
          children.push(childTree);
        }
      });
      
      // 次に選択肢から行き先のノードを追加（まだ子として追加されていない場合のみ）
      node.options.forEach((option, idx) => {
        // すでに子として追加されていないか確認
        if (!childNodes.some(child => child.id === option.nextId) && 
            !children.some(child => child.node.id === option.nextId)) {
          const optionTree = buildNodeTree(option.nextId, depth + 1, idx);
          if (optionTree) {
            children.push(optionTree);
          }
        }
      });
      
      return {
        node,
        depth,
        index,
        children
      };
    };
    
    return buildNodeTree(rootNode.id, 0, 0);
  };
  
  // 階層構造からノードを再帰的にレンダリングする関数
  const renderNode = (item: TreeNode): React.ReactElement => {
    const { node, depth, children } = item;
    
    // 階層的な名前を表示
    const displayName = node.hierarchyPath ? 
      `ノード ${node.hierarchyPath}` : 
      `ノード ${node.id}`;
    
    return (
      // mb-6をmb-10に変更して縦の余白を増やす
      <div key={node.id} className="flex flex-col mb-10"> 
        <div className="flex items-start">
          {/* インデントと接続線 - 高さも調整 */}
          {depth > 0 && (
            <>
              {Array(depth).fill(0).map((_, i) => (
                // h-8をh-12に変更して線の長さを伸ばす
                <div key={i} className={`w-8 ${i < depth - 1 ? 'border-l-2 border-gray-400' : ''}`}></div>
              ))}
              {/* h-8をh-12に変更し、位置も調整 */}
              <div className="w-8 h-12 border-b-4 border-l-4 border-gray-400 mr-2"></div>
            </>
          )}
          
          {/* ノード - パディングも少し増やす */}
          <div 
            className={`px-5 py-3 rounded-lg shadow cursor-pointer
              ${currentNodeId === node.id ? 'bg-blue-100 border-2 border-blue-500' : 'bg-white border border-gray-200'}`}
            style={{ minWidth: '180px' }}
            onClick={() => onNodeSelect(node.id)}
          >
            <div className="text-sm font-medium">{displayName}</div>
            <div className="text-xs truncate max-w-40">{node.title}</div>
            {node.options.length > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                {node.options.map((option, optIdx) => {
                  const nextNode = flow.find(n => n.id === option.nextId);
                  const nextNodeName = nextNode?.hierarchyPath ? 
                    `ノード ${nextNode.hierarchyPath}` : 
                    `ノード ${option.nextId}`;
                  
                  return (
                    <div key={optIdx} className="truncate">
                      {option.label} → {nextNodeName}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        
        {children.length > 0 && (
          // mt-2をmt-4に変更して子ノードとの間隔も広げる
          <div className="flex flex-col ml-8 mt-4"> 
            {children.map(child => renderNode(child))}
          </div>
        )}
      </div>
    );
  };
  
  const hierarchy = buildHierarchy();
  
  return (
    <ScrollArea className="h-full w-full">
      <div className="p-4">
        {hierarchy && renderNode(hierarchy)}
      </div>
    </ScrollArea>
  );
};

export default FlowDiagram;
