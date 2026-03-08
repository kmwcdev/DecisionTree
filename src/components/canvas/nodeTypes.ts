import { DecisionNode } from './nodes/DecisionNode';
import { ActionNode } from './nodes/ActionNode';
import { InfoNode } from './nodes/InfoNode';
import type { NodeTypes } from 'reactflow';

export const nodeTypes: NodeTypes = {
  decision: DecisionNode,
  action: ActionNode,
  info: InfoNode,
};
