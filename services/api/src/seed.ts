import { getDb } from './db.js';

const db = getDb();

const existing = db.prepare('SELECT COUNT(*) as count FROM tasks').get() as { count: number };
if (existing.count > 0) {
  console.log(`Database already has ${existing.count} tasks. Skipping seed.`);
  process.exit(0);
}

const insert = db.prepare(
  'INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)'
);

const tasks = [
  ['Set up CI pipeline', 'Configure GitHub Actions for build and test', 'done'],
  ['Write API documentation', 'Document all REST endpoints with examples', 'pending'],
  ['Fix login redirect bug', 'Users are redirected to 404 after OAuth login', 'pending'],
  ['Refactor auth middleware', 'Extract token validation into a shared utility', 'processing'],
  ['Add rate limiting', 'Protect public endpoints with per-IP rate limiting', 'pending'],
];

const seedAll = db.transaction(() => {
  for (const [title, description, status] of tasks) {
    insert.run(title, description, status);
  }
});

seedAll();
console.log(`Seeded ${tasks.length} tasks.`);
