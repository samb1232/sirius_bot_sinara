import { Node, Edge as ReactFlowEdge } from 'reactflow';

export type Edge = ReactFlowEdge;

export interface Attachment {
  id: string;
  name: string;
  type: 'file' | 'image';
  data: string;
}

export interface ChecklistItem {
  text: string;
  required?: boolean;
}

export interface NodeData {
  label: string;
  type: 'start' | 'question' | 'answer' | 'checklist';
  content: string;
  checklistItems?: { text: string }[];
  attachments?: Attachment[];
}

export type ChatBotNode = Node<NodeData>;

export interface ChatBotData {
  nodes: ChatBotNode[];
  edges: Edge[];
} 