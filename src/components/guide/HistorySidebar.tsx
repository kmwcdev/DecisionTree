import { useTreeStore } from '../../store/useTreeStore';
import type { NodeType } from '../../types';

const dotColor: Record<NodeType, string> = {
  decision: 'bg-amber-400',
  action: 'bg-blue-400',
  info: 'bg-gray-400',
};

export function HistorySidebar() {
  const { wizardHistory, wizardCurrentId, nodes, guideBack } = useTreeStore();

  // Nothing to show until at least one step has been taken
  if (wizardHistory.length === 0) {
    return (
      <aside className="w-52 shrink-0 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Path so far</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-xs text-gray-400 text-center">Your path will appear here as you make choices.</p>
        </div>
      </aside>
    );
  }

  const currentNode = nodes.find((n) => n.id === wizardCurrentId);

  return (
    <aside className="w-52 shrink-0 border-r border-gray-200 bg-white flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-200 shrink-0">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Path so far</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <ol className="flex flex-col gap-0">
          {wizardHistory.map((step, i) => {
            const node = nodes.find((n) => n.id === step.nodeId);
            if (!node) return null;
            const dot = dotColor[node.data.nodeType];
            const isClickable = i === wizardHistory.length - 1;

            return (
              <li key={`${step.nodeId}-${i}`} className="flex flex-col">
                {/* Step row */}
                <button
                  onClick={isClickable ? guideBack : undefined}
                  className={`flex items-start gap-2.5 text-left group ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <div className="flex flex-col items-center shrink-0 mt-1">
                    <span className={`w-2 h-2 rounded-full ${dot} opacity-60`} />
                    <span className="w-px flex-1 bg-gray-200 mt-1" style={{ minHeight: 16 }} />
                  </div>
                  <div className="pb-1 min-w-0">
                    <p className={`text-xs leading-snug text-gray-500 ${isClickable ? 'group-hover:text-gray-800' : ''} line-clamp-2`}>
                      {node.data.label}
                    </p>
                    {step.choiceLabel && (
                      <p className="text-xs text-gray-400 mt-0.5 italic">→ {step.choiceLabel}</p>
                    )}
                  </div>
                </button>
              </li>
            );
          })}

          {/* Current node */}
          {currentNode && (
            <li className="flex items-start gap-2.5">
              <div className="flex flex-col items-center shrink-0 mt-1">
                <span className={`w-2.5 h-2.5 rounded-full ring-2 ring-offset-1 ring-blue-400 ${dotColor[currentNode.data.nodeType]}`} />
              </div>
              <p className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2">
                {currentNode.data.label}
              </p>
            </li>
          )}
        </ol>
      </div>
    </aside>
  );
}
