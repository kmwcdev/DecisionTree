import { useTreeStore } from '../../store/useTreeStore';
import type { NodeType } from '../../types';

const typeStyles: Record<NodeType, { border: string; badge: string; badgeText: string; icon: string }> = {
  decision: {
    border: 'border-amber-400',
    badge: 'bg-amber-100 text-amber-800',
    badgeText: 'Decision',
    icon: '◇',
  },
  action: {
    border: 'border-blue-400',
    badge: 'bg-blue-100 text-blue-800',
    badgeText: 'Action',
    icon: '▢',
  },
  info: {
    border: 'border-gray-300',
    badge: 'bg-gray-100 text-gray-700',
    badgeText: 'Info',
    icon: 'ℹ',
  },
};

const nextButtonStyles: Record<NodeType, string> = {
  decision: 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 hover:border-amber-400',
  action: 'border-blue-300 bg-blue-50 text-blue-900 hover:bg-blue-100 hover:border-blue-400',
  info: 'border-gray-300 bg-white text-gray-800 hover:bg-gray-50 hover:border-gray-400',
};

interface Props {
  nodeId: string;
}

export function NodeCard({ nodeId }: Props) {
  const { nodes, edges, guideStep, guideBack, restartGuide, wizardHistory } = useTreeStore();

  const node = nodes.find((n) => n.id === nodeId);
  if (!node) return null;

  const { label, description, nodeType } = node.data;
  const style = typeStyles[nodeType];

  // Outgoing edges from this node
  const outgoing = edges.filter((e) => e.source === nodeId);
  const isDone = outgoing.length === 0;

  return (
    <div className="w-full max-w-xl flex flex-col gap-6">
      {/* Card */}
      <div className={`bg-white rounded-2xl border-2 ${style.border} shadow-sm p-8`}>
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>
            {style.icon} {style.badgeText}
          </span>
        </div>

        <h2 className="text-xl font-bold text-gray-900 leading-snug mb-3">
          {label}
        </h2>

        {description && (
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {description}
          </p>
        )}
      </div>

      {/* Next steps */}
      {!isDone && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-1">
            {outgoing.length === 1 ? 'Next step' : 'Choose a path'}
          </p>
          {outgoing.map((edge) => {
            const target = nodes.find((n) => n.id === edge.target);
            if (!target) return null;
            const edgeLabel = typeof edge.label === 'string' && edge.label
              ? edge.label
              : target.data.label;
            const btnStyle = nextButtonStyles[target.data.nodeType];
            return (
              <button
                key={edge.id}
                onClick={() => guideStep(edge.target, typeof edge.label === 'string' ? edge.label : undefined)}
                className={`w-full rounded-xl border-2 px-5 py-3.5 text-left font-medium text-sm transition-colors ${btnStyle}`}
              >
                <span className="block">{edgeLabel}</span>
                {typeof edge.label === 'string' && edge.label && (
                  <span className="block text-xs font-normal opacity-60 mt-0.5">
                    {target.data.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Done state */}
      {isDone && (
        <div className="rounded-xl border-2 border-green-300 bg-green-50 px-5 py-4 text-center">
          <p className="text-sm font-semibold text-green-800">End of this path</p>
          <p className="text-xs text-green-600 mt-0.5">You've reached the last step.</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3 justify-between pt-2">
        <button
          onClick={guideBack}
          disabled={wizardHistory.length === 0}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={restartGuide}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          ↺ Restart
        </button>
      </div>
    </div>
  );
}
