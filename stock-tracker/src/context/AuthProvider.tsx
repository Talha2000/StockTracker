import { useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext, type AuthContextValue } from './auth';
import { authApi, setUnauthorizedHandler } from '@/lib/api';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const clearSession = useCallback(() => {
    setAuthenticated(false);
    queryClient.clear();
  }, [queryClient]);

  // The client has no way to read an httpOnly cookie, so the only way to
  // know if a session is already active (e.g. a hard refresh) is to ask the
  // API. Replaces the old sessionStorage-token check, which could answer
  // this synchronously but kept the token somewhere page JS could read it.
  useEffect(() => {
    authApi
      .me()
      .then(() => {
        setAuthenticated(true);
      })
      .catch(() => {
        setAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // An expired or invalid session on any later request sends the user back to login.
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
      await authApi.login(input);
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
    () => ({ isAuthenticated, isLoading, login, logout }),
    [isAuthenticated, isLoading, login, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
};
