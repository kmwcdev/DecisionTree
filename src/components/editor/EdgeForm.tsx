import { useState, useEffect } from 'react';
import { useTreeStore } from '../../store/useTreeStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';

interface Props {
  edgeId: string;
}

export function EdgeForm({ edgeId }: Props) {
  const { edges, updateEdge, deleteEdge } = useTreeStore();
  const edge = edges.find((e) => e.id === edgeId);

  const [label, setLabel] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (edge) {
      setLabel(typeof edge.label === 'string' ? edge.label : '');
    }
  }, [edgeId, edge]);

  if (!edge) return <p className="text-sm text-gray-400">Edge not found.</p>;

  const handleSave = () => {
    updateEdge(edgeId, { label });
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-gray-700">Edit Connection</h3>

      <Input
        id="edge-label"
        label="Label (optional)"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="e.g. Yes, No…"
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
        title="Delete Connection"
        description="Remove this connection between nodes?"
        confirmLabel="Delete"
        onConfirm={() => { deleteEdge(edgeId); setConfirmDelete(false); }}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
