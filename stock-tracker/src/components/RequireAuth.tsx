import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/context/auth';

export const RequireAuth = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
