import { CajaResumen } from '../components/CajaResumen';

export const Caja = () => {
  return (
    <div className="py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Control de Movimientos de Caja
        </h1>
        <p className="text-gray-600 mt-1">
          Registra y consulta todos los movimientos de ingresos y egresos de tu negocio
        </p>
      </div>
      <CajaResumen />
    </div>
  );
};
