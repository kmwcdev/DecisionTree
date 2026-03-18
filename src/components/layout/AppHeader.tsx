import { useState } from 'react';
import { useRef } from 'react';
import { useTreeStore, selectTree } from '../../store/useTreeStore';
import { Button } from '../ui/Button';
import { SaveTreeModal } from '../trees/SaveTreeModal';
import { saveIndex, createTreeBin, updateTreeBin, fetchTreeIndex } from '../../services/jsonbin';
import { v4 as uuidv4 } from 'uuid';
import type { TreeSchema, TreeEntry } from '../../types';

function HamburgerIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

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

export function AppHeader() {
  const { mode, setMode, loadTree, guideHistoryOpen, setGuideHistoryOpen, guideEditMode, setGuideEditMode, darkMode, toggleDarkMode, currentTreeMeta, setCurrentTreeMeta } = useTreeStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

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

  const handleSave = async (name: string, description: string, asNew: boolean) => {
    setSaving(true);
    try {
      const tree = selectTree(useTreeStore.getState());
      const now = new Date().toISOString();
      const nodeCount = tree.nodes.length;

      let updatedEntries: TreeEntry[];
      let updatedMeta: TreeEntry;

      const existing = await fetchTreeIndex();

      if (currentTreeMeta && !asNew) {
        await updateTreeBin(currentTreeMeta.binId, tree);
        updatedMeta = { ...currentTreeMeta, name, description, modifiedAt: now, nodeCount };
        updatedEntries = existing.map((e) => (e.id === currentTreeMeta.id ? updatedMeta : e));
      } else {
        const binId = await createTreeBin(tree, name);
        updatedMeta = { id: uuidv4(), name, description, createdAt: now, modifiedAt: now, nodeCount, binId };
        updatedEntries = [updatedMeta, ...existing];
      }

      await saveIndex(updatedEntries);
      setCurrentTreeMeta(updatedMeta);
      setSaveModalOpen(false);
    } catch {
      alert('Save failed. Check your API key and try again.');
    } finally {
      setSaving(false);
    }
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
      <h1 className="text-base font-bold text-gray-900 dark:text-gray-100 mr-auto">
        Decision Tree
      </h1>

      <div className="flex items-center gap-2">
        <Button variant="primary" size="sm" onClick={() => setSaveModalOpen(true)} className="hidden sm:inline-flex">
          {currentTreeMeta ? 'Save' : 'Save as New'}
        </Button>
        <Button variant="secondary" size="sm" onClick={handleExport} className="hidden sm:inline-flex">
          Export
        </Button>
        <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
          Import
        </Button>
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

      <button
        onClick={toggleDarkMode}
        className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <SunIcon /> : <MoonIcon />}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleImport}
      />

      <SaveTreeModal
        open={saveModalOpen}
        initialName={currentTreeMeta?.name ?? ''}
        initialDescription={currentTreeMeta?.description ?? ''}
        canOverwrite={!!currentTreeMeta}
        onSave={handleSave}
        onCancel={() => setSaveModalOpen(false)}
        loading={saving}
      />
    </header>
  );
}
