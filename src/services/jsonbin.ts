import type { TreeEntry, TreeSchema } from '../types';

const API_KEY = import.meta.env.VITE_JSONBIN_KEY as string;
const BASE = 'https://api.jsonbin.io/v3';
const INDEX_STORAGE_KEY = 'dt-index-bin-id';

function authHeaders(extra?: Record<string, string>) {
  return { 'X-Access-Key': API_KEY, ...extra };
}

async function createBin(data: unknown, name?: string): Promise<string> {
  const res = await fetch(`${BASE}/b`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(name ? { 'X-Bin-Name': name } : {}) },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`JSONBin create failed: ${res.status}`);
  const json = await res.json();
  return json.metadata.id as string;
}

async function readBin<T>(binId: string): Promise<T> {
  const res = await fetch(`${BASE}/b/${binId}/latest`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`JSONBin read failed: ${res.status}`);
  const json = await res.json();
  return json.record as T;
}

async function updateBin(binId: string, data: unknown): Promise<void> {
  const res = await fetch(`${BASE}/b/${binId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`JSONBin update failed: ${res.status}`);
}

async function deleteBin(binId: string): Promise<void> {
  const res = await fetch(`${BASE}/b/${binId}`, { method: 'DELETE', headers: authHeaders() });
  if (!res.ok) throw new Error(`JSONBin delete failed: ${res.status}`);
}

function getIndexBinId(): string | null {
  return (import.meta.env.VITE_JSONBIN_INDEX_ID as string) || localStorage.getItem(INDEX_STORAGE_KEY) || null;
}

export function getStoredIndexBinId(): string | null {
  return localStorage.getItem(INDEX_STORAGE_KEY);
}

export async function fetchTreeIndex(): Promise<TreeEntry[]> {
  const id = getIndexBinId();
  if (!id) return [];
  const data = await readBin<{ trees: TreeEntry[] }>(id);
  return data.trees ?? [];
}

// Returns newly created index bin ID if the index didn't exist yet, otherwise null.
export async function saveIndex(entries: TreeEntry[]): Promise<string | null> {
  const existingId = getIndexBinId();
  if (!existingId) {
    const newId = await createBin({ trees: entries }, 'decision-tree-index');
    localStorage.setItem(INDEX_STORAGE_KEY, newId);
    return newId;
  }
  await updateBin(existingId, { trees: entries });
  return null;
}

export async function createTreeBin(schema: TreeSchema, name: string): Promise<string> {
  return createBin(schema, name);
}

export async function updateTreeBin(binId: string, schema: TreeSchema): Promise<void> {
  return updateBin(binId, schema);
}

export async function fetchTreeBin(binId: string): Promise<TreeSchema> {
  return readBin<TreeSchema>(binId);
}

export async function deleteTreeBin(binId: string): Promise<void> {
  return deleteBin(binId);
}
