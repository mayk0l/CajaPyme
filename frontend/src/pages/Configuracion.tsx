import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import { useConfigStore } from '../store/configStore';

export const Configuracion = () => {
  const { usuario, logout } = useAuthStore();
  const configStore = useConfigStore();
  const rol = useAuthStore((state) => state.rol);
  
  // Estado local para la configuración
  const [nombreEmpresa, setNombreEmpresa] = useState(configStore.nombreEmpresa || 'CajaPyme');
  const [rut, setRut] = useState(configStore.rut || '');
  const [direccion, setDireccion] = useState(configStore.direccion || '');
  const [telefono, setTelefono] = useState(configStore.telefono || '');
  const [email, setEmail] = useState(configStore.email || '');
  const [tema, setTema] = useState('default');
  const [toast, setToast] = useState('');
  
  // Cargar configuración del store al iniciar
  useEffect(() => {
    setNombreEmpresa(configStore.nombreEmpresa);
    setRut(configStore.rut);
    setDireccion(configStore.direccion);
    setTelefono(configStore.telefono);
    setEmail(configStore.email);
  }, [configStore]);
  
  // Guardar la configuración
  const guardarConfiguracion = () => {
    configStore.setNombreEmpresa(nombreEmpresa);
    configStore.setRut(rut);
    configStore.setDireccion(direccion);
    configStore.setTelefono(telefono);
    configStore.setEmail(email);
    
    setToast('Configuración guardada correctamente');
    setTimeout(() => setToast(''), 2000);
  };
  
  return (
    <div className="animate-fade-in space-y-6">
      {/* Toast de notificación */}
      {toast && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in transition-opacity">
          {toast}
        </div>
      )}
      
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
          <svg className="h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Configuración
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Perfil de Usuario */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden md:col-span-1">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
            <h3 className="text-white text-lg font-semibold">Perfil de Usuario</h3>
          </div>
          <div className="p-6">
            <div className="flex flex-col items-center pb-6 border-b border-gray-200">
              <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-2xl font-bold mb-3">
                {usuario?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-800 mb-1">{usuario}</p>
                <p className="text-sm text-gray-500">{rol === 'admin' ? 'Administrador' : rol === 'cajero' ? 'Cajero' : 'Usuario'}</p>
              </div>
            </div>
            
            <div className="pt-4">
              <button
                onClick={logout}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" />
                </svg>
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
        
        {/* Configuración de Negocio */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden md:col-span-2">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
            <h3 className="text-white text-lg font-semibold">Datos de la Empresa</h3>
          </div>
          <div className="p-6">
            <div className="space-y-5">
              <div>
                <label htmlFor="nombreEmpresa" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Empresa
                </label>
                <input 
                  type="text" 
                  id="nombreEmpresa"
                  value={nombreEmpresa}
                  onChange={(e) => setNombreEmpresa(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: CajaPyme SpA"
                />
              </div>
              
              <div>
                <label htmlFor="rut" className="block text-sm font-medium text-gray-700 mb-1">
                  RUT
                </label>
                <input 
                  type="text" 
                  id="rut"
                  value={rut}
                  onChange={(e) => setRut(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 76.123.456-7"
                />
              </div>
              
              <div>
                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input 
                  type="text" 
                  id="direccion"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Av. Providencia 1234, Santiago"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input 
                    type="text" 
                    id="telefono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: +56 2 2123 4567"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input 
                    type="email" 
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: contacto@cajapyme.cl"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="tema" className="block text-sm font-medium text-gray-700 mb-1">
                  Tema de la Aplicación
                </label>
                <select
                  id="tema"
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="default">Azul (Por defecto)</option>
                  <option value="green">Verde</option>
                  <option value="purple">Morado</option>
                  <option value="gray">Gris</option>
                </select>
              </div>
              
              <div className="pt-4 mt-2 border-t border-gray-200">
                <button 
                  onClick={guardarConfiguracion}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Guardar Configuración
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Características próximas */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Próximamente
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center text-blue-600 mb-2">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h4 className="font-medium">Informes avanzados</h4>
            </div>
            <p className="text-sm text-gray-600">Genera reportes detallados y gráficos para analizar tus finanzas.</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center text-blue-600 mb-2">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h4 className="font-medium">Seguridad mejorada</h4>
            </div>
            <p className="text-sm text-gray-600">Verificación en dos pasos y control de acceso por roles.</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center text-blue-600 mb-2">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h4 className="font-medium">Métricas financieras</h4>
            </div>
            <p className="text-sm text-gray-600">Tendencias y proyecciones para mejores decisiones financieras.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
