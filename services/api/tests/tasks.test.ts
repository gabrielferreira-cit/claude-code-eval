import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import Database from 'better-sqlite3';
import { createDb } from '../src/db.js';

let testDb: Database.Database;

vi.mock('../src/db.js', async (importOriginal) => {
  const original = await importOriginal<typeof import('../src/db.js')>();
  return { ...original, getDb: () => testDb };
});

import { tasksRouter } from '../src/routes/tasks.js';
import { errorHandler } from '../src/middleware/errorHandler.js';

const app = express();
app.use(express.json());
app.use('/tasks', tasksRouter);
app.use(errorHandler);

beforeEach(() => {
  testDb = createDb(':memory:');
});

afterAll(() => {
  testDb?.close();
});

// ─── POST /tasks ─────────────────────────────────────────────────────────────

describe('POST /tasks', () => {
  it('creates a task and returns 201', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'My task', description: 'Some details' });

    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({
      title: 'My task',
      description: 'Some details',
      status: 'pending',
    });
    expect(res.body.data.id).toBeDefined();
  });
});

// ─── GET /tasks ───────────────────────────────────────────────────────────────

describe('GET /tasks', () => {
  it('returns an empty array when no tasks exist', async () => {
    const res = await request(app).get('/tasks');
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  it('returns all tasks', async () => {
    testDb.prepare("INSERT INTO tasks (title, status) VALUES ('Task A', 'pending')").run();
    testDb.prepare("INSERT INTO tasks (title, status) VALUES ('Task B', 'done')").run();

    const res = await request(app).get('/tasks');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });
});

// ─── GET /tasks/:id ───────────────────────────────────────────────────────────

describe('GET /tasks/:id', () => {
  it('returns the task when found', async () => {
    const { lastInsertRowid } = testDb
      .prepare("INSERT INTO tasks (title) VALUES ('Find me')")
      .run();

    const res = await request(app).get(`/tasks/${lastInsertRowid}`);
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Find me');
  });
});

// ─── PATCH /tasks/:id ────────────────────────────────────────────────────────

describe('PATCH /tasks/:id', () => {
  it('updates the task and returns 200', async () => {
    const { lastInsertRowid } = testDb
      .prepare("INSERT INTO tasks (title) VALUES ('Old title')")
      .run();

    const res = await request(app)
      .patch(`/tasks/${lastInsertRowid}`)
      .send({ title: 'New title' });

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('New title');
  });

  it('returns 404 when task does not exist', async () => {
    const res = await request(app).patch('/tasks/99999').send({ title: 'X' });
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });
});

// ─── DELETE /tasks/:id ───────────────────────────────────────────────────────

describe('DELETE /tasks/:id', () => {
  it('deletes the task and returns 204', async () => {
    const { lastInsertRowid } = testDb
      .prepare("INSERT INTO tasks (title) VALUES ('To delete')")
      .run();

    const res = await request(app).delete(`/tasks/${lastInsertRowid}`);
    expect(res.status).toBe(204);
  });
});
