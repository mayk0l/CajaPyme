import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RutaPrivada from './components/RutaPrivada';

import { MainLayout } from './layouts/MainLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Caja } from './pages/Caja';
import { Configuracion } from './pages/Configuracion';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<RutaPrivada />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/caja" element={<Caja />} />
            <Route path="/configuracion" element={<Configuracion />} />
          </Route>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
