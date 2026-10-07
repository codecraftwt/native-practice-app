import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  STORAGE_KEYS,
  apiFetch,
  clearAuthTokens,
  clearPersistedTokens,
  persistTokens,
  readBody,
  setAuthTokens,
  setSessionExpiredHandler,
} from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    setSessionExpiredHandler(() => {
      clearAuthTokens();
      setUser(null);
    });

    const restore = async () => {
      try {
        const stored = await AsyncStorage.getMany([STORAGE_KEYS.ACCESS, STORAGE_KEYS.REFRESH]);
        const access = stored[STORAGE_KEYS.ACCESS];
        const refresh = stored[STORAGE_KEYS.REFRESH];
        if (!access || !refresh) return;
        setAuthTokens(access, refresh);
        const res = await apiFetch('/auth/me');
        if (res.ok) {
          const json = await readBody(res);
          setUser(json.data.user);
        } else {
          clearAuthTokens();
          await clearPersistedTokens();
        }
      } catch (e) {
        console.warn('Session restore failed:', e?.message);
        clearAuthTokens();
        await clearPersistedTokens().catch(() => {});
      } finally {
        setIsRestoring(false);
      }
    };

    restore();
    return () => setSessionExpiredHandler(null);
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      auth: false,
      body: { email, password },
    });
    const json = await readBody(res);
    if (!res.ok) {
      throw new Error(json?.error?.message || 'Login failed. Please try again.');
    }
    setAuthTokens(json.data.accessToken, json.data.refreshToken);
    await persistTokens(json.data.accessToken, json.data.refreshToken);
    setUser(json.data.user);
    return json.data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch {
      // best effort - local session is cleared regardless
    }
    clearAuthTokens();
    await clearPersistedTokens();
    setUser(null);
  }, []);

  const value = { user, isRestoring, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
