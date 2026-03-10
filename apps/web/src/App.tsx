import { useState, useEffect } from 'react';
import type { Task, TaskStatus } from '@claude-eval/shared';
import { api } from './api.js';
import { TaskList } from './components/TaskList.js';
import { TaskForm } from './components/TaskForm.js';

export function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function loadTasks() {
    try {
      const data = await api.listTasks();
      setTasks(data);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleCreate(body: Parameters<typeof api.createTask>[0]) {
    const task = await api.createTask(body);
    setTasks((prev) => [task, ...prev]);
  }

  async function handleDelete(id: number) {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  async function handleStatusChange(id: number, status: TaskStatus) {
    const updated = await api.updateTask(id, { status });
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24, fontSize: 24 }}>Task Manager</h1>
      {error && <p style={{ color: '#d9534f', marginBottom: 12 }}>Error: {error}</p>}
      <TaskForm onSubmit={handleCreate} />
      <TaskList tasks={tasks} onDelete={handleDelete} onStatusChange={handleStatusChange} />
    </div>
  );
}
