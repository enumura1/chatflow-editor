import { ChatbotFlow, ChatNode, NodePositions } from '../../types/chatbot';

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
      
      const children = node.options
        .map((option, idx) => buildNodeTree(option.nextId, depth + 1, idx))
        .filter((child): child is TreeNode => child !== null);
      
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
    
    return (
      <div key={node.id} className="flex flex-col mb-6">
        <div className="flex items-start">
          {/* インデントと接続線 */}
          {depth > 0 && (
            <>
              {Array(depth).fill(0).map((_, i) => (
                <div key={i} className={`w-8 ${i < depth - 1 ? 'border-l-2 border-gray-400' : ''}`}></div>
              ))}
              <div className="w-8 h-8 border-b-4 border-l-4 border-gray-400 mr-2"></div>
            </>
          )}
          
          {/* ノード */}
          <div 
            className={`px-4 py-2 rounded-lg shadow cursor-pointer
              ${currentNodeId === node.id ? 'bg-blue-100 border-2 border-blue-500' : 'bg-white border border-gray-200'}`}
            style={{ minWidth: '180px' }}
            onClick={() => onNodeSelect(node.id)}
          >
            <div className="text-sm font-medium">ノード {node.id}</div>
            <div className="text-xs truncate max-w-40">{node.title}</div>
            {node.options.length > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                {node.options.map((option, optIdx) => (
                  <div key={optIdx} className="truncate">{option.label} → ノード {option.nextId}</div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {children.length > 0 && (
          <div className="flex flex-col ml-8 mt-2">
            {children.map(child => renderNode(child))}
          </div>
        )}
      </div>
    );
  };
  
  const hierarchy = buildHierarchy();
  
  return (
    <div className="bg-gray-50 rounded-lg p-4 overflow-auto h-96">
      {hierarchy && renderNode(hierarchy)}
    </div>
  );
};

export default FlowDiagram;