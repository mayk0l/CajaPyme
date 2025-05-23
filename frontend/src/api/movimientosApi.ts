import axiosClient from './axiosClient';
import type { Movimiento } from '../store/useStore';

export async function obtenerMovimientos(): Promise<Movimiento[]> {
  const res = await axiosClient.get('/movimientos');
  // Asegura que siempre retorna un array, aunque el backend retorne null o undefined
  return Array.isArray(res.data) ? res.data : [];
}

export async function agregarMovimiento(mov: Movimiento): Promise<void> {
  await axiosClient.post('/movimientos', mov);
}

export async function editarMovimiento(id: string, cambios: Partial<Movimiento>): Promise<void> {
  // Suponiendo que hay un endpoint PUT /movimientos/:id
  await axiosClient.put(`/movimientos/${id}`, cambios);
}

export async function eliminarMovimientoApi(id: string): Promise<void> {
  // Suponiendo que hay un endpoint DELETE /movimientos/:id
  await axiosClient.delete(`/movimientos/${id}`);
}
