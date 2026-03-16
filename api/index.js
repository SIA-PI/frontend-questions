const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running na Vercel!' });
});

app.get('/api/assessments', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        delegacia: 'Delegacia Central',
        avaliador: 'João Silva',
        data: '2026-02-01',
        status: 'Concluída',
        pontuacao: 85
      },
      {
        id: 2,
        delegacia: 'Delegacia Norte',
        avaliador: 'Maria Santos',
        data: '2026-02-02',
        status: 'Em andamento',
        pontuacao: 72
      }
    ]
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const users = {
    'admin': {
      id: 1,
      username: 'admin',
      password: 'admin123',
      name: 'Administrador Sistema',
      role: 'admin',
      email: 'admin@ssp.gov.br'
    },
    'avaliador1': {
      id: 2,
      username: 'avaliador1',
      password: 'aval123',
      name: 'João Silva',
      role: 'evaluator',
      email: 'joao.silva@ssp.gov.br'
    },
    'avaliador2': {
      id: 3,
      username: 'avaliador2',
      password: 'aval123',
      name: 'Maria Santos',
      role: 'evaluator',
      email: 'maria.santos@ssp.gov.br'
    }
  };

  const user = users[username];

  if (user && user.password === password) {
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      success: true,
      token: 'mock-jwt-token-' + Date.now(),
      user: userWithoutPassword
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Credenciais inválidas'
    });
  }
});

module.exports = app;