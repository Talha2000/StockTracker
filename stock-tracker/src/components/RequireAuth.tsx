import { Navigate, Outlet } from 'react-router';
import { Spinner } from './Spinner';
import { useAuth } from '@/context/auth';

export const RequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth();
  // Wait for the initial /users/me check before deciding — otherwise a
  // logged-in user on a hard refresh briefly reads as unauthenticated (state
  // starts false until that request resolves) and gets bounced to /login.
  if (isLoading) return <Spinner label="Loading" />;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
