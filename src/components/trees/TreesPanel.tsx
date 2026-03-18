import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { SaveTreeModal } from './SaveTreeModal';
import { useTreeStore, selectTree } from '../../store/useTreeStore';
import {
  fetchTreeIndex,
  saveIndex,
  createTreeBin,
  updateTreeBin,
  fetchTreeBin,
  deleteTreeBin,
} from '../../services/jsonbin';
import type { TreeEntry } from '../../types';

export function TreesPanel() {
  const { loadTree, currentTreeMeta, setCurrentTreeMeta, setMode } = useTreeStore();

  const [entries, setEntries] = useState<TreeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newIndexBinId, setNewIndexBinId] = useState<string | null>(null);
  const [openingId, setOpeningId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmEntry, setConfirmEntry] = useState<TreeEntry | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTreeIndex();
      setEntries(sortByModified(data));
    } catch {
      setError('Failed to load trees.');
    } finally {
      setLoading(false);
    }
  }

  function sortByModified(data: TreeEntry[]) {
    return [...data].sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime());
  }

  async function handleSave(name: string, description: string, asNew: boolean) {
    setSaving(true);
    try {
      const tree = selectTree(useTreeStore.getState());
      const now = new Date().toISOString();
      const nodeCount = tree.nodes.length;
      let updatedEntries: TreeEntry[];

      if (currentTreeMeta && !asNew) {
        await updateTreeBin(currentTreeMeta.binId, tree);
        const updated: TreeEntry = { ...currentTreeMeta, name, description, modifiedAt: now, nodeCount };
        updatedEntries = entries.map((e) => (e.id === currentTreeMeta.id ? updated : e));
        setCurrentTreeMeta(updated);
      } else {
        const binId = await createTreeBin(tree, name);
        const entry: TreeEntry = { id: uuidv4(), name, description, createdAt: now, modifiedAt: now, nodeCount, binId };
        updatedEntries = [entry, ...entries];
        setCurrentTreeMeta(entry);
      }

      const createdId = await saveIndex(updatedEntries);
      setEntries(sortByModified(updatedEntries));
      if (createdId) setNewIndexBinId(createdId);
      setSaveModalOpen(false);
    } catch {
      alert('Save failed. Check your API key and try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleOpen(entry: TreeEntry) {
    setOpeningId(entry.id);
    try {
      const schema = await fetchTreeBin(entry.binId);
      loadTree(schema);
      setCurrentTreeMeta(entry);
      setMode('guide');
    } catch {
      alert('Failed to load tree.');
    } finally {
      setOpeningId(null);
    }
  }

  async function confirmDelete() {
    if (!confirmEntry) return;
    const entry = confirmEntry;
    setConfirmEntry(null);
    setDeletingId(entry.id);
    try {
      await deleteTreeBin(entry.binId);
      const updatedEntries = entries.filter((e) => e.id !== entry.id);
      await saveIndex(updatedEntries);
      setEntries(updatedEntries);
      if (currentTreeMeta?.id === entry.id) setCurrentTreeMeta(null);
    } catch {
      alert('Failed to delete tree.');
    } finally {
      setDeletingId(null);
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Panel header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Trees</h2>
        <Button variant="primary" size="sm" onClick={() => setSaveModalOpen(true)}>
          Save Current Tree
        </Button>
      </div>

      {/* New index bin notice */}
      {newIndexBinId && (
        <div className="mx-6 mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded text-xs text-amber-800 dark:text-amber-300">
          <strong>Index bin created!</strong> To share this list across all users, add the following to your{' '}
          <code>.env</code> file and redeploy:
          <code className="mt-1 block font-mono break-all">VITE_JSONBIN_INDEX_ID={newIndexBinId}</code>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading…</p>
        ) : error ? (
          <p className="text-sm text-red-600 dark:text-red-400">
            {error}{' '}
            <button className="underline" onClick={load}>
              Retry
            </button>
          </p>
        ) : entries.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No trees saved yet. Use "Save Current Tree" to save your first tree.
          </p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="pb-2 pr-4">Name</th>
                <th className="pb-2 pr-4 hidden md:table-cell">Description</th>
                <th className="pb-2 pr-4 hidden sm:table-cell text-right">Nodes</th>
                <th className="pb-2 pr-4 hidden lg:table-cell">Created</th>
                <th className="pb-2 pr-4">Modified</th>
                <th className="pb-2" />
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr
                  key={entry.id}
                  className={`border-b border-gray-100 dark:border-gray-800 ${
                    currentTreeMeta?.id === entry.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <td className="py-2.5 pr-4 font-medium text-gray-900 dark:text-gray-100">
                    {entry.name}
                    {currentTreeMeta?.id === entry.id && (
                      <span className="ml-2 text-xs font-normal text-blue-600 dark:text-blue-400">open</span>
                    )}
                  </td>
                  <td className="py-2.5 pr-4 text-gray-500 dark:text-gray-400 hidden md:table-cell">
                    {entry.description || '—'}
                  </td>
                  <td className="py-2.5 pr-4 text-gray-500 dark:text-gray-400 hidden sm:table-cell text-right">
                    {entry.nodeCount}
                  </td>
                  <td className="py-2.5 pr-4 text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                    {formatDate(entry.createdAt)}
                  </td>
                  <td className="py-2.5 pr-4 text-gray-500 dark:text-gray-400">{formatDate(entry.modifiedAt)}</td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleOpen(entry)}
                        disabled={!!openingId || !!deletingId}
                      >
                        {openingId === entry.id ? 'Opening…' : 'Open'}
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => setConfirmEntry(entry)}
                        disabled={!!openingId || !!deletingId}
                        className="hidden sm:inline-flex"
                      >
                        {deletingId === entry.id ? '…' : 'Delete'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        open={!!confirmEntry}
        title="Delete tree?"
        description={`"${confirmEntry?.name}" will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmEntry(null)}
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
    </div>
  );
}
