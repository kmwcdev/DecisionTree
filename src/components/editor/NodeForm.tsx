import { useState, useEffect } from 'react';
import { useTreeStore } from '../../store/useTreeStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Modal } from '../ui/Modal';
import type { NodeType } from '../../types';

const nodeTypeOptions = [
  { value: 'decision', label: 'Decision (Diamond)' },
  { value: 'action', label: 'Action (Rectangle)' },
  { value: 'info', label: 'Info (Rounded)' },
];

interface Props {
  nodeId: string;
}

export function NodeForm({ nodeId }: Props) {
  const { nodes, updateNode, deleteNode } = useTreeStore();
  const node = nodes.find((n) => n.id === nodeId);

  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [nodeType, setNodeType] = useState<NodeType>('info');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (node) {
      setLabel(node.data.label);
      setDescription(node.data.description ?? '');
      setNodeType(node.data.nodeType);
    }
  }, [nodeId, node]);

  if (!node) return <p className="text-sm text-gray-400">Node not found.</p>;

  const handleSave = () => {
    updateNode(nodeId, { label, description, nodeType });
    useTreeStore.setState({ savedAt: Date.now() });
  };

  return (
    <div className="flex flex-col gap-3 flex-1 min-h-0">
      <h3 className="text-sm font-semibold text-gray-700">Edit Node</h3>

      <Select
        id="node-type"
        label="Type"
        options={nodeTypeOptions}
        value={nodeType}
        onChange={(e) => setNodeType(e.target.value as NodeType)}
      />

      <Input
        id="node-label"
        label="Label"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Node label…"
      />

      <Textarea
        id="node-desc"
        label="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Additional context…"
        grow
      />

      <div className="flex gap-2 pt-1">
        <Button variant="primary" size="sm" onClick={handleSave} className="flex-1">
          Save
        </Button>
        <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
          Delete
        </Button>
      </div>

      <Modal
        open={confirmDelete}
        title="Delete Node"
        description="This will also remove all edges connected to this node. This cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => { deleteNode(nodeId); setConfirmDelete(false); }}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
