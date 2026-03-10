import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createDb(dbPath?: string): Database.Database {
  const resolvedPath = dbPath ?? path.join(__dirname, '../../data/tasks.db');
  const dir = path.dirname(resolvedPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const db = new Database(resolvedPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT    NOT NULL,
      description TEXT,
      status      TEXT    NOT NULL DEFAULT 'pending'
                          CHECK(status IN ('pending', 'processing', 'done', 'failed')),
      priority    TEXT    NOT NULL DEFAULT 'medium'
                          CHECK(priority IN ('low', 'medium', 'high')),
      created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TRIGGER IF NOT EXISTS tasks_updated_at
    AFTER UPDATE ON tasks
    BEGIN
      UPDATE tasks SET updated_at = datetime('now') WHERE id = NEW.id;
    END;
  `);

  const cols = db.pragma('table_info(tasks)') as { name: string }[];
  if (!cols.some((c) => c.name === 'priority')) {
    db.exec(
      "ALTER TABLE tasks ADD COLUMN priority TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high'))"
    );
  }

  return db;
}

// Singleton for the running server; tests create their own instances
let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = createDb();
  }
  return _db;
}
