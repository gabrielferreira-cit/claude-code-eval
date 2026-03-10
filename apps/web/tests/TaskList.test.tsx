import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { Task } from '@claude-eval/shared';
import { TaskList } from '../src/components/TaskList.js';

const baseTask: Task = {
  id: 1,
  title: 'Test task',
  description: null,
  status: 'pending',
  priority: 'medium',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

describe('TaskList', () => {
  it('renders empty state when no tasks', () => {
    render(<TaskList tasks={[]} onDelete={vi.fn()} onStatusChange={vi.fn()} />);
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
  });

  it('renders task title and priority', () => {
    render(<TaskList tasks={[baseTask]} onDelete={vi.fn()} onStatusChange={vi.fn()} />);
    expect(screen.getByText('Test task')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
  });

  it('renders task description when present', () => {
    const task = { ...baseTask, description: 'Some details' };
    render(<TaskList tasks={[task]} onDelete={vi.fn()} onStatusChange={vi.fn()} />);
    expect(screen.getByText('Some details')).toBeInTheDocument();
  });

  it('calls onDelete with task id when delete button is clicked', () => {
    const onDelete = vi.fn();
    render(<TaskList tasks={[baseTask]} onDelete={onDelete} onStatusChange={vi.fn()} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('calls onStatusChange when status select changes', () => {
    const onStatusChange = vi.fn();
    render(<TaskList tasks={[baseTask]} onDelete={vi.fn()} onStatusChange={onStatusChange} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'done' } });
    expect(onStatusChange).toHaveBeenCalledWith(1, 'done');
  });
});
