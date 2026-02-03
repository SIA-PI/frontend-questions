const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';
const PUBLIC_API_BASE_URL = process.env.PUBLIC_API_BASE_URL || '/api';
const PUBLIC_API_SCHEMA_URL = process.env.PUBLIC_API_SCHEMA_URL || `${PUBLIC_API_BASE_URL.replace(/\/+$/, '')}/schema/`;

// URL do backend deve ter protocolo (http:// ou https://) para o proxy funcionar
function normalizeBackendUrl(url) {
  if (!url || typeof url !== 'string') return 'http://127.0.0.1:8000';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `http://${trimmed}`;
}

const BACKEND_API_URL = normalizeBackendUrl(process.env.BACKEND_API_URL || 'http://127.0.0.1:8000');

if (!process.env.BACKEND_API_URL) {
  console.warn('⚠️ BACKEND_API_URL não definido; usando padrão http://127.0.0.1:8000');
}

// --- Helmet: Headers de segurança ---
// Em desenvolvimento, desabilitar CSP para evitar bloqueios
if (IS_PRODUCTION) {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        scriptSrcElem: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
      },
    },
  }));
  console.log('🔒 Helmet CSP ativado (PRODUÇÃO)');
} else {
  // Desenvolvimento: apenas headers básicos, sem CSP
  app.use(helmet({
    contentSecurityPolicy: false,  // Desabilitar CSP em dev
  }));
  console.log('🔓 Helmet CSP desabilitado (DESENVOLVIMENTO)');
}

// --- Rate Limiting ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: IS_PRODUCTION ? 100 : 1000, // 100 req/15min em prod, 1000 em dev
  message: { error: 'Muitas requisições. Tente novamente mais tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Runtime config for frontend (no rebuild needed)
app.get('/app-config.js', (req, res) => {
  res.type('application/javascript');
  res.send(`window.__APP_CONFIG__ = ${JSON.stringify({
    apiBaseUrl: PUBLIC_API_BASE_URL,
    apiSchemaUrl: PUBLIC_API_SCHEMA_URL,
  })};`);
});

// --- Proxy: /api/* → backend (mesma origem para o browser = mais seguro) ---
// IMPORTANTE: Proxy ANTES de express.json/urlencoded para não consumir o body
app.use(
  '/api',
  createProxyMiddleware({
    target: BACKEND_API_URL,
    changeOrigin: true,
    logLevel: 'warn',
    onError: (err, req, res) => {
      console.error('❌ Proxy error:', err.message);
      res.status(502).json({ error: 'Serviço indisponível. Verifique se o backend está rodando.' });
    },
  })
);

// Express body parsers DEPOIS do proxy (só para rotas não-proxy)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static('public'));

// SPA: fallback para index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Frontend rodando em http://localhost:${PORT}`);
  console.log(`   API proxy → ${BACKEND_API_URL}`);
});
