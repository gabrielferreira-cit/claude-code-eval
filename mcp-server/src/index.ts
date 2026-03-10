import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

import { getSchema } from './tools/getSchema.js';
import { queryTasks, type QueryTasksInput } from './tools/queryTasks.js';
import { explainQuery } from './tools/explainQuery.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dbPath = process.env.DB_PATH ?? path.join(__dirname, '../../services/api/data/tasks.db');

const db = new Database(dbPath, { readonly: true });

const server = new Server({ name: 'taskdb', version: '0.0.1' }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'query_tasks',
      description:
        'Query tasks from the database. Optionally filter by status, limit results, and sort.',
      inputSchema: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['pending', 'processing', 'done', 'failed'],
            description: 'Filter by task status. Omit to return all.',
          },
          limit: {
            type: 'number',
            description: 'Maximum rows to return (1–100). Default: 20.',
          },
          order_by: {
            type: 'string',
            enum: ['created_at', 'updated_at', 'id'],
            description: 'Column to sort by (descending). Default: created_at.',
          },
        },
        required: [],
      },
    },
    {
      name: 'get_schema',
      description: 'Return the CREATE TABLE statements for all tables in the database.',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
    {
      name: 'explain_query',
      description: 'Run EXPLAIN QUERY PLAN on a SELECT statement to understand query performance.',
      inputSchema: {
        type: 'object',
        properties: {
          sql: {
            type: 'string',
            description: 'A SQL SELECT statement to explain. Must start with SELECT.',
          },
        },
        required: ['sql'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;

  try {
    if (name === 'get_schema') {
      const result = getSchema(db);
      return { content: [{ type: 'text', text: result }] };
    }

    if (name === 'query_tasks') {
      const rows = queryTasks(db, (args ?? {}) as QueryTasksInput);
      return { content: [{ type: 'text', text: JSON.stringify(rows, null, 2) }] };
    }

    if (name === 'explain_query') {
      const sql = (args as { sql: string }).sql;
      const plan = explainQuery(db, sql);
      return { content: [{ type: 'text', text: JSON.stringify(plan, null, 2) }] };
    }

    return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { content: [{ type: 'text', text: `Error: ${message}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
