import { useCajaStore } from '../store/useStore';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

export const Dashboard = () => {
  const { saldo, ingresos, egresos, movimientos } = useCajaStore();
  
  const formatoCLP = (valor: number) => valor.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 });
  
  // Calcular tendencias
  const totalMovimientos = movimientos.length;
  const ingresosCount = movimientos.filter(m => m.tipo === 'ingreso').length;
  const egresosCount = movimientos.filter(m => m.tipo === 'egreso').length;
  
  // Obtener categorías más frecuentes
  const categoriaCount: Record<string, number> = {};
  movimientos.forEach(mov => {
    const cat = mov.categoria || 'general';
    categoriaCount[cat] = (categoriaCount[cat] || 0) + 1;
  });
  
  const categoriasOrdenadas = Object.keys(categoriaCount)
    .map(key => ({ categoria: key, count: categoriaCount[key] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return (
    <>
      <Helmet>
        <title>CajaPyme | Dashboard</title>
        <meta name="description" content="Dashboard de CajaPyme: visualiza el saldo, ingresos, egresos y movimientos recientes de tu PYME. Control financiero profesional y simple." />
        <meta name="keywords" content="CajaPyme, dashboard, caja, finanzas, pymes, gestión, administración, chile" />
        <meta property="og:title" content="CajaPyme | Dashboard" />
        <meta property="og:description" content="Dashboard de CajaPyme: visualiza el saldo, ingresos, egresos y movimientos recientes de tu PYME." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://caja-pyme.vercel.app/dashboard" />
        <meta property="og:site_name" content="CajaPyme" />
      </Helmet>
      
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
            <svg className="h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6" />
            </svg>
            Dashboard
          </h2>
          <Link 
            to="/caja" 
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <span>Ir a Caja</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-blue-500 transition-all hover:shadow-lg">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 7v7m-7-7h14" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo actual</p>
                  <p className="text-2xl font-bold text-blue-700">{formatoCLP(saldo)}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-green-500 transition-all hover:shadow-lg">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Ingresos totales</p>
                  <p className="text-2xl font-bold text-green-600">+{formatoCLP(ingresos)}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-red-500 transition-all hover:shadow-lg">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-100 text-red-600">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Egresos totales</p>
                  <p className="text-2xl font-bold text-red-600">-{formatoCLP(egresos)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Últimos movimientos */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Últimos movimientos
              </h3>
              <Link to="/caja" className="text-xs text-blue-600 hover:underline">Ver todos</Link>
            </div>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {movimientos.slice(0, 5).map((mov) => (
                    <tr key={mov.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-2 whitespace-nowrap">
                        {mov.tipo === 'ingreso' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Ingreso
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                            </svg>
                            Egreso
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-700 truncate max-w-[150px]">{mov.descripcion}</td>
                      <td className="px-3 py-2 text-sm font-medium text-right whitespace-nowrap">
                        <span className={mov.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'}>
                          {mov.tipo === 'ingreso' ? '+' : '-'}{formatoCLP(mov.monto)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {movimientos.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-3 py-4 text-sm text-center text-gray-500">
                        No hay movimientos registrados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Estadísticas */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Resumen de actividad
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total de movimientos</p>
                <div className="flex items-center">
                  <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: totalMovimientos > 0 ? '100%' : '0%' }}></div>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">{totalMovimientos}</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">Ingresos vs Egresos</p>
                <div className="flex items-center">
                  <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-l-full" 
                      style={{ width: totalMovimientos ? `${(ingresosCount / totalMovimientos) * 100}%` : '0%' }}></div>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {ingresosCount} / {egresosCount}
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-3">Categorías principales</p>
                <div className="space-y-2">
                  {categoriasOrdenadas.map((cat, idx) => (
                    <div key={idx} className="flex items-center">
                      <span className={`
                        inline-block w-3 h-3 rounded-full mr-2
                        ${cat.categoria === 'ventas' ? 'bg-blue-500' : ''}
                        ${cat.categoria === 'compras' ? 'bg-yellow-500' : ''}
                        ${cat.categoria === 'servicios' ? 'bg-purple-500' : ''}
                        ${cat.categoria === 'otros' ? 'bg-gray-500' : ''}
                        ${cat.categoria === 'general' ? 'bg-green-500' : ''}
                      `}></span>
                      <span className="text-sm capitalize">{cat.categoria}</span>
                      <span className="text-xs text-gray-500 ml-auto">{cat.count} mov.</span>
                    </div>
                  ))}
                  
                  {categoriasOrdenadas.length === 0 && (
                    <p className="text-sm text-gray-500">No hay datos suficientes</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
