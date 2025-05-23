import { useCajaStore } from '../store/useStore';

export const Dashboard = () => {
  const { saldo, ingresos, egresos, movimientos } = useCajaStore();
  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
        <svg className="h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9 6 9-6" /></svg>
        Dashboard - Resumen General
      </h2>
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-6 py-4 flex-1 min-w-[120px] text-center">
          <div className="text-xs text-blue-600">Saldo actual</div>
          <div className="text-2xl font-bold text-blue-900">{saldo.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 })}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg px-6 py-4 flex-1 min-w-[120px] text-center">
          <div className="text-xs text-green-600">Ingresos totales</div>
          <div className="text-xl font-semibold text-green-800">+{ingresos.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 })}</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg px-6 py-4 flex-1 min-w-[120px] text-center">
          <div className="text-xs text-red-600">Egresos totales</div>
          <div className="text-xl font-semibold text-red-800">-{egresos.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 })}</div>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-blue-700 mb-2">Últimos movimientos</h3>
        <ul className="divide-y divide-gray-200">
          {movimientos.slice(0, 5).map((mov) => (
            <li key={mov.id} className="py-2 flex items-center justify-between">
              <span className={mov.tipo === 'ingreso' ? 'text-green-700 font-semibold' : 'text-red-700 font-semibold'}>
                {mov.tipo === 'ingreso' ? '+ ' : '- '}
                {mov.monto.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 })}
              </span>
              <span className="text-gray-700 flex-1 mx-2 truncate">{mov.descripcion}</span>
              <span className="text-xs text-gray-400">{new Date(mov.fecha).toLocaleString()}</span>
            </li>
          ))}
          {movimientos.length === 0 && (
            <li className="py-2 text-gray-400 text-center">Sin movimientos recientes</li>
          )}
        </ul>
      </div>
    </div>
  );
};
