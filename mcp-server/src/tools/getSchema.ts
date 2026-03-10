import type Database from 'better-sqlite3';

interface TableRow {
  name: string;
  sql: string;
}

export function getSchema(db: Database.Database): string {
  const tables = db
    .prepare("SELECT name, sql FROM sqlite_master WHERE type='table' ORDER BY name")
    .all() as TableRow[];

  if (tables.length === 0) {
    return 'No tables found.';
  }

  return tables.map((t) => `-- Table: ${t.name}\n${t.sql};`).join('\n\n');
}
