import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ListView from '../pages/ListView';
import { useFetch } from '../hooks/useFetch';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('../hooks/useFetch');

describe('ListView Component', () => {
  const mockFetchData = vi.fn();

  beforeEach(() => {
    useFetch.mockReturnValue({
      data: [
        {
          id: 1,
          title: 'Test Task',
          description: 'This is a test task',
          completed: false,
          dueDate: '2024-05-24T12:00',
        },
      ],
      error: null,
      loading: false,
      fetchData: mockFetchData,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders task list correctly', () => {
    render(<ListView />);
    expect(screen.getByText(/lists/i)).toBeInTheDocument();
    expect(screen.getAllByText(/test task/i)).toHaveLength(2);
    expect(screen.getByText(/this is a test task/i)).toBeInTheDocument();
  });

  test('handles task edit', () => {
    render(<ListView />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(screen.getByText(/edit task/i)).toBeInTheDocument();
  });

  test('handles task delete', () => {
    render(<ListView />);
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(mockFetchData).toHaveBeenCalledWith('http://localhost:8080/api/tasks/1', 'DELETE');
  });

  test('handles mark as done', () => {
    render(<ListView />);
    fireEvent.click(screen.getByRole('button', { name: /mark as done/i }));
    expect(mockFetchData).toHaveBeenCalledWith('http://localhost:8080/api/tasks/1/complete', 'PATCH', { completed: true });
  });

  test('shows loading state', () => {
    useFetch.mockReturnValue({ data: null, error: null, loading: true, fetchData: mockFetchData });
    render(<ListView />);
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  test('shows error message', () => {
    useFetch.mockReturnValue({ data: null, error: { message: 'Error fetching data' }, loading: false, fetchData: mockFetchData });
    render(<ListView />);
    expect(screen.getByText(/error: error fetching data/i)).toBeInTheDocument();
  });
});
