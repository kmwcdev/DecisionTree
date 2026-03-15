import { useTreeStore } from '../../store/useTreeStore';
import type { NodeType } from '../../types';

interface NodeTypeCard {
  type: NodeType;
  shape: string;
  color: string;
  bgColor: string;
  borderColor: string;
  example: string;
}

const nodeCards: NodeTypeCard[] = [
  {
    type: 'decision',
    shape: 'Diamond',
    color: 'text-amber-800 dark:text-amber-300',
    bgColor: 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/30 dark:hover:bg-amber-900/50',
    borderColor: 'border-amber-400 dark:border-amber-600',
    example: '"Are contractions 5 min apart?"',
  },
  {
    type: 'action',
    shape: 'Rectangle',
    color: 'text-blue-800 dark:text-blue-300',
    bgColor: 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50',
    borderColor: 'border-blue-400 dark:border-blue-600',
    example: '"Go to the hospital"',
  },
  {
    type: 'info',
    shape: 'Rounded',
    color: 'text-gray-700 dark:text-gray-300',
    bgColor: 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600',
    borderColor: 'border-gray-400 dark:border-gray-500',
    example: '"Labor has started"',
  },
];

export function AddNodePanel() {
  const { addNode } = useTreeStore();

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Add Node</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400">Click a type to add a new node to the canvas.</p>
      <div className="flex flex-col gap-2 mt-1">
        {nodeCards.map((card) => (
          <button
            key={card.type}
            onClick={() => addNode(card.type)}
            className={`rounded border-2 ${card.bgColor} ${card.borderColor} px-3 py-2.5 text-left transition-colors cursor-pointer`}
          >
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold uppercase tracking-wide ${card.color}`}>
                {card.type}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">· {card.shape}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{card.example}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
