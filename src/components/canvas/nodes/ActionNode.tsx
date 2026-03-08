import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { LaborNodeData } from '../../../types';

const handleStyle = { width: 14, height: 14 };

export function ActionNode({ data, selected }: NodeProps<LaborNodeData>) {
  return (
    <div
      className={`rounded border-2 px-4 py-3 min-w-[140px] max-w-[200px] bg-blue-50 ${
        selected ? 'border-blue-600 shadow-lg shadow-blue-200' : 'border-blue-400'
      }`}
    >
      <p className="text-xs font-semibold text-blue-900 leading-tight text-center">{data.label}</p>
      <Handle type="target" position={Position.Top} style={handleStyle} className="!bg-blue-400 !border-blue-600" />
      <Handle type="source" position={Position.Bottom} style={handleStyle} className="!bg-blue-400 !border-blue-600" />
    </div>
  );
}
