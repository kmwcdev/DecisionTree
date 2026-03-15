import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { LaborNodeData } from '../../../types';

const handleStyle = { width: 14, height: 14, zIndex: 20 };

export function DecisionNode({ data, selected }: NodeProps<LaborNodeData>) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
      <div
        className={`absolute inset-0 rounded-sm border-2 pointer-events-none ${
          selected ? 'border-amber-600 shadow-lg shadow-amber-200 dark:shadow-amber-900' : 'border-amber-400 dark:border-amber-600'
        } bg-amber-100 dark:bg-amber-900/40`}
        style={{ transform: 'rotate(45deg)' }}
      />
      <div className="relative z-10 px-4 text-center pointer-events-none">
        <p className="text-xs font-semibold text-amber-900 dark:text-amber-200 leading-tight">{data.label}</p>
      </div>

      <Handle type="target" position={Position.Top}    style={handleStyle} className="!bg-amber-400 !border-amber-600" />
      <Handle type="source" position={Position.Bottom} style={handleStyle} className="!bg-amber-400 !border-amber-600" />
      <Handle type="source" position={Position.Left}   style={handleStyle} className="!bg-amber-400 !border-amber-600" id="left" />
      <Handle type="source" position={Position.Right}  style={handleStyle} className="!bg-amber-400 !border-amber-600" id="right" />
    </div>
  );
}
