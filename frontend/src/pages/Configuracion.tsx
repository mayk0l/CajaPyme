import useAuthStore from '../store/authStore';

export const Configuracion = () => {
  const { usuario, logout } = useAuthStore();
  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
        <svg className="h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        Configuración del usuario
      </h2>
      <div className="mb-6">
        <div className="text-gray-700 mb-2">Usuario actual:</div>
        <div className="font-semibold text-blue-700 mb-4">{usuario}</div>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold shadow"
        >
          Cerrar sesión
        </button>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-blue-700 mb-2">Opciones del negocio</h3>
        <ul className="list-disc pl-6 text-gray-700 text-sm">
          <li>Próximamente: Configuración de nombre y datos del negocio</li>
          <li>Próximamente: Cambiar contraseña</li>
          <li>Próximamente: Personalización de la app</li>
        </ul>
      </div>
    </div>
  );
};
