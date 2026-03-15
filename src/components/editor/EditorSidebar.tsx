import { useTreeStore } from '../../store/useTreeStore';
import { NodeForm } from './NodeForm';
import { EdgeForm } from './EdgeForm';
import { AddNodePanel } from './AddNodePanel';

export function EditorSidebar() {
  const { selection } = useTreeStore();

  return (
    <aside className="w-64 shrink-0 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
        <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200">Editor</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {selection.type === 'none'
            ? 'Select a node or connection to edit it.'
            : selection.type === 'node'
            ? 'Editing selected node.'
            : 'Editing selected connection.'}
        </p>
      </div>

      <div className="flex flex-col p-4 flex-1 min-h-0">
        {selection.type === 'none' && <AddNodePanel />}
        {selection.type === 'node' && selection.id && (
          <NodeForm nodeId={selection.id} />
        )}
        {selection.type === 'edge' && selection.id && (
          <EdgeForm edgeId={selection.id} />
        )}
      </div>
    </aside>
  );
}
