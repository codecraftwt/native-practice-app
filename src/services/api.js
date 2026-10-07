import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

export const STORAGE_KEYS = {
  ACCESS: 'dineflow.accessToken',
  REFRESH: 'dineflow.refreshToken',
};

let accessToken = null;
let refreshToken = null;
let sessionExpiredHandler = null;

export const setAuthTokens = (access, refresh) => {
  accessToken = access;
  refreshToken = refresh;
};

export const clearAuthTokens = () => {
  accessToken = null;
  refreshToken = null;
};

export const setSessionExpiredHandler = (handler) => {
  sessionExpiredHandler = handler;
};

export const persistTokens = async (access, refresh) => {
  await AsyncStorage.setMany({
    [STORAGE_KEYS.ACCESS]: access,
    [STORAGE_KEYS.REFRESH]: refresh,
  });
};

export const clearPersistedTokens = async () => {
  await AsyncStorage.removeMany([STORAGE_KEYS.ACCESS, STORAGE_KEYS.REFRESH]);
};

const refreshSession = async () => {
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const json = await res.json();
    accessToken = json.data.accessToken;
    refreshToken = json.data.refreshToken;
    await persistTokens(accessToken, refreshToken);
    return true;
  } catch {
    return false;
  }
};

export const apiFetch = async (path, { method = 'GET', body, auth = true, retry = true } = {}) => {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (auth && accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && auth && retry) {
    const refreshed = await refreshSession();
    if (refreshed) {
      return apiFetch(path, { method, body, auth, retry: false });
    }
    clearAuthTokens();
    if (sessionExpiredHandler) sessionExpiredHandler();
  }

  return res;
};

export const readBody = async (res) => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};
