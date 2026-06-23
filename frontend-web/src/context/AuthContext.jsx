import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

function decodeJwtUser(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null;
    }

    return {
      email: payload.sub || payload.email || '',
    };
  } catch (error) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      const decodedUser = decodeJwtUser(storedToken);

      if (decodedUser) {
        setToken(storedToken);
        setUser(decodedUser);
      } else {
        localStorage.removeItem('token');
      }
    }

    setLoading(false);
  }, []);

  const login = (newToken, userData = null) => {
    const authenticatedUser = userData || decodeJwtUser(newToken);

    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(authenticatedUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export default AuthContext;
