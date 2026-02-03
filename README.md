# SSP Delegacias - Sistema de Avaliação

Sistema web completo para avaliação de delegacias desenvolvido com Node.js, Express e JavaScript vanilla, seguindo design moderno e profissional.

## 🎨 Design

O projeto foi desenvolvido seguindo um design system profissional com:

- **Fonte**: Lexend (Google Fonts)
- **Ícones**: Material Symbols Outlined
- **Framework CSS**: Tailwind CSS 3.x
- **Cor Principal**: #135bec (Azul SSP)
- **Tema**: Light/Dark mode support

### Páginas Implementadas

1. **Login Screen** - Split screen com formulário e área de destaque
2. **Dashboard** - Sidebar azul + cards de estatísticas + tabela de avaliações
3. **Sistema de Avaliações** - Em desenvolvimento
4. **Relatórios** - Em desenvolvimento

## 🚀 Tecnologias

- **Backend**: Node.js + Express
- **Frontend**: HTML5, Tailwind CSS, JavaScript (ES6+ Modules)
- **Arquitetura**: SPA (Single Page Application)
- **Ícones**: Material Symbols Outlined

## 📁 Estrutura do Projeto

```
project-ssp-deleg/
├── server.js                 # Servidor Node.js/Express
├── package.json             # Dependências do projeto
├── .env                     # Variáveis de ambiente (porta 3001)
├── .gitignore              # Arquivos ignorados pelo Git
├── README.md               # Este arquivo
├── public/                 # Arquivos públicos
│   ├── index.html         # HTML principal com Tailwind
│   ├── css/               # Estilos customizados
│   │   ├── main.css      # Estilos base
│   │   ├── components.css # Componentes
│   │   └── animations.css # Animações
│   ├── js/                # JavaScript
│   │   ├── app.js        # Entrada principal
│   │   ├── router.js     # Sistema de rotas SPA
│   │   ├── components/   # Componentes da UI
│   │   │   ├── LoginPage.js
│   │   │   └── DashboardPage.js
│   │   └── utils/        # Utilitários
│   │       ├── api.js    # Cliente API
│   │       ├── helpers.js # Funções auxiliares
│   │       └── toast.js  # Sistema de notificações
│   └── data/             # Dados
│       └── mock-data.js  # Dados mock
└── Design References/     # Designs de referência
    ├── login_screen/
    ├── evaluator_dashboard_1/
    ├── evaluator_dashboard_2/
    └── assessment_reports_dashboard/
```

## 🔧 Instalação

1. **Instale as dependências**:
```bash
npm install
```

2. **Configure as variáveis de ambiente**:
O arquivo `.env` já está criado com porta 3001.

## 🏃 Como Executar

### Modo Desenvolvimento (com auto-reload)

```bash
npm run dev
```

### Modo Produção

```bash
npm start
```

O servidor iniciará em `http://localhost:3001`

## 👤 Usuários

Os usuários são criados no **backend** (Django):

- **Registro**: `POST /api/register/` com `{ username, email, password, role }` (roles: `administrador`, `gerenciador`, `avaliador`)
- **Admin**: no backend, `python manage.py createsuperuser` para um administrador com acesso ao Django Admin

Depois use o mesmo `username` e `password` para fazer login no frontend.

## 📋 Funcionalidades

### ✅ Implementadas
- Sistema de autenticação com guards
- Login page com split screen design
- Dashboard com sidebar azul (#135bec)
- Cards de estatísticas com ícones Material
- Tabela de avaliações recentes com progress bars
- Sistema de notificações toast
- Roteamento SPA com hash navigation
- Design responsivo (mobile, tablet, desktop)
- Dark mode support
- Animações e transições suaves

### 🚧 Em Desenvolvimento
- Página de Avaliações (CRUD completo)
- Formulário de avaliação com sliders
- Página de Delegacias
- Dashboard de Relatórios com gráficos
- Filtros avançados
- Exportação de dados (PDF, Excel)
- Busca e paginação

## 🔗 Integração com o Backend (backend-questions)

O frontend consome a API do backend via **proxy**: todas as requisições para `/api/*` são encaminhadas ao backend. O navegador enxerga apenas a mesma origem, o que reduz exposição e simplifica CORS.

1. **Configure a URL do backend** no `.env` (copie de `.env.example`):
   ```bash
   BACKEND_API_URL=http://127.0.0.1:8000
   ```
2. **Inicie o backend** (Django) antes do frontend, por exemplo:
   ```bash
   cd ../backend-questions && python manage.py runserver
   ```
3. **Inicie o frontend**:
   ```bash
   npm run dev
   ```
4. Acesse `http://localhost:3000` e faça login com um usuário criado no backend (ex.: via `register/` ou `createsuperuser`).

### Autenticação (JWT)
- Login: `POST /api/token/` com `{ username, password }` → `{ access, refresh }`
- Perfil: `GET /api/me/` com header `Authorization: Bearer <access>`
- Refresh: `POST /api/token/refresh/` com `{ refresh }` (uso automático em 401)
- Health: `GET /api/health/`

### Avaliações (Resultados)
- Listar: `GET /api/resultados/`
- Detalhe: `GET /api/resultados/:id/`
- Iniciar: `POST /api/iniciar-avaliacao/:aluno_id/`
- Atualizar/Finalizar: `PATCH /api/resultados/:id/`

## 🎨 Componentes de Design

### Cores Principais
```css
--primary: #135bec           /* Azul SSP */
--primary-hover: #0e4bca     /* Azul hover */
--background-light: #f6f6f8  /* Fundo claro */
--background-dark: #101622   /* Fundo escuro */
```

### Tipografia
- **Família**: Lexend (sans-serif)
- **Pesos**: 300, 400, 500, 600, 700

### Ícones
- **Biblioteca**: Material Symbols Outlined
- **Estilo**: Outlined (peso variável 100-700)

## 📱 Responsividade

O sistema é totalmente responsivo:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px
- **Large Desktop**: > 1280px

### Breakpoints Tailwind
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## 🔒 Segurança

- **JWT**: autenticação via access + refresh token; refresh automático em 401
- **Proxy**: requisições `/api/*` passam pelo servidor Node; URL do backend não é exposta ao cliente
- **Headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy
- Tokens armazenados em localStorage (access + refresh); nunca logados
- Guards de roteamento e sessão expirada redirecionando para login
- Variáveis sensíveis em `.env` (BACKEND_API_URL, PORT)

## 🚀 Próximos Passos

1. **Backend**
   - Integrar com banco de dados (PostgreSQL/MongoDB)
   - Implementar autenticação JWT real
   - Adicionar validação de dados com Joi/Zod
   - Implementar rate limiting

2. **Frontend**
   - Completar páginas de Avaliações e Delegacias
   - Implementar dashboard de relatórios com gráficos
   - Adicionar filtros e busca avançada
   - Implementar exportação de dados

3. **DevOps**
   - Configurar CI/CD
   - Adicionar testes (Jest, Cypress)
   - Deploy em produção
   - Monitoramento e logs

## 🛠️ Tecnologias Utilizadas

- **Node.js** v20.x
- **Express** v4.18.x
- **Tailwind CSS** v3.x (via CDN)
- **Material Symbols** (Google Fonts)
- **Lexend Font** (Google Fonts)

## 📄 Licença

Este projeto é proprietário e confidencial da Secretaria de Segurança Pública.

## 👥 Suporte

Para suporte técnico ou dúvidas sobre o sistema, entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ para SSP - Secretaria de Segurança Pública do Piauí**

**Versão**: 1.0.0  
**Última atualização**: Fevereiro 2026
