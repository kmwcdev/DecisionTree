import { useRef } from 'react';
import { useTreeStore, selectTree } from '../../store/useTreeStore';
import type { TreeSchema } from '../../types';

function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5" strokeWidth={2} />
      <path strokeLinecap="round" strokeWidth={2} d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

interface ActionRowProps {
  label: string;
  description: string;
  onClick: () => void;
  children?: React.ReactNode;
}

function ActionRow({ label, description, onClick, children }: ActionRowProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-5 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
    >
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
      </div>
      {children}
    </button>
  );
}

export function OptionsPanel() {
  const { loadTree, darkMode, toggleDarkMode } = useTreeStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const tree = selectTree(useTreeStore.getState());
    const json = JSON.stringify(tree, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'decision-tree.json';
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
    <div className="flex flex-col flex-1 overflow-hidden bg-gray-50 dark:bg-gray-950">
      <div className="flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Options</h2>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-md flex flex-col gap-3">
          <ActionRow
            label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            description={darkMode ? 'Use a light background' : 'Use a dark background'}
            onClick={toggleDarkMode}
          >
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </ActionRow>

          <ActionRow
            label="Export"
            description="Download the current tree as a JSON file"
            onClick={handleExport}
          >
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </ActionRow>

          <ActionRow
            label="Import"
            description="Load a tree from a JSON file"
            onClick={() => fileInputRef.current?.click()}
          >
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12" />
            </svg>
          </ActionRow>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleImport}
      />
    </div>
  );
}
