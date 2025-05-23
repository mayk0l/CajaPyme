import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: string;
}

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsuarios();
    // eslint-disable-next-line
  }, []);

  const fetchUsuarios = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosClient.get<Usuario[]>('/admin/usuarios');
      setUsuarios(res.data);
    } catch {
      setError('No se pudieron cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  const crearUsuario = async (nuevoUsuario: Omit<Usuario, 'id'> & { password: string }) => {
    try {
      const res = await axiosClient.post<Usuario>('/auth/register', nuevoUsuario);
      setUsuarios((prev) => [...prev, res.data]);
      toast.success('Usuario creado correctamente');
      return res.data;
    } catch {
      toast.error('Error al crear usuario');
      throw new Error('Error al crear usuario');
    }
  };

  const editarUsuario = async (id: string, editUsuario: Omit<Usuario, 'id'>) => {
    try {
      const res = await axiosClient.put<Usuario>(`/admin/usuarios/${id}`, editUsuario);
      setUsuarios((prev) => prev.map((u) => (u.id === id ? res.data : u)));
      toast.success('Usuario editado correctamente');
      return res.data;
    } catch {
      toast.error('Error al editar usuario');
      throw new Error('Error al editar usuario');
    }
  };

  const eliminarUsuario = async (id: string) => {
    setEliminandoId(id);
    try {
      await axiosClient.delete(`/admin/usuarios/${id}`);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      toast.success('Usuario eliminado correctamente');
    } catch {
      toast.error('Error al eliminar usuario');
      throw new Error('Error al eliminar usuario');
    } finally {
      setEliminandoId(null);
    }
  };

  return {
    usuarios,
    loading,
    error,
    eliminandoId,
    fetchUsuarios,
    crearUsuario,
    editarUsuario,
    eliminarUsuario,
    setUsuarios,
  };
}
