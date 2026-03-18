import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface SaveTreeModalProps {
  open: boolean;
  initialName?: string;
  initialDescription?: string;
  canOverwrite?: boolean;
  onSave: (name: string, description: string, asNew: boolean) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function SaveTreeModal({
  open,
  initialName = '',
  initialDescription = '',
  canOverwrite = false,
  onSave,
  onCancel,
  loading = false,
}: SaveTreeModalProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    if (open) {
      setName(initialName);
      setDescription(initialDescription);
    }
  }, [open, initialName, initialDescription]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm mx-4 p-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Save Tree</h2>
        <div className="flex flex-col gap-3">
          <Input
            label="Name"
            id="tree-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Pregnancy Labor Guide"
            autoFocus
          />
          <Input
            label="Description (optional)"
            id="tree-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of this tree"
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          {canOverwrite && (
            <Button
              variant="secondary"
              onClick={() => onSave(name, description, true)}
              disabled={!name.trim() || loading}
            >
              Save as New
            </Button>
          )}
          <Button
            variant="primary"
            onClick={() => onSave(name, description, false)}
            disabled={!name.trim() || loading}
          >
            {loading ? 'Saving…' : canOverwrite ? 'Overwrite' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}
