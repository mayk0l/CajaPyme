import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useUsuarios } from '../hooks/useUsuarios';
import type { Usuario } from '../hooks/useUsuarios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const AdminUsuarios: React.FC = () => {
  const {
    usuarios,
    loading,
    error,
    eliminandoId,
    crearUsuario,
    editarUsuario,
    eliminarUsuario
  } = useUsuarios();

  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editUsuario, setEditUsuario] = useState({ nombre: '', email: '', rol: 'cajero' });

  const usuarioSchema = Yup.object().shape({
    nombre: Yup.string().required('El nombre es obligatorio'),
    email: Yup.string().email('Email inválido').required('El email es obligatorio'),
    password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
    rol: Yup.string().oneOf(['cajero', 'admin']).required('El rol es obligatorio'),
  });

  // Editar usuario
  const iniciarEdicion = (u: Usuario) => {
    setEditandoId(u.id);
    setEditUsuario({ nombre: u.nombre, email: u.email, rol: u.rol });
  };
  const guardarEdicion = async (id: string) => {
    try {
      await editarUsuario(id, editUsuario);
      setEditandoId(null);
    } catch {
      // Manejo de error si es necesario
    }
  };
  const cancelarEdicion = () => setEditandoId(null);

  // Eliminar usuario (con confirmación)
  const handleEliminarUsuario = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
    try {
      await eliminarUsuario(id);
      if (editandoId === id) setEditandoId(null);
    } catch {
      // Manejo de error si es necesario
    }
  };

  return (
    <>
      <Helmet>
        <title>CajaPyme | Administración de Usuarios</title>
        <meta name="description" content="Administra usuarios y roles de tu PYME con CajaPyme. Seguridad y control profesional para tu equipo." />
        <meta name="keywords" content="CajaPyme, administración, usuarios, roles, pymes, gestión, chile" />
        <meta property="og:title" content="CajaPyme | Administración de Usuarios" />
        <meta property="og:description" content="Administra usuarios y roles de tu PYME con CajaPyme." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://caja-pyme.vercel.app/admin/usuarios" />
        <meta property="og:site_name" content="CajaPyme" />
      </Helmet>
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
              {/* Formulario con Formik */}
              <Formik
                initialValues={{ nombre: '', email: '', password: '', rol: 'cajero' }}
                validationSchema={usuarioSchema}
                onSubmit={async (values, { resetForm, setSubmitting, setStatus }) => {
                  setStatus('');
                  try {
                    await crearUsuario(values);
                    resetForm();
                  } catch {
                    setStatus('Error al crear usuario');
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting, status }) => (
                  <Form className="mb-6">
                    <h2 className="font-semibold text-blue-700 mb-2">Crear nuevo usuario</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                      <div>
                        <Field name="nombre" type="text" placeholder="Nombre" className="border rounded px-2 py-1 w-full" />
                        <ErrorMessage name="nombre" component="div" className="text-red-600 text-xs" />
                      </div>
                      <div>
                        <Field name="email" type="email" placeholder="Email" className="border rounded px-2 py-1 w-full" />
                        <ErrorMessage name="email" component="div" className="text-red-600 text-xs" />
                      </div>
                      <div>
                        <Field name="password" type="password" placeholder="Contraseña" className="border rounded px-2 py-1 w-full" />
                        <ErrorMessage name="password" component="div" className="text-red-600 text-xs" />
                      </div>
                      <div>
                        <Field as="select" name="rol" className="border rounded px-2 py-1 w-full">
                          <option value="cajero">Cajero</option>
                          <option value="admin">Administrador</option>
                        </Field>
                        <ErrorMessage name="rol" component="div" className="text-red-600 text-xs" />
                      </div>
                    </div>
                    {status && <div className="text-red-600 text-sm mb-2">{status}</div>}
                    <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 flex items-center min-w-[90px]">
                      {isSubmitting ? 'Creando...' : 'Crear'}
                    </button>
                  </Form>
                )}
              </Formik>
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
                              <button className="bg-red-600 text-white px-2 py-1 rounded flex items-center justify-center min-w-[80px]" onClick={() => handleEliminarUsuario(u.id)} disabled={eliminandoId === u.id}>
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
        {/* <Toaster position="top-right" /> */}
      </div>
    </>
  );
};

export default AdminUsuarios;
