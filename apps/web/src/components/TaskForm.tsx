import { useState, type FormEvent } from 'react';
import { TASK_PRIORITIES } from '@claude-eval/shared';
import type { CreateTaskBody, TaskPriority } from '@claude-eval/shared';

interface Props {
  onSubmit: (body: CreateTaskBody) => Promise<void>;
}

export function TaskForm({ onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
      });
      setTitle('');
      setDescription('');
      setPriority('medium');
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
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as TaskPriority)}
        style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid #ccc' }}
      >
        {TASK_PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <button type="submit" disabled={busy} style={{ padding: '6px 16px' }}>
        {busy ? '...' : 'Add'}
      </button>
    </form>
  );
}
