import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

function decodeJwtUser(token) {
  try {
    const decodedPayload = jwtDecode(token);

    if (decodedPayload.exp && decodedPayload.exp * 1000 < Date.now()) {
      return null;
    }

    return {
      email: decodedPayload.sub || decodedPayload.email || '',
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
    async function restoreSession() {
      try {
        const storedToken = await AsyncStorage.getItem('token');

        if (storedToken) {
          const decodedUser = decodeJwtUser(storedToken);

          if (decodedUser) {
            setToken(storedToken);
            setUser(decodedUser);
          } else {
            await AsyncStorage.removeItem('token');
          }
        }
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = async (newToken, userData = null) => {
    await AsyncStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData || decodeJwtUser(newToken));
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
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
