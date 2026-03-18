import { useRef } from 'react';
import { useTreeStore, selectTree } from '../../store/useTreeStore';
import { Button } from '../ui/Button';
import type { TreeSchema } from '../../types';

function HamburgerIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}


export function AppHeader() {
  const { mode, setMode, loadTree, guideHistoryOpen, setGuideHistoryOpen } = useTreeStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
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
    <header className="h-12 shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 gap-4">
      {mode === 'guide' && (
        <button
          className="sm:hidden p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={() => setGuideHistoryOpen(!guideHistoryOpen)}
          aria-label="Show path history"
        >
          <HamburgerIcon />
        </button>
      )}
      <h1 className="text-base font-bold text-gray-900 dark:text-gray-100 mr-auto leading-tight">
        Decision<br className="sm:hidden" />{' '}Tree
      </h1>

      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={handleExport} className="hidden sm:inline-flex">
          Export
        </Button>
        <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()} className="hidden sm:inline-flex">
          Import
        </Button>

        {/* Mobile-only: View + Guide + Trees mode toggle */}
        <div className="sm:hidden flex rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden text-xs font-medium">
          <button
            onClick={() => setMode('view')}
            className={`px-3 py-1.5 transition-colors ${
              mode === 'view'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            View
          </button>
          <button
            onClick={() => setMode('guide')}
            className={`px-3 py-1.5 border-l border-gray-300 dark:border-gray-600 transition-colors ${
              mode === 'guide'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Guide
          </button>
          <button
            onClick={() => setMode('trees')}
            className={`px-3 py-1.5 border-l border-gray-300 dark:border-gray-600 transition-colors ${
              mode === 'trees'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Trees
          </button>
        </div>
      </div>

      {/* Mode toggle — hidden on mobile */}
      <div className="hidden sm:flex rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden text-xs font-medium">
        <button
          onClick={() => setMode('view')}
          className={`px-3 py-1.5 transition-colors ${
            mode === 'view'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          View
        </button>
        <button
          onClick={() => setMode('editor')}
          className={`px-3 py-1.5 border-l border-gray-300 dark:border-gray-600 transition-colors ${
            mode === 'editor'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          Edit
        </button>
        <button
          onClick={() => setMode('guide')}
          className={`px-3 py-1.5 border-l border-gray-300 dark:border-gray-600 transition-colors ${
            mode === 'guide'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          Guide
        </button>
        <button
          onClick={() => setMode('trees')}
          className={`px-3 py-1.5 border-l border-gray-300 dark:border-gray-600 transition-colors ${
            mode === 'trees'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          Trees
        </button>
      </div>

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
