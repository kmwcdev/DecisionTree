import { useTreeStore } from '../../store/useTreeStore';
import type { NodeType } from '../../types';

const dotColor: Record<NodeType, string> = {
  decision: 'bg-amber-400',
  action: 'bg-blue-400',
  info: 'bg-gray-400',
};

interface Props {
  hideHeader?: boolean;
}

export function HistorySidebar({ hideHeader }: Props = {}) {
  const { wizardHistory, wizardCurrentId, nodes, guideGoTo } = useTreeStore();

  if (wizardHistory.length === 0) {
    return (
      <aside className="w-52 shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
        {!hideHeader && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Path so far</h2>
          </div>
        )}
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">Your path will appear here as you make choices.</p>
        </div>
      </aside>
    );
  }

  const currentNode = nodes.find((n) => n.id === wizardCurrentId);

  return (
    <aside className="w-52 shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col overflow-hidden">
      {!hideHeader && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Path so far</h2>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        <ol className="flex flex-col gap-0">
          {wizardHistory.map((step, i) => {
            const node = nodes.find((n) => n.id === step.nodeId);
            if (!node) return null;
            const dot = dotColor[node.data.nodeType];

            return (
              <li key={`${step.nodeId}-${i}`} className="flex flex-col">
                <button
                  onClick={() => guideGoTo(i)}
                  className="flex items-start gap-2.5 text-left group cursor-pointer"
                >
                  <div className="flex flex-col items-center shrink-0 mt-1">
                    <span className={`w-2 h-2 rounded-full ${dot} opacity-60`} />
                    <span className="w-px flex-1 bg-gray-200 dark:bg-gray-600 mt-1" style={{ minHeight: 16 }} />
                  </div>
                  <div className="pb-1 min-w-0">
                    <p className="text-xs leading-snug text-gray-500 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 line-clamp-2">
                      {node.data.label}
                    </p>
                    {step.choiceLabel && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 italic">→ {step.choiceLabel}</p>
                    )}
                  </div>
                </button>
              </li>
            );
          })}

          {currentNode && (
            <li className="flex items-start gap-2.5">
              <div className="flex flex-col items-center shrink-0 mt-1">
                <span className={`w-2.5 h-2.5 rounded-full ring-2 ring-offset-1 ring-blue-400 dark:ring-offset-gray-800 ${dotColor[currentNode.data.nodeType]}`} />
              </div>
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-snug line-clamp-2">
                {currentNode.data.label}
              </p>
            </li>
          )}
        </ol>
      </div>
    </aside>
  );
}
