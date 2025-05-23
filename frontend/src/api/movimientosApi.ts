import axiosClient from './axiosClient';
import type { Movimiento } from '../store/useStore';

// Nuevo tipo para alta de movimiento (sin id)
export type MovimientoInput = Omit<Movimiento, 'id'> & { categoria: string };

export async function obtenerMovimientos(): Promise<Movimiento[]> {
  const res = await axiosClient.get('/movimientos');
  // Asegura que siempre retorna un array, aunque el backend retorne null o undefined
  return Array.isArray(res.data) ? res.data : [];
}

export async function agregarMovimiento(mov: MovimientoInput): Promise<void> {
  await axiosClient.post('/movimientos', mov);
}

export async function editarMovimiento(id: number, cambios: Partial<Movimiento> & { categoria?: string }): Promise<void> {
  // Suponiendo que hay un endpoint PUT /movimientos/:id
  await axiosClient.put(`/movimientos/${id}`, cambios);
}

export async function eliminarMovimientoApi(id: number): Promise<void> {
  // Suponiendo que hay un endpoint DELETE /movimientos/:id
  await axiosClient.delete(`/movimientos/${id}`);
}

export type { Movimiento } from '../store/useStore';
