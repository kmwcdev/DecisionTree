import { useRef, useState, useEffect } from 'react';
import { useTreeStore } from '../../store/useTreeStore';
import type { NodeType } from '../../types';

const typeStyles: Record<NodeType, { border: string; badge: string; badgeText: string; icon: string }> = {
  decision: {
    border: 'border-amber-400 dark:border-amber-600',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    badgeText: 'Decision',
    icon: '◇',
  },
  action: {
    border: 'border-blue-400 dark:border-blue-600',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    badgeText: 'Action',
    icon: '▢',
  },
  info: {
    border: 'border-gray-300 dark:border-gray-600',
    badge: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    badgeText: 'Info',
    icon: 'ℹ',
  },
};

const nextButtonStyles: Record<NodeType, string> = {
  decision: 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 hover:border-amber-400 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200 dark:hover:bg-amber-900/50',
  action: 'border-blue-300 bg-blue-50 text-blue-900 hover:bg-blue-100 hover:border-blue-400 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-200 dark:hover:bg-blue-900/50',
  info: 'border-gray-300 bg-white text-gray-800 hover:bg-gray-50 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
};

const nextButtonBorderStyle: Record<NodeType, string> = {
  decision: 'border-amber-300 dark:border-amber-700',
  action: 'border-blue-300 dark:border-blue-700',
  info: 'border-gray-300 dark:border-gray-600',
};

const nextButtonContentStyle: Record<NodeType, string> = {
  decision: 'bg-amber-50 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200',
  action: 'bg-blue-50 text-blue-900 dark:bg-blue-900/30 dark:text-blue-200',
  info: 'bg-white text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

function GripIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
      <circle cx="5.5" cy="4" r="1.3" />
      <circle cx="10.5" cy="4" r="1.3" />
      <circle cx="5.5" cy="8" r="1.3" />
      <circle cx="10.5" cy="8" r="1.3" />
      <circle cx="5.5" cy="12" r="1.3" />
      <circle cx="10.5" cy="12" r="1.3" />
    </svg>
  );
}

function OptionContent({ edgeLabel, targetLabel, nodeType }: {
  edgeLabel: string;
  targetLabel?: string;
  nodeType: NodeType;
}) {
  return (
    <div className={`flex rounded-xl border-2 overflow-hidden ${nextButtonBorderStyle[nodeType]}`}>
      <div className="flex items-center justify-center px-3 bg-gray-50 dark:bg-gray-700 text-gray-300 dark:text-gray-500 border-r border-gray-200 dark:border-gray-600 cursor-grab active:cursor-grabbing select-none">
        <GripIcon />
      </div>
      <div className={`flex-1 px-5 py-3.5 font-medium text-sm ${nextButtonContentStyle[nodeType]}`}>
        <span className="block">{edgeLabel}</span>
        {targetLabel && (
          <span className="block text-xs font-normal opacity-60 mt-0.5">{targetLabel}</span>
        )}
      </div>
    </div>
  );
}

interface Props {
  nodeId: string;
}

