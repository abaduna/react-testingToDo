import { renderHook, act } from '@testing-library/react';
import { useFetch } from '../hooks/useFetch';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
describe('useFetch Hook', () => {
  let mockAxios;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  test('fetches data successfully on mount if initialUrl is provided', async () => {
    mockAxios.onGet('http://localhost:8080/api/tasks').reply(200, [{ id: 1, title: 'Test Task' }]);

    const { result } = renderHook(() => useFetch('http://localhost:8080/api/tasks'));

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0)); // Espera la resolución del fetch
    });

    expect(result.current.data).toEqual([{ id: 1, title: 'Test Task' }]);
    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(false);
  });

  test('handles fetch error correctly', async () => {
    mockAxios.onGet('http://localhost:8080/api/tasks').reply(500);

    const { result } = renderHook(() => useFetch('http://localhost:8080/api/tasks'));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).not.toBe(null);
    expect(result.current.loading).toBe(false);
  });

  test('fetchData function works when called manually', async () => {
    mockAxios.onGet('http://localhost:8080/api/tasks').reply(200, [{ id: 2, title: 'Another Task' }]);

    const { result } = renderHook(() => useFetch());

    await act(async () => {
      await result.current.fetchData('http://localhost:8080/api/tasks');
    });

    expect(result.current.data).toEqual([{ id: 2, title: 'Another Task' }]);
    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(false);
  });

  test('fetchData handles POST requests correctly', async () => {
    mockAxios.onPost('http://localhost:8080/api/tasks').reply(201, { id: 3, title: 'New Task' });

    const { result } = renderHook(() => useFetch());

    await act(async () => {
      await result.current.fetchData('http://localhost:8080/api/tasks', 'POST', { title: 'New Task' });
    });

    expect(result.current.data).toEqual({ id: 3, title: 'New Task' });
  });

  test('fetchData handles DELETE requests correctly', async () => {
    mockAxios.onDelete('http://localhost:8080/api/tasks/1').reply(204);

    const { result } = renderHook(() => useFetch());

    await act(async () => {
      await result.current.fetchData('http://localhost:8080/api/tasks/1', 'DELETE');
    });

    expect(result.current.data).toBe(undefined);
  });

  test('fetchData handles PATCH requests correctly', async () => {
    mockAxios.onPatch('http://localhost:8080/api/tasks/1').reply(200, { id: 1, title: 'Updated Task' });

    const { result } = renderHook(() => useFetch());

    await act(async () => {
      await result.current.fetchData('http://localhost:8080/api/tasks/1', 'PATCH', { title: 'Updated Task' });
    });

    expect(result.current.data).toEqual({ id: 1, title: 'Updated Task' });
  });

  test('does not fetch data on mount if no initialUrl is provided', () => {
    const { result } = renderHook(() => useFetch());

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(false);
  });
});
