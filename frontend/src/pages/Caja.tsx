import { Helmet } from 'react-helmet';
import { CajaResumen } from '../components/CajaResumen';

export const Caja = () => {
  return (
    <>
      <Helmet>
        <title>CajaPyme | Caja</title>
        <meta name="description" content="Gestiona ingresos y egresos diarios de tu PYME con CajaPyme. Control de caja fácil, rápido y seguro." />
        <meta name="keywords" content="CajaPyme, caja, ingresos, egresos, finanzas, pymes, gestión, chile" />
        <meta property="og:title" content="CajaPyme | Caja" />
        <meta property="og:description" content="Gestiona ingresos y egresos diarios de tu PYME con CajaPyme." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://caja-pyme.vercel.app/caja" />
        <meta property="og:site_name" content="CajaPyme" />
      </Helmet>
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
    </>
  );
};
