import { Router, Request, Response } from 'express';
import { getDb } from '../db.js';
import type { Task, CreateTaskBody, UpdateTaskBody } from '@claude-eval/shared';

export const tasksRouter = Router();

// POST /tasks — create a new task
tasksRouter.post('/', (req: Request, res: Response) => {
  const body = req.body as CreateTaskBody;

  if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
    res.status(400).json({ error: 'title is required' });
    return;
  }

  const db = getDb();
  const stmt = db.prepare(
    'INSERT INTO tasks (title, description) VALUES (?, ?) RETURNING *'
  );
  const task = stmt.get(body.title.trim(), body.description ?? null) as Task;
  res.status(201).json({ data: task });
});

// GET /tasks — list all tasks
tasksRouter.get('/', (_req: Request, res: Response) => {
  const db = getDb();
  const tasks = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all() as Task[];
  res.json({ data: tasks });
});

// GET /tasks/:id — get a single task
tasksRouter.get('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'id must be an integer' });
    return;
  }

  const db = getDb();
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as Task | undefined;
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  res.json({ data: task });
});

// PATCH /tasks/:id — partial update
tasksRouter.patch('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'id must be an integer' });
    return;
  }

  const db = getDb();
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as Task | undefined;
  if (!existing) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  const body = req.body as UpdateTaskBody;
  const fields: string[] = [];
  const values: unknown[] = [];

  if (body.title !== undefined) {
    if (typeof body.title !== 'string' || body.title.trim() === '') {
      res.status(400).json({ error: 'title must be a non-empty string' });
      return;
    }
    fields.push('title = ?');
    values.push(body.title.trim());
  }
  if (body.description !== undefined) {
    fields.push('description = ?');
    values.push(body.description);
  }
  if (body.status !== undefined) {
    const valid = ['pending', 'processing', 'done', 'failed'];
    if (!valid.includes(body.status)) {
      res.status(400).json({ error: `status must be one of: ${valid.join(', ')}` });
      return;
    }
    fields.push('status = ?');
    values.push(body.status);
  }

  if (fields.length === 0) {
    res.status(400).json({ error: 'no fields to update' });
    return;
  }

  values.push(id);
  const updated = db
    .prepare(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ? RETURNING *`)
    .get(...(values as [unknown])) as Task;

  res.json({ data: updated });
});

// DELETE /tasks/:id — remove a task
tasksRouter.delete('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'id must be an integer' });
    return;
  }

  const db = getDb();
  const existing = db.prepare('SELECT id FROM tasks WHERE id = ?').get(id);
  if (!existing) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  res.status(204).send();
});
