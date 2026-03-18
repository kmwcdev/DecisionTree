import type { Node, Edge } from 'reactflow';

export type AppMode = 'view' | 'editor' | 'guide' | 'trees' | 'options';

export interface TreeEntry {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  modifiedAt: string;
  nodeCount: number;
  binId: string;
}

export interface WizardStep {
  nodeId: string;
  choiceLabel?: string; // edge label used to reach the NEXT node
}
export type NodeType = 'decision' | 'action' | 'info';

export interface LaborNodeData {
  label: string;
  description?: string;
  nodeType: NodeType;
}

export interface LaborEdgeData {
  label?: string;
  bendX?: number;
  bendY?: number;
}

export type LaborNode = Node<LaborNodeData>;
export type LaborEdge = Edge<LaborEdgeData>;

export interface TreeSchema {
  version: number;
  nodes: LaborNode[];
  edges: LaborEdge[];
}

export interface EditorSelection {
  type: 'node' | 'edge' | 'none';
  id: string | null;
}
