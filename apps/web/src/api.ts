import type { Task, CreateTaskBody, UpdateTaskBody, ApiResponse } from '@claude-eval/shared';

const BASE = '/tasks';

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  const body = (await res.json()) as ApiResponse<T>;
  if ('error' in body) {
    throw new Error(body.error);
  }
  return body.data;
}

export const api = {
  listTasks: (): Promise<Task[]> => request<Task[]>(BASE),

  createTask: (body: CreateTaskBody): Promise<Task> =>
    request<Task>(BASE, { method: 'POST', body: JSON.stringify(body) }),

  updateTask: (id: number, body: UpdateTaskBody): Promise<Task> =>
    request<Task>(`${BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),

  deleteTask: (id: number): Promise<void> =>
    fetch(`${BASE}/${id}`, { method: 'DELETE' }).then(() => undefined),
};
