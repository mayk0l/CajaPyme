import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const RutaPrivada = () => {
  const estaAutenticado = useAuthStore((state) => state.isAuthenticated);
  return estaAutenticado ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RutaPrivada;
