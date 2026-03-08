import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { LaborNodeData } from '../../../types';

// Size + z-index only — let ReactFlow's default CSS center each handle on its tip.
// Adding explicit left/right/top/bottom overrides fights ReactFlow's translate(-50%,-50%)
// and pushes handles inside the node body where they can't be hovered.
const handleStyle = { width: 14, height: 14, zIndex: 20 };

export function DecisionNode({ data, selected }: NodeProps<LaborNodeData>) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
      {/* Diamond shape via rotated square — pointer-events-none so handles underneath are reachable */}
      <div
        className={`absolute inset-0 rounded-sm border-2 pointer-events-none ${
          selected ? 'border-amber-600 shadow-lg shadow-amber-200' : 'border-amber-400'
        } bg-amber-100`}
        style={{ transform: 'rotate(45deg)' }}
      />
      {/* Text sits on top, unrotated */}
      <div className="relative z-10 px-4 text-center pointer-events-none">
        <p className="text-xs font-semibold text-amber-900 leading-tight">{data.label}</p>
      </div>

      <Handle type="target" position={Position.Top}    style={handleStyle} className="!bg-amber-400 !border-amber-600" />
      <Handle type="source" position={Position.Bottom} style={handleStyle} className="!bg-amber-400 !border-amber-600" />
      <Handle type="source" position={Position.Left}   style={handleStyle} className="!bg-amber-400 !border-amber-600" id="left" />
      <Handle type="source" position={Position.Right}  style={handleStyle} className="!bg-amber-400 !border-amber-600" id="right" />
    </div>
  );
}
