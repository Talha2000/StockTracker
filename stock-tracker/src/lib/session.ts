const TOKEN_KEY = 'st.token';

// sessionStorage can throw (blocked storage, private windows); the app must still render.
export const getToken = (): string | null => {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token: string | null): void => {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore: session simply will not persist across reloads
  }
};
