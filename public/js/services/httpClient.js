import { APP_CONFIG } from '../config/appConfig.js';
import { clearAuthData, getAccessToken, getRefreshToken, setAccessToken } from './authStorage.js';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

function buildUrl(endpoint) {
  return `${APP_CONFIG.apiBaseUrl}${endpoint}`;
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const contentType = response.headers.get('Content-Type') || '';
  let data = null;

  if (contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch (_) {
      data = null;
    }
  }

  return { response, data };
}

async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  const { response, data } = await requestJson(buildUrl('/token/refresh/'), {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok || !data?.access) return null;
  setAccessToken(data.access);
  return data.access;
}

export async function fetchWithAuth(endpoint, options = {}) {
  const token = getAccessToken();
  const config = {
    ...options,
    headers: {
      ...JSON_HEADERS,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  };

  const url = buildUrl(endpoint);
  let { response, data } = await requestJson(url, config);
  let retried = false;

  if (response.status === 401 && !retried) {
    retried = true;
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      config.headers.Authorization = `Bearer ${newAccess}`;
      const retryResult = await requestJson(url, config);
      response = retryResult.response;
      data = retryResult.data;
    }
  }

  if (response.status === 401) {
    clearAuthData();
    const err = new Error('Sessão expirada. Faça login novamente.');
    err.status = 401;
    throw err;
  }

  if (!response.ok) {
    const message =
      (data && (data.detail || data.message || data.error)) ||
      (Array.isArray(data?.non_field_errors) && data.non_field_errors[0]) ||
      'Erro na requisição';
    const err = new Error(typeof message === 'string' ? message : 'Erro na requisição');
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export async function fetchWithoutAuth(endpoint, options = {}) {
  const url = buildUrl(endpoint);
  const config = {
    ...options,
    headers: {
      ...JSON_HEADERS,
      ...options.headers,
    },
  };

  return requestJson(url, config);
}

export async function fetchWithToken(endpoint, token, options = {}) {
  const url = buildUrl(endpoint);
  const config = {
    ...options,
    headers: {
      ...JSON_HEADERS,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  };

  const { response, data } = await requestJson(url, config);

  if (!response.ok) {
    const err = new Error('Erro ao obter perfil do usuário');
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}
