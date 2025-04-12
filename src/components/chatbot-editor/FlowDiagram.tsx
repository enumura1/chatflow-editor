import React from 'react';
import { ChatbotFlow, NodePositions } from '../../types/chatbot';

interface FlowDiagramProps {
  flow: ChatbotFlow;
  nodePositions: NodePositions;
  currentNodeId: number;
  onNodeSelect: (nodeId: number) => void;
}

const FlowDiagram: React.FC<FlowDiagramProps> = ({
  flow,
  nodePositions,
  currentNodeId,
  onNodeSelect
}) => {
  return (
    <div className="relative h-96 bg-gray-50 rounded-lg p-4 overflow-auto">
      {/* ノードを表示 */}
      {flow.map((node) => (
        <div 
          key={node.id}
          className={`absolute px-4 py-2 rounded-lg shadow cursor-pointer transition-all
            ${currentNodeId === node.id ? 'bg-blue-100 border-2 border-blue-500' : 'bg-white border border-gray-200'}`}
          style={{ 
            left: `${nodePositions[node.id]?.x}px`, 
            top: `${nodePositions[node.id]?.y}px`,
            minWidth: '120px'
          }}
          onClick={() => onNodeSelect(node.id)}
        >
          <div className="text-sm font-medium">ノード {node.id}</div>
          <div className="text-xs truncate max-w-40">{node.title}</div>
        </div>
      ))}
      
      {/* 接続線と矢印を描画 */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {flow.map((node) => 
          node.options.map((option) => {
            if (nodePositions[node.id] && nodePositions[option.nextId]) {
              const startX = nodePositions[node.id].x + 60;
              const startY = nodePositions[node.id].y + 30;
              const endX = nodePositions[option.nextId].x + 60;
              const endY = nodePositions[option.nextId].y;
              
              // Calculate control point for curve
              const controlX = (startX + endX) / 2;
              const controlY = startY + (endY - startY) / 3;
              
              // Arrow path definition
              const path = `M ${startX} ${startY} Q ${controlX} ${controlY}, ${endX} ${endY}`;
              
              // Calculate arrow head position
              const dx = endX - controlX;
              const dy = endY - controlY;
              const angle = Math.atan2(dy, dx);
              const arrowLength = 10;
              
              const arrowX1 = endX - arrowLength * Math.cos(angle - Math.PI/6);
              const arrowY1 = endY - arrowLength * Math.sin(angle - Math.PI/6);
              const arrowX2 = endX - arrowLength * Math.cos(angle + Math.PI/6);
              const arrowY2 = endY - arrowLength * Math.sin(angle + Math.PI/6);
              
              return (
                <g key={`${node.id}-${option.nextId}`}>
                  <path 
                    d={path} 
                    fill="none" 
                    stroke="#888" 
                    strokeWidth="2"
                  />
                  <polygon 
                    points={`${endX},${endY} ${arrowX1},${arrowY1} ${arrowX2},${arrowY2}`}
                    fill="#888"
                  />
                  <text 
                    x={controlX} 
                    y={controlY - 5} 
                    className="text-xs fill-gray-600"
                  >
                    {option.label.length > 15 ? `${option.label.slice(0, 15)}...` : option.label}
                  </text>
                </g>
              );
            }
            return null;
          })
        )}
      </svg>
    </div>
  );
};

export default FlowDiagram;
