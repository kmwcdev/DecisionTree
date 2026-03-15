import { useRef, useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  MarkerType,
  BackgroundVariant,
  ConnectionMode,
  updateEdge,
} from 'reactflow';
import type { Connection } from 'reactflow';
import 'reactflow/dist/style.css';
import { useTreeStore } from '../../store/useTreeStore';
import { nodeTypes } from './nodeTypes';
import { edgeTypes } from './edgeTypes';
import type { LaborEdge } from '../../types';

const SNAP_GRID: [number, number] = [20, 20];

const defaultEdgeOptions = {
  type: 'custom' as const,
  markerEnd: { type: MarkerType.ArrowClosed },
  style: { strokeWidth: 2, stroke: '#6b7280' },
};

export function FlowCanvas() {
  const {
    nodes,
    edges,
    mode,
    darkMode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelection,
    clearSelection,
  } = useTreeStore();

  const typedEdges = useMemo(
    () => edges.map((e) => (e.type ? e : { ...e, type: 'custom' })),
    [edges]
  );

  const reconnectSucceeded = useRef(false);

  const onEdgeUpdateStart = useCallback(() => {
    reconnectSucceeded.current = false;
  }, []);

  const onEdgeUpdate = useCallback(
    (oldEdge: LaborEdge, newConnection: Connection) => {
      reconnectSucceeded.current = true;
      const updated = updateEdge(oldEdge, newConnection, edges) as LaborEdge[];
      useTreeStore.setState({ edges: updated });
    },
    [edges]
  );

  const onEdgeUpdateEnd = useCallback(
    (_: MouseEvent | TouchEvent, edge: LaborEdge) => {
      if (!reconnectSucceeded.current) {
        useTreeStore.setState((state) => ({
          edges: state.edges.some((e) => e.id === edge.id)
            ? state.edges
            : [...state.edges, edge],
        }));
      }
    },
    []
  );

  const bgColor = darkMode
    ? (mode === 'editor' ? '#374151' : '#4b5563')
    : (mode === 'editor' ? '#e5e7eb' : '#d1d5db');

  return (
    <div className="flex-1 h-full bg-white dark:bg-gray-900">
      <ReactFlow
        nodes={nodes}
        edges={typedEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        defaultEdgeOptions={defaultEdgeOptions}
        nodesDraggable={mode === 'editor'}
        nodesConnectable={mode === 'editor'}
        edgesUpdatable={mode === 'editor'}
        onEdgeUpdateStart={onEdgeUpdateStart}
        onEdgeUpdate={onEdgeUpdate}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
        connectionMode={ConnectionMode.Loose}
        elementsSelectable={true}
        snapToGrid={mode === 'editor'}
        snapGrid={SNAP_GRID}
        onNodeClick={(_, node) => setSelection({ type: 'node', id: node.id })}
        onEdgeClick={(_, edge) => setSelection({ type: 'edge', id: edge.id })}
        onPaneClick={clearSelection}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={2}
      >
        <Background
          variant={mode === 'editor' ? BackgroundVariant.Lines : BackgroundVariant.Dots}
          gap={20}
          size={1}
          color={bgColor}
        />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            if (darkMode) {
              switch (node.type) {
                case 'decision': return '#78350f';
                case 'action': return '#1e3a8a';
                default: return '#374151';
              }
            }
            switch (node.type) {
              case 'decision': return '#fef3c7';
              case 'action': return '#dbeafe';
              default: return '#f3f4f6';
            }
          }}
          className={darkMode ? '!bg-gray-800 !border !border-gray-700' : '!bg-white !border !border-gray-200'}
        />
      </ReactFlow>
    </div>
  );
}
