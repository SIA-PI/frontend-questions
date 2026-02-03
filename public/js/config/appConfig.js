const DEFAULT_CONFIG = {
  apiBaseUrl: '/api',
  apiSchemaUrl: '/api/schema/',
};

function normalizeBaseUrl(value) {
  if (!value || typeof value !== 'string') return DEFAULT_CONFIG.apiBaseUrl;
  return value.replace(/\/+$/, '');
}

function normalizeSchemaUrl(baseUrl, value) {
  const raw = value || `${baseUrl}/schema/`;
  return raw.endsWith('/') ? raw : `${raw}/`;
}

const runtimeConfig = window.__APP_CONFIG__ || {};
const apiBaseUrl = normalizeBaseUrl(runtimeConfig.apiBaseUrl || DEFAULT_CONFIG.apiBaseUrl);
const apiSchemaUrl = normalizeSchemaUrl(apiBaseUrl, runtimeConfig.apiSchemaUrl || DEFAULT_CONFIG.apiSchemaUrl);

export const APP_CONFIG = Object.freeze({
  apiBaseUrl,
  apiSchemaUrl,
});
