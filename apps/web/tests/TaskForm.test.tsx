import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskForm } from '../src/components/TaskForm.js';

describe('TaskForm', () => {
  it('renders title input and submit button', () => {
    render(<TaskForm onSubmit={vi.fn()} />);
    expect(screen.getByPlaceholderText(/task title/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('renders priority select with low/medium/high options', () => {
    render(<TaskForm onSubmit={vi.fn()} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('medium');
    expect(screen.getByRole('option', { name: 'low' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'medium' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'high' })).toBeInTheDocument();
  });

  it('calls onSubmit with title and default priority when submitted', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<TaskForm onSubmit={onSubmit} />);
    fireEvent.change(screen.getByPlaceholderText(/task title/i), {
      target: { value: 'My new task' },
    });
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    expect(onSubmit).toHaveBeenCalledWith({
      title: 'My new task',
      description: undefined,
      priority: 'medium',
    });
  });

  it('does not submit when title is empty', () => {
    const onSubmit = vi.fn();
    render(<TaskForm onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('resets fields after successful submit', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<TaskForm onSubmit={onSubmit} />);
    const titleInput = screen.getByPlaceholderText(/task title/i);
    fireEvent.change(titleInput, { target: { value: 'Some task' } });
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(titleInput).toHaveValue('');
  });
});
