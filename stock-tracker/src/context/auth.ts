import { createContext, useContext } from 'react';

export type LoginResult = { ok: true } | { ok: false; error: string };

export interface AuthContextValue {
  isAuthenticated: boolean;
  login: (input: { username: string; password: string }) => Promise<LoginResult>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = (): AuthContextValue => {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within AuthProvider');
  return value;
};
