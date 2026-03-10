import type { Task, TaskStatus } from '@claude-eval/shared';

const STATUS_COLORS: Record<TaskStatus, string> = {
  pending: '#f0ad4e',
  processing: '#5bc0de',
  done: '#5cb85c',
  failed: '#d9534f',
};

interface Props {
  tasks: Task[];
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: TaskStatus) => void;
}

export function TaskList({ tasks, onDelete, onStatusChange }: Props) {
  if (tasks.length === 0) {
    return <p style={{ color: '#888' }}>No tasks yet. Add one above.</p>;
  }

  return (
    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {tasks.map((task) => (
        <li
          key={task.id}
          style={{
            background: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: 6,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: STATUS_COLORS[task.status],
              flexShrink: 0,
            }}
          />
          <span style={{ flex: 1, fontWeight: 500 }}>{task.title}</span>
          {task.description && (
            <span style={{ color: '#666', fontSize: 13 }}>{task.description}</span>
          )}
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
            style={{ padding: '2px 6px', borderRadius: 4, border: '1px solid #ccc' }}
          >
            <option value="pending">pending</option>
            <option value="processing">processing</option>
            <option value="done">done</option>
            <option value="failed">failed</option>
          </select>
          <button
            onClick={() => onDelete(task.id)}
            style={{ color: '#d9534f', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}
