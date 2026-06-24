import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import api, { setUnauthorizedHandler } from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socketService';

const AuthContext = createContext(null);
const TOKEN_STORAGE_KEY = 'token';

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
        const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);

        if (storedToken) {
          const decodedUser = decodeJwtUser(storedToken);

          if (decodedUser) {
            setToken(storedToken);
            setUser(decodedUser);
            connectSocket({ token: storedToken, email: decodedUser.email });
          } else {
            await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
          }
        }
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      disconnectSocket();
      setToken(null);
      setUser(null);
    });

    return () => setUnauthorizedHandler(null);
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    const receivedToken = response.data?.token;

    if (!receivedToken) {
      throw new Error('Login failed. No token was returned by the server.');
    }

    const authenticatedUser = decodeJwtUser(receivedToken) || { email };

    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, receivedToken);
    setToken(receivedToken);
    setUser(authenticatedUser);
    connectSocket({ token: receivedToken, email: authenticatedUser.email || email });

    return authenticatedUser;
  }, []);

  const register = useCallback(async (details) => {
    const response = await api.post('/users/register', details);
    return response.data;
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    disconnectSocket();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [user, token, loading, login, register, logout]
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
