import { useTreeStore, selectTree } from '../../store/useTreeStore';
import { Button } from '../ui/Button';
import type { TreeSchema } from '../../types';
import { useRef } from 'react';

export function AppHeader() {
  const { mode, setMode, loadTree, snapToGrid, toggleSnapToGrid } = useTreeStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    // Read state on-demand to avoid subscribing to a new-object selector
    const tree = selectTree(useTreeStore.getState());
    const json = JSON.stringify(tree, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'labor-tree.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string) as TreeSchema;
        if (!parsed.nodes || !parsed.edges) {
          alert('Invalid tree file: missing nodes or edges.');
          return;
        }
        loadTree(parsed);
      } catch {
        alert('Could not parse file. Make sure it is a valid JSON tree export.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="h-12 shrink-0 bg-white border-b border-gray-200 flex items-center px-4 gap-4">
      <h1 className="text-base font-bold text-gray-900 mr-auto">
        Labor Decision Tree
      </h1>

      {/* Mode toggle — hidden on mobile */}
      <div className="hidden sm:flex rounded-md border border-gray-300 overflow-hidden text-xs font-medium">
        <button
          onClick={() => setMode('view')}
          className={`px-3 py-1.5 transition-colors ${
            mode === 'view'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          View
        </button>
        <button
          onClick={() => setMode('editor')}
          className={`px-3 py-1.5 border-l border-gray-300 transition-colors ${
            mode === 'editor'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          Edit
        </button>
        <button
          onClick={() => setMode('guide')}
          className={`px-3 py-1.5 border-l border-gray-300 transition-colors ${
            mode === 'guide'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          Guide
        </button>
      </div>

      {mode === 'editor' && (
        <button
          onClick={toggleSnapToGrid}
          title="Toggle snap to grid"
          className={`hidden sm:flex items-center gap-1.5 rounded border px-2.5 py-1.5 text-xs font-medium transition-colors ${
            snapToGrid
              ? 'bg-blue-50 border-blue-400 text-blue-700'
              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
            <rect x="0.5" y="0.5" width="4" height="4" rx="0.5" stroke="currentColor"/>
            <rect x="7.5" y="0.5" width="4" height="4" rx="0.5" stroke="currentColor"/>
            <rect x="0.5" y="7.5" width="4" height="4" rx="0.5" stroke="currentColor"/>
            <rect x="7.5" y="7.5" width="4" height="4" rx="0.5" stroke="currentColor"/>
          </svg>
          Snap
        </button>
      )}

      <Button variant="secondary" size="sm" onClick={handleExport} className="hidden sm:inline-flex">
        Export
      </Button>
      <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
        Import
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleImport}
      />
    </header>
  );
}
