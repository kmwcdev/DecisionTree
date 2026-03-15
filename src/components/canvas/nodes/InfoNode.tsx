import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { LaborNodeData } from '../../../types';

const handleStyle = { width: 14, height: 14 };

export function InfoNode({ data, selected }: NodeProps<LaborNodeData>) {
  return (
    <div
      className={`rounded-xl border-2 px-4 py-3 min-w-[140px] max-w-[200px] bg-gray-100 dark:bg-gray-700 ${
        selected ? 'border-gray-500 shadow-lg shadow-gray-200 dark:shadow-gray-900' : 'border-gray-400 dark:border-gray-500'
      }`}
    >
      <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 leading-tight text-center">{data.label}</p>
      <Handle type="target" position={Position.Top} style={handleStyle} className="!bg-gray-400 !border-gray-600" />
      <Handle type="source" position={Position.Bottom} style={handleStyle} className="!bg-gray-400 !border-gray-600" />
    </div>
  );
}
