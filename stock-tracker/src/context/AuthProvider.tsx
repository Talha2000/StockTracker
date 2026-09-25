import { useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext, type AuthContextValue } from './auth';
import { authApi, setUnauthorizedHandler } from '@/lib/api';
import { getToken, setToken } from '@/lib/session';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setAuthenticated] = useState(() => getToken() !== null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const clearSession = useCallback(() => {
    setToken(null);
    setAuthenticated(false);
    queryClient.clear();
  }, [queryClient]);

  // An expired or invalid token on any request sends the user back to login.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession();
      void navigate('/login');
    });
    return () => {
      setUnauthorizedHandler(null);
    };
  }, [clearSession, navigate]);

  const login = useCallback<AuthContextValue['login']>(async (input) => {
    try {
      const { token } = await authApi.login(input);
      setToken(token);
      setAuthenticated(true);
      return { ok: true };
    } catch (error) {
      const status = isAxiosError(error) ? error.response?.status : undefined;
      return {
        ok: false,
        error: status === 400 || status === 404 ? 'Incorrect credentials' : 'Failed to sign in',
      };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo(
    () => ({ isAuthenticated, login, logout }),
    [isAuthenticated, login, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
};
