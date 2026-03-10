import { useState, type FormEvent } from 'react';
import type { CreateTaskBody } from '@claude-eval/shared';

interface Props {
  onSubmit: (body: CreateTaskBody) => Promise<void>;
}

export function TaskForm({ onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    try {
      await onSubmit({ title: title.trim(), description: description.trim() || undefined });
      setTitle('');
      setDescription('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        required
        style={{ flex: 1, padding: '6px 10px', borderRadius: 4, border: '1px solid #ccc' }}
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        style={{ flex: 2, padding: '6px 10px', borderRadius: 4, border: '1px solid #ccc' }}
      />
      <button type="submit" disabled={busy} style={{ padding: '6px 16px' }}>
        {busy ? '...' : 'Add'}
      </button>
    </form>
  );
}
