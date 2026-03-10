export type TaskStatus = 'pending' | 'processing' | 'done' | 'failed';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
  // NOTE: `priority` field is intentionally absent.
  // Adding it is the "Feature Implementation" workflow demo.
}

export interface CreateTaskBody {
  title: string;
  description?: string;
}

export interface UpdateTaskBody {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

export type ApiResponse<T> = { data: T } | { error: string };
