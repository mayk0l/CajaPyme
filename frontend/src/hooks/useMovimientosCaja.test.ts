import { renderHook, act, waitFor } from '@testing-library/react';
import axiosClient from '../api/axiosClient';
import { useMovimientosCaja } from './useMovimientosCaja';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock axiosClient and toast (type-safe, ESM compatible)
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

const mockMovimientos = [
  { id: '1', tipo: 'ingreso', monto: 100, descripcion: 'Venta', fecha: '2025-05-23' },
  { id: '2', tipo: 'egreso', monto: 50, descripcion: 'Compra', fecha: '2025-05-23' },
];

const mockAxiosResponse = <T,>(data: T) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: { url: '' },
});

type AxiosClientMock = {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};
const axiosMock = axiosClient as unknown as AxiosClientMock;

describe('useMovimientosCaja', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches movimientos on mount', async () => {
    axiosMock.get.mockResolvedValueOnce(mockAxiosResponse(mockMovimientos));
    const { result } = renderHook(() => useMovimientosCaja());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.movimientos).toEqual(mockMovimientos);
    expect(result.current.error).toBe('');
  });

  it('handles fetch error', async () => {
    axiosMock.get.mockRejectedValueOnce(new Error('fail'));
    const { result } = renderHook(() => useMovimientosCaja());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.error).toBe('No se pudieron cargar los movimientos.');
  });

  it('creates a movimiento', async () => {
    axiosMock.post.mockResolvedValueOnce(mockAxiosResponse(mockMovimientos[0]));
    const { result } = renderHook(() => useMovimientosCaja());
    await act(async () => {
      await result.current.crearMovimiento({ tipo: 'ingreso', monto: 100, descripcion: 'Venta', fecha: '2025-05-23', categoria: 'ventas' });
    });
    expect(result.current.movimientos[0]).toEqual(mockMovimientos[0]);
  });

  it('edits a movimiento', async () => {
    axiosMock.get.mockResolvedValueOnce(mockAxiosResponse(mockMovimientos));
    axiosMock.put.mockResolvedValueOnce(mockAxiosResponse({ ...mockMovimientos[0], descripcion: 'Venta Editada' }));
    const { result } = renderHook(() => useMovimientosCaja());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    await act(async () => {
      await result.current.editarMovimiento('1', { tipo: 'ingreso', monto: 100, descripcion: 'Venta Editada', fecha: '2025-05-23' });
    });
    expect(result.current.movimientos[0].descripcion).toBe('Venta Editada');
  });

  it('deletes a movimiento', async () => {
    axiosMock.get.mockResolvedValueOnce(mockAxiosResponse(mockMovimientos));
    axiosMock.delete.mockResolvedValueOnce(mockAxiosResponse({}));
    const { result } = renderHook(() => useMovimientosCaja());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    await act(async () => {
      await result.current.eliminarMovimiento('1');
    });
    expect(result.current.movimientos.length).toBe(1);
    expect(result.current.movimientos[0].id).toBe('2');
  });
});
