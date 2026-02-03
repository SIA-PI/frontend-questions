const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

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

// --- Segurança: headers de resposta ---
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// --- Proxy: /api/* → backend (mesma origem para o browser = mais seguro) ---
app.use(
  '/api',
  createProxyMiddleware({
    target: BACKEND_API_URL,
    changeOrigin: true,
    pathRewrite: { '^/api': '/api' },
    onProxyReq: (proxyReq, req, res) => {
      // Não encaminhar corpo em GET/HEAD
      if (req.method === 'GET' || req.method === 'HEAD') {
        proxyReq.removeHeader('Content-Type');
        proxyReq.removeHeader('Content-Length');
      }
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err.message);
      res.status(502).json({ error: 'Serviço indisponível. Verifique se o backend está rodando.' });
    },
  })
);

// SPA: fallback para index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Frontend rodando em http://localhost:${PORT}`);
  console.log(`   API proxy → ${BACKEND_API_URL}`);
});
