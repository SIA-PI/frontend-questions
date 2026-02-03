const STORAGE_KEYS = {
  ACCESS: 'authToken',
  REFRESH: 'refreshToken',
  USER: 'currentUser',
};

export function getAccessToken() {
  return localStorage.getItem(STORAGE_KEYS.ACCESS);
}

export function getRefreshToken() {
  return localStorage.getItem(STORAGE_KEYS.REFRESH);
}

export function setAccessToken(token) {
  if (token) localStorage.setItem(STORAGE_KEYS.ACCESS, token);
}

export function setRefreshToken(token) {
  if (token) localStorage.setItem(STORAGE_KEYS.REFRESH, token);
}

export function saveAuthData(token, user) {
  setAccessToken(token);
  if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

export function clearAuthData() {
  localStorage.removeItem(STORAGE_KEYS.ACCESS);
  localStorage.removeItem(STORAGE_KEYS.REFRESH);
  localStorage.removeItem(STORAGE_KEYS.USER);
}

export function isAuthenticated() {
  return !!getAccessToken();
}

export function getCurrentUser() {
  const raw = localStorage.getItem(STORAGE_KEYS.USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
