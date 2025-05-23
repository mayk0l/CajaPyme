import { renderHook, act, waitFor } from '@testing-library/react';
import axiosClient from '../api/axiosClient';
import { useUsuarios } from '../hooks/useUsuarios';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('../api/axiosClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockUsuarios = [
  { id: '1', nombre: 'Juan', email: 'juan@mail.com', rol: 'admin' },
  { id: '2', nombre: 'Ana', email: 'ana@mail.com', rol: 'cajero' },
];

// Helper to mock axios responses with required shape
const mockAxiosResponse = <T>(data: T) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: { url: '' },
});

type AxiosClientMock = {
  get: jest.Mock;
  post: jest.Mock;
  put: jest.Mock;
  delete: jest.Mock;
};
const axiosMock = axiosClient as unknown as AxiosClientMock;

describe('useUsuarios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches users on mount', async () => {
    axiosMock.get.mockResolvedValueOnce(mockAxiosResponse(mockUsuarios));
    const { result } = renderHook(() => useUsuarios());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.usuarios).toEqual(mockUsuarios);
    expect(result.current.error).toBe('');
  });

  it('handles fetch error', async () => {
    axiosMock.get.mockRejectedValueOnce(new Error('fail'));
    const { result } = renderHook(() => useUsuarios());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.error).toBe('No se pudieron cargar los usuarios.');
  });

  it('creates a user', async () => {
    axiosMock.post.mockResolvedValueOnce(mockAxiosResponse(mockUsuarios[0]));
    const { result } = renderHook(() => useUsuarios());
    await act(async () => {
      await result.current.crearUsuario({ nombre: 'Juan', email: 'juan@mail.com', password: '123456', rol: 'admin' });
    });
    expect(result.current.usuarios[0]).toEqual(mockUsuarios[0]);
  });

  it('edits a user', async () => {
    axiosMock.get.mockResolvedValueOnce(mockAxiosResponse(mockUsuarios));
    axiosMock.put.mockResolvedValueOnce(mockAxiosResponse({ ...mockUsuarios[0], nombre: 'Juan Editado' }));
    const { result } = renderHook(() => useUsuarios());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    await act(async () => {
      await result.current.editarUsuario('1', { nombre: 'Juan Editado', email: 'juan@mail.com', rol: 'admin' });
    });
    expect(result.current.usuarios[0].nombre).toBe('Juan Editado');
  });

  it('deletes a user', async () => {
    axiosMock.get.mockResolvedValueOnce(mockAxiosResponse(mockUsuarios));
    axiosMock.delete.mockResolvedValueOnce(mockAxiosResponse({}));
    const { result } = renderHook(() => useUsuarios());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    await act(async () => {
      await result.current.eliminarUsuario('1');
    });
    expect(result.current.usuarios.length).toBe(1);
    expect(result.current.usuarios[0].id).toBe('2');
  });
});
