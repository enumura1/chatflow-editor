export interface ChatOption {
  label: string;
  nextId: number;
}

export interface ChatNode {
  id: number;
  title: string;
  options: ChatOption[];
}

export interface NodePosition {
  x: number;
  y: number;
}

export interface NodePositions {
  [key: number]: NodePosition;
}

export type ChatbotFlow = ChatNode[];
