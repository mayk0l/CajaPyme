import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';
import type { Movimiento, } from '../store/useStore';

export function useMovimientosCaja() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMovimientos();
  }, []);

  const fetchMovimientos = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosClient.get<Movimiento[]>('/movimientos');
      setMovimientos(res.data);
    } catch {
      setError('No se pudieron cargar los movimientos.');
    } finally {
      setLoading(false);
    }
  };

  const crearMovimiento = async (nuevo: Omit<Movimiento, 'id'>) => {
    try {
      const res = await axiosClient.post<Movimiento>('/movimientos', nuevo);
      setMovimientos((prev) => [res.data, ...prev]);
      toast.success('Movimiento creado correctamente');
      return res.data;
    } catch {
      toast.error('Error al crear movimiento');
      throw new Error('Error al crear movimiento');
    }
  };

  const editarMovimiento = async (id: string, cambios: Partial<Movimiento>) => {
    try {
      const res = await axiosClient.put<Movimiento>(`/movimientos/${id}`, cambios);
      setMovimientos((prev) => prev.map((m) => (String(m.id) === String(id) ? res.data : m)));
      toast.success('Movimiento editado correctamente');
      return res.data;
    } catch {
      toast.error('Error al editar movimiento');
      throw new Error('Error al editar movimiento');
    }
  };

  const eliminarMovimiento = async (id: string) => {
    try {
      await axiosClient.delete(`/movimientos/${id}`);
      setMovimientos((prev) => prev.filter((m) => String(m.id) !== String(id)));
      toast.success('Movimiento eliminado correctamente');
    } catch {
      toast.error('Error al eliminar movimiento');
      throw new Error('Error al eliminar movimiento');
    }
  };

  return {
    movimientos,
    loading,
    error,
    fetchMovimientos,
    crearMovimiento,
    editarMovimiento,
    eliminarMovimiento,
    setMovimientos,
  };
}
