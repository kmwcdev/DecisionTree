import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges, addEdge } from 'reactflow';
import type {
  NodeChange,
  EdgeChange,
  Connection,
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import type {
  LaborNode,
  LaborEdge,
  LaborNodeData,
  LaborEdgeData,
  AppMode,
  EditorSelection,
  TreeSchema,
  NodeType,
  WizardStep,
  TreeEntry,
} from '../types';
import { sampleTree } from '../data/sampleTree';

interface TreeState {
  nodes: LaborNode[];
  edges: LaborEdge[];
  mode: AppMode;
  selection: EditorSelection;

  // ReactFlow handlers
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  // Node CRUD
  addNode: (type: NodeType, position?: { x: number; y: number }) => void;
  updateNode: (id: string, data: Partial<LaborNodeData>) => void;
  deleteNode: (id: string) => void;

  // Edge CRUD
  updateEdge: (id: string, data: Partial<LaborEdgeData>) => void;
  deleteEdge: (id: string) => void;

  // Tree
  loadTree: (schema: TreeSchema) => void;
  currentTreeMeta: TreeEntry | null;
  setCurrentTreeMeta: (meta: TreeEntry | null) => void;

  // UI
  setMode: (mode: AppMode) => void;
  setSelection: (selection: EditorSelection) => void;
  clearSelection: () => void;
  savedAt: number | null;
  darkMode: boolean;
  toggleDarkMode: () => void;
  guideHistoryOpen: boolean;
  setGuideHistoryOpen: (open: boolean) => void;
  guideEditMode: boolean;
  setGuideEditMode: (v: boolean) => void;
  reorderEdges: (sourceId: string, fromIndex: number, toIndex: number) => void;
  // Guide / wizard
  wizardCurrentId: string | null;
  wizardHistory: WizardStep[];
  startGuide: () => void;
  guideStep: (nodeId: string, choiceLabel?: string) => void;
  guideBack: () => void;
  guideGoTo: (index: number) => void;
  restartGuide: () => void;
}

export const useTreeStore = create<TreeState>((set) => ({
  nodes: sampleTree.nodes,
  edges: sampleTree.edges,
  mode: window.matchMedia('(max-width: 767px)').matches ? 'guide' : 'view',
  selection: { type: 'none', id: null },
  savedAt: null,
  currentTreeMeta: null,
  darkMode: localStorage.getItem('labor-dark-mode') !== 'false',
  guideHistoryOpen: false,
  guideEditMode: false,
  wizardCurrentId: null,
  wizardHistory: [],

  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes) as LaborNode[],
    }));
  },

  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges) as LaborEdge[],
    }));
  },

  onConnect: (connection) => {
    set((state) => ({
      edges: addEdge(
        {
          ...connection,
          id: uuidv4(),
          data: {},
        },
        state.edges
      ) as LaborEdge[],
    }));
  },

  addNode: (type, position = { x: 300, y: 300 }) => {
    const id = uuidv4();
    const newNode: LaborNode = {
      id,
      type,
      position,
      data: {
        label: `New ${type} node`,
        description: '',
        nodeType: type,
      },
    };
    set((state) => ({
      nodes: [...state.nodes, newNode],
      selection: { type: 'node', id },
    }));
  },

  updateNode: (id, data) => {
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id
          ? { ...n, type: data.nodeType ?? n.type, data: { ...n.data, ...data } }
          : n
      ),
    }));
  },

  deleteNode: (id) => {
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
      selection: { type: 'none', id: null },
    }));
  },

  updateEdge: (id, data) => {
    set((state) => ({
      edges: state.edges.map((e) =>
        e.id === id
          ? { ...e, label: data.label ?? e.label, data: { ...e.data, ...data } }
          : e
      ),
    }));
  },

  deleteEdge: (id) => {
    set((state) => ({
      edges: state.edges.filter((e) => e.id !== id),
      selection: { type: 'none', id: null },
    }));
  },

  loadTree: (schema) => {
    const targetIds = new Set(schema.edges.map((e) => e.target));
    const root = schema.nodes.find((n) => !targetIds.has(n.id)) ?? schema.nodes[0] ?? null;
    set({
      nodes: schema.nodes,
      edges: schema.edges,
      selection: { type: 'none', id: null },
      wizardCurrentId: root?.id ?? null,
      wizardHistory: [],
    });
  },

  setCurrentTreeMeta: (meta) => {
    set({ currentTreeMeta: meta });
  },

  setMode: (mode) => {
    set({ mode, selection: { type: 'none', id: null } });
  },

  setSelection: (selection) => {
    set({ selection });
  },

  clearSelection: () => {
    set({ selection: { type: 'none', id: null } });
  },

  toggleDarkMode: () => {
    set((state) => {
      const next = !state.darkMode;
      localStorage.setItem('labor-dark-mode', String(next));
      if (next) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = next ? 'dark' : 'light';
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next ? '#111827' : '#ffffff');
      return { darkMode: next };
    });
  },

  setGuideHistoryOpen: (open) => {
    set({ guideHistoryOpen: open });
  },

  setGuideEditMode: (v) => {
    set({ guideEditMode: v });
  },

  reorderEdges: (sourceId, fromIndex, toIndex) => {
    set((state) => {
      const outgoing = state.edges
        .map((e, i) => ({ edge: e, i }))
        .filter(({ edge }) => edge.source === sourceId);
      const reordered = [...outgoing];
      const [moved] = reordered.splice(fromIndex, 1);
      reordered.splice(toIndex, 0, moved);
      const result = [...state.edges];
      outgoing.forEach(({ i }, slot) => {
        result[i] = reordered[slot].edge;
      });
      return { edges: result };
    });
  },

  startGuide: () => {
    const { nodes, edges } = useTreeStore.getState();
    const targetIds = new Set(edges.map((e) => e.target));
    const root = nodes.find((n) => !targetIds.has(n.id)) ?? nodes[0] ?? null;
    set({ wizardCurrentId: root?.id ?? null, wizardHistory: [] });
  },

  guideStep: (nodeId, choiceLabel) => {
    set((state) => ({
      wizardHistory: [
        ...state.wizardHistory,
        { nodeId: state.wizardCurrentId!, choiceLabel },
      ],
      wizardCurrentId: nodeId,
      guideHistoryOpen: false,
    }));
  },

  guideBack: () => {
    set((state) => {
      if (state.wizardHistory.length === 0) return {};
      const prev = state.wizardHistory[state.wizardHistory.length - 1];
      return {
        wizardCurrentId: prev.nodeId,
        wizardHistory: state.wizardHistory.slice(0, -1),
        guideHistoryOpen: false,
      };
    });
  },

  guideGoTo: (index) => {
    set((state) => {
      const step = state.wizardHistory[index];
      if (!step) return {};
      return {
        wizardCurrentId: step.nodeId,
        wizardHistory: state.wizardHistory.slice(0, index),
        guideHistoryOpen: false,
      };
    });
  },

  restartGuide: () => {
    const { startGuide } = useTreeStore.getState();
    startGuide();
  },
}));

// Selector helpers
export const selectTree = (state: TreeState): TreeSchema => ({
  version: 1,
  nodes: state.nodes,
  edges: state.edges,
});
