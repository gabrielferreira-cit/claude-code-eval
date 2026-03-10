import type Database from 'better-sqlite3';

type OrderBy = 'created_at' | 'updated_at' | 'id';
type Status = 'pending' | 'processing' | 'done' | 'failed';

export interface QueryTasksInput {
  status?: Status;
  limit?: number;
  order_by?: OrderBy;
}

export function queryTasks(db: Database.Database, input: QueryTasksInput): object[] {
  const limit = Math.min(Math.max(1, input.limit ?? 20), 100);
  const orderBy = (['created_at', 'updated_at', 'id'] as const).includes(
    input.order_by as OrderBy
  )
    ? input.order_by
    : 'created_at';

  let sql = `SELECT * FROM tasks`;
  const params: unknown[] = [];

  if (input.status) {
    sql += ` WHERE status = ?`;
    params.push(input.status);
  }

  sql += ` ORDER BY ${orderBy} DESC LIMIT ?`;
  params.push(limit);

  return db.prepare(sql).all(...(params as [unknown])) as object[];
}
