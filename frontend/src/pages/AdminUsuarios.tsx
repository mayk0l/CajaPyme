import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import toast, { Toaster } from 'react-hot-toast';

interface Usuario {
  id: string; // UUID string, no number
  nombre: string;
  email: string;
  rol: string;
}

const AdminUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: '', email: '', password: '', rol: 'cajero' });
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editUsuario, setEditUsuario] = useState({ nombre: '', email: '', rol: 'cajero' });
  const [formError, setFormError] = useState('');
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axiosClient.get<Usuario[]>('/admin/usuarios');
        setUsuarios(res.data);
      } catch {
        setError('No se pudieron cargar los usuarios.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  // Crear usuario
  const crearUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const v = validarNuevoUsuario();
    if (v) { setFormError(v); return; }
    try {
      const res = await axiosClient.post<Usuario>('/auth/register', nuevoUsuario);
      setUsuarios((prev) => [...prev, res.data]);
      setNuevoUsuario({ nombre: '', email: '', password: '', rol: 'cajero' });
      toast.success('Usuario creado correctamente');
    } catch {
      setFormError('Error al crear usuario');
      toast.error('Error al crear usuario');
    }
  };
  // Editar usuario
  const iniciarEdicion = (u: Usuario) => {
    setEditandoId(u.id);
    setEditUsuario({ nombre: u.nombre, email: u.email, rol: u.rol });
  };
  const guardarEdicion = async (id: string) => {
    setFormError('');
    const v = validarEditUsuario();
    if (v) { setFormError(v); return; }
    try {
      const res = await axiosClient.put<Usuario>(`/admin/usuarios/${id}`, editUsuario);
      setUsuarios((prev) => prev.map((u) => (u.id === id ? res.data : u)));
      setEditandoId(null);
      toast.success('Usuario editado correctamente');
    } catch {
      setFormError('Error al editar usuario');
      toast.error('Error al editar usuario');
    }
  };
  const cancelarEdicion = () => setEditandoId(null);
  const eliminarUsuario = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
    setEliminandoId(id);
    setFormError('');
    try {
      await axiosClient.delete(`/admin/usuarios/${id}`);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      if (editandoId === id) setEditandoId(null);
      toast.success('Usuario eliminado correctamente');
    } catch {
      setFormError('Error al eliminar usuario');
      toast.error('Error al eliminar usuario');
    } finally {
      setEliminandoId(null);
    }
  };

  // Validaciones adicionales para crear usuario
  const validarNuevoUsuario = () => {
    if (!nuevoUsuario.nombre.trim()) return 'El nombre es obligatorio';
    if (!nuevoUsuario.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) return 'Email inválido';
    if (nuevoUsuario.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    return '';
  };

  // Validaciones adicionales para editar usuario
  const validarEditUsuario = () => {
    if (!editUsuario.nombre.trim()) return 'El nombre es obligatorio';
    if (!editUsuario.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) return 'Email inválido';
    return '';
  };

  return (
    <div className="max-w-2xl mx-auto py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
        <svg className="h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6 3.87V4a4 4 0 10-8 0v16m8 0a4 4 0 01-8 0" />
        </svg>
        Administración de Usuarios
      </h1>
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <svg className="animate-spin h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="text-blue-700 font-medium">Cargando usuarios...</span>
          </div>
        ) : error ? (
          <div className="text-red-600 text-center py-4 font-semibold">{error}</div>
        ) : (
          <>
            <form className="mb-6" onSubmit={crearUsuario}>
              <h2 className="font-semibold text-blue-700 mb-2">Crear nuevo usuario</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                <input type="text" required placeholder="Nombre" className="border rounded px-2 py-1" value={nuevoUsuario.nombre} onChange={e => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })} />
                <input type="email" required placeholder="Email" className="border rounded px-2 py-1" value={nuevoUsuario.email} onChange={e => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })} />
                <input type="password" required placeholder="Contraseña" className="border rounded px-2 py-1" value={nuevoUsuario.password} onChange={e => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })} />
                <select className="border rounded px-2 py-1" value={nuevoUsuario.rol} onChange={e => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })}>
                  <option value="cajero">Cajero</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              {formError && <div className="text-red-600 text-sm mb-2">{formError}</div>}
              <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 flex items-center min-w-[90px]">
                Crear
              </button>
            </form>
            {/* Tabla de usuarios */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 mt-2">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="py-2 px-3 text-left font-semibold">Nombre</th>
                    <th className="py-2 px-3 text-left font-semibold">Email</th>
                    <th className="py-2 px-3 text-left font-semibold">Rol</th>
                    <th className="py-2 px-3 text-left font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.id} className="border-b last:border-b-0">
                      {editandoId === u.id ? (
                        <>
                          <td className="py-2 px-3"><input type="text" className="border rounded px-2 py-1" value={editUsuario.nombre} onChange={e => setEditUsuario({ ...editUsuario, nombre: e.target.value })} /></td>
                          <td className="py-2 px-3"><input type="email" className="border rounded px-2 py-1" value={editUsuario.email} onChange={e => setEditUsuario({ ...editUsuario, email: e.target.value })} /></td>
                          <td className="py-2 px-3">
                            <select className="border rounded px-2 py-1" value={editUsuario.rol} onChange={e => setEditUsuario({ ...editUsuario, rol: e.target.value })}>
                              <option value="cajero">Cajero</option>
                              <option value="admin">Administrador</option>
                            </select>
                          </td>
                          <td className="py-2 px-3 flex gap-2">
                            <button className="bg-green-600 text-white px-2 py-1 rounded flex items-center min-w-[90px]" onClick={() => guardarEdicion(u.id)}>
                              Guardar
                            </button>
                            <button className="bg-gray-400 text-white px-2 py-1 rounded" onClick={cancelarEdicion}>Cancelar</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-2 px-3">{u.nombre}</td>
                          <td className="py-2 px-3">{u.email}</td>
                          <td className="py-2 px-3 capitalize">{u.rol}</td>
                          <td className="py-2 px-3 flex gap-2">
                            <button className="bg-yellow-500 text-white px-2 py-1 rounded" onClick={() => iniciarEdicion(u)}>Editar</button>
                            <button className="bg-red-600 text-white px-2 py-1 rounded flex items-center justify-center min-w-[80px]" onClick={() => eliminarUsuario(u.id)} disabled={eliminandoId === u.id}>
                              {eliminandoId === u.id ? (
                                <svg className="animate-spin h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                              ) : null}
                              Eliminar
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default AdminUsuarios;
