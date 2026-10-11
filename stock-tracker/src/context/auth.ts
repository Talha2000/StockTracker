import { createContext, useContext } from 'react';

export type LoginResult = { ok: true } | { ok: false; error: string };

export interface AuthContextValue {
  isAuthenticated: boolean;
  // True only during the initial mount check (a GET /users/me to see if the
  // httpOnly session cookie is still valid) — consumers that gate on
  // isAuthenticated should wait for this to settle, or a logged-in user
  // doing a hard refresh briefly looks logged out and gets bounced to /login.
  isLoading: boolean;
  login: (input: { username: string; password: string }) => Promise<LoginResult>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = (): AuthContextValue => {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within AuthProvider');
  return value;
};