export function NodeCard({ nodeId }: Props) {
  const { nodes, edges, guideStep, guideBack, restartGuide, wizardHistory, guideEditMode, reorderEdges } = useTreeStore();

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [ghostPos, setGhostPos] = useState<{ x: number; y: number } | null>(null);

  const draggingRef = useRef<number | null>(null);
  const overIndexRef = useRef<number | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const ghostSizeRef = useRef({ width: 0, height: 0 });
  const snapMidsRef = useRef<number[]>([]);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    draggingRef.current = null;
    overIndexRef.current = null;
    setDragIndex(null);
    setOverIndex(null);
    setGhostPos(null);
  }, [nodeId, guideEditMode]);

  const node = nodes.find((n) => n.id === nodeId);
  if (!node) return null;

  const { label, description, nodeType } = node.data;
  const style = typeStyles[nodeType];

  const outgoing = edges.filter((e) => e.source === nodeId);
  const isDone = outgoing.length === 0;

  const displayOutgoing = (() => {
    if (dragIndex === null || overIndex === null || dragIndex === overIndex) return outgoing;
    const reordered = [...outgoing];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(overIndex, 0, moved);
    return reordered;
  })();

  const draggedEdgeId = dragIndex !== null ? outgoing[dragIndex]?.id : null;

  const handleDragStart = (e: React.PointerEvent<HTMLDivElement>, originalIndex: number) => {
    e.preventDefault();

    snapMidsRef.current = itemRefs.current.map((ref) => {
      const rect = ref?.getBoundingClientRect();
      return rect ? rect.top + rect.height / 2 : 0;
    });

    const itemEl = itemRefs.current[originalIndex];
    if (itemEl) {
      const rect = itemEl.getBoundingClientRect();
      dragOffsetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      ghostSizeRef.current = { width: rect.width, height: rect.height };
    }

    draggingRef.current = originalIndex;
    overIndexRef.current = originalIndex;
    setDragIndex(originalIndex);
    setOverIndex(originalIndex);
    setGhostPos({ x: e.clientX, y: e.clientY });

    const onMove = (ev: PointerEvent) => {
      setGhostPos({ x: ev.clientX, y: ev.clientY });

      const y = ev.clientY;
      let newOver = draggingRef.current!;
      let closestDist = Infinity;
      snapMidsRef.current.forEach((mid, idx) => {
        const dist = Math.abs(y - mid);
        if (dist < closestDist) {
          closestDist = dist;
          newOver = idx;
        }
      });

      if (newOver !== overIndexRef.current) {
        overIndexRef.current = newOver;
        setOverIndex(newOver);
      }
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);

      if (draggingRef.current !== null && overIndexRef.current !== null && draggingRef.current !== overIndexRef.current) {
        reorderEdges(nodeId, draggingRef.current, overIndexRef.current);
      }

      draggingRef.current = null;
      overIndexRef.current = null;
      setDragIndex(null);
      setOverIndex(null);
      setGhostPos(null);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const ghostEdge = dragIndex !== null ? outgoing[dragIndex] : null;
  const ghostTarget = ghostEdge ? nodes.find((n) => n.id === ghostEdge.target) : null;

  return (
    <div className="w-full max-w-xl flex flex-col gap-6">
      {/* Card */}
      <div className={`bg-white dark:bg-gray-800 rounded-2xl border-2 ${style.border} shadow-sm p-8`}>
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>
            {style.icon} {style.badgeText}
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-snug mb-3">{label}</h2>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{description}</p>
        )}
      </div>

      {/* Next steps */}
      {!isDone && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide px-1">
            {guideEditMode ? 'Drag to reorder' : (outgoing.length === 1 ? 'Next step' : 'Choose a path')}
          </p>

          {displayOutgoing.map((edge, displayIdx) => {
            const target = nodes.find((n) => n.id === edge.target);
            if (!target) return null;
            const edgeLabel = typeof edge.label === 'string' && edge.label
              ? edge.label
              : target.data.label;
            const targetLabel = typeof edge.label === 'string' && edge.label
              ? target.data.label
              : undefined;
            const isDragging = edge.id === draggedEdgeId;
            const originalIndex = outgoing.findIndex((o) => o.id === edge.id);

            return (
              <div
                key={edge.id}
                ref={(el) => { itemRefs.current[displayIdx] = el; }}
                style={{ touchAction: 'none' }}
                onPointerDown={guideEditMode ? (e) => handleDragStart(e, originalIndex) : undefined}
              >
                {guideEditMode ? (
                  isDragging ? (
                    <div
                      className="rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600"
                      style={{ height: ghostSizeRef.current.height || undefined }}
                    />
                  ) : (
                    <OptionContent
                      edgeLabel={edgeLabel}
                      targetLabel={targetLabel}
                      nodeType={target.data.nodeType}
                    />
                  )
                ) : (
                  <button
                    onClick={() => guideStep(edge.target, typeof edge.label === 'string' ? edge.label : undefined)}
                    className={`w-full rounded-xl border-2 px-5 py-3.5 text-left font-medium text-sm transition-colors ${nextButtonStyles[target.data.nodeType]}`}
                  >
                    <span className="block">{edgeLabel}</span>
                    {targetLabel && (
                      <span className="block text-xs font-normal opacity-60 mt-0.5">{targetLabel}</span>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Ghost: flat clone following the pointer */}
      {ghostPos && ghostEdge && ghostTarget && (
        <div
          className="fixed pointer-events-none z-50 shadow-2xl"
          style={{
            left: ghostPos.x - dragOffsetRef.current.x,
            top: ghostPos.y - dragOffsetRef.current.y,
            width: ghostSizeRef.current.width,
          }}
        >
          <OptionContent
            edgeLabel={typeof ghostEdge.label === 'string' && ghostEdge.label
              ? ghostEdge.label
              : ghostTarget.data.label}
            targetLabel={typeof ghostEdge.label === 'string' && ghostEdge.label
              ? ghostTarget.data.label
              : undefined}
            nodeType={ghostTarget.data.nodeType}
          />
        </div>
      )}

      {/* Done state */}
      {isDone && (
        <div className="rounded-xl border-2 border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 px-5 py-4 text-center">
          <p className="text-sm font-semibold text-green-800 dark:text-green-300">End of this path</p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">You've reached the last step.</p>
        </div>
      )}

      {/* Controls */}
      {!guideEditMode && (
        <div className="flex gap-3 justify-between pt-2">
          <button
            onClick={guideBack}
            disabled={wizardHistory.length === 0}
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={restartGuide}
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            ↺ Restart
          </button>
        </div>
      )}
    </div>
  );
}
