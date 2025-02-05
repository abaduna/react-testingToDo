import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../pages/Home';
import { useFetch } from '../hooks/useFetch';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('../hooks/useFetch');

describe('Home Component', () => {
  const mockFetchData = vi.fn();

  beforeEach(() => {
    useFetch.mockReturnValue({
      data: null,
      error: null,
      loading: false,
      fetchData: mockFetchData,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza todos los elementos del formulario', () => {
    render(<Home />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/completed/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
  });

  test('envía el formulario con datos correctos', () => {
    render(<Home />);
  
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Tarea de prueba' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Descripción de prueba' } });
    fireEvent.click(screen.getByLabelText(/completed/i));
    fireEvent.change(screen.getByLabelText(/due date/i), { target: { value: '2024-05-24T12:00' } });
  
    fireEvent.click(screen.getByRole('button', { name: /create task/i }));
  
    expect(mockFetchData).toHaveBeenCalledWith(
      'http://localhost:8080/api/tasks',
      'POST',
      {
        title: 'Tarea de prueba',
        description: 'Descripción de prueba',
        completed: true,
        dueDate: new Date('2024-05-24T12:00').toISOString(),
      }
    );
  });

  test('deshabilita el botón al cargar', () => {
    useFetch.mockReturnValue({
      data: null,
      error: null,
      loading: true,
      fetchData: mockFetchData,
    });
  
    render(<Home />);
    const submitButton = screen.getByRole('button', { name: /sending.../i });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Sending...');
  });

  test('muestra mensaje de error', () => {
    const errorMessage = 'Error de red';
    useFetch.mockReturnValue({
      data: null,
      error: { message: errorMessage },
      loading: false,
      fetchData: mockFetchData,
    });
  
    render(<Home />);
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });
  
  test('muestra mensaje de éxito', () => {
    useFetch.mockReturnValue({
      data: { id: 1 },
      error: null,
      loading: false,
      fetchData: mockFetchData,
    });
  
    render(<Home />);
    expect(screen.getByText(/task created successfully/i)).toBeInTheDocument();
  });

  test('envía el formulario sin fecha de vencimiento', () => {
    render(<Home />);
  
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Tarea sin fecha' } });
    fireEvent.click(screen.getByRole('button', { name: /create task/i }));
  
    expect(mockFetchData).toHaveBeenCalledWith(
      'http://localhost:8080/api/tasks',
      'POST',
      expect.objectContaining({
        title: 'Tarea sin fecha',
        dueDate: null,
      })
    );
  });
});