import type Database from 'better-sqlite3';

export function explainQuery(db: Database.Database, sql: string): object[] {
  const trimmed = sql.trim();
  if (!trimmed.toUpperCase().startsWith('SELECT')) {
    throw new Error('Only SELECT statements are allowed in explain_query.');
  }
  return db.prepare(`EXPLAIN QUERY PLAN ${trimmed}`).all() as object[];
}
