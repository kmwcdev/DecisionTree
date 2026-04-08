import { useEffect } from 'react';
import { useTreeStore, selectTree } from '../store/useTreeStore';
import { sampleTree } from '../data/sampleTree';
import type { TreeSchema } from '../types';

const STORAGE_KEY = 'labor-decision-tree-v4';

function loadFromStorage(): TreeSchema | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TreeSchema;
    if (!parsed.nodes || !parsed.edges) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveToStorage(tree: TreeSchema) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tree));
  } catch {
    // Storage might be full; silently ignore
  }
}

export function usePersistence() {
  const loadTree = useTreeStore((s) => s.loadTree);

  // On mount: hydrate from localStorage or sample data
  useEffect(() => {
    const saved = loadFromStorage();
    if (saved) {
      loadTree(saved);
    } else {
      loadTree(sampleTree);
    }
  }, [loadTree]);

  // Subscribe to store changes and debounce writes
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const unsubscribe = useTreeStore.subscribe((state) => {
      const tree = selectTree(state);
      clearTimeout(timer);
      timer = setTimeout(() => saveToStorage(tree), 500);
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);
}
