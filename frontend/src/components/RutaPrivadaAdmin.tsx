import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

interface RutaPrivadaAdminProps {
  requiredRole?: string;
}

const RutaPrivadaAdmin = ({ requiredRole = 'admin' }: RutaPrivadaAdminProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const rol = useAuthStore((state) => state.rol);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (rol !== requiredRole) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};

export default RutaPrivadaAdmin;
