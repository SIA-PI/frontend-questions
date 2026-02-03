/**
 * API Utility - Integração segura com backend (JWT + refresh, proxy same-origin).
 * Tokens nunca são logados. Refresh automático em 401.
 */

const API_BASE_URL = '/api';

const STORAGE_KEYS = {
  ACCESS: 'authToken',
  REFRESH: 'refreshToken',
  USER: 'currentUser',
};

function getAccessToken() {
  return localStorage.getItem(STORAGE_KEYS.ACCESS);
}

function getRefreshToken() {
  return localStorage.getItem(STORAGE_KEYS.REFRESH);
}

/**
 * Converte perfil do backend (/api/me/) para formato esperado pelo frontend.
 */
function profileToUser(profile) {
  if (!profile || !profile.user) return null;
  const u = profile.user;
  return {
    id: profile.id,
    username: u.username,
    name: u.username || u.email || 'Usuário',
    role: profile.role,
    email: u.email || '',
  };
}

/**
 * Tenta renovar o access token usando o refresh token.
 * Retorna o novo access ou null em caso de falha.
 */
async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  const res = await fetch(`${API_BASE_URL}/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  if (data.access) {
    localStorage.setItem(STORAGE_KEYS.ACCESS, data.access);
    return data.access;
  }
  return null;
}

/**
 * Wrapper de fetch com JWT, retry com refresh em 401 e sem log de tokens.
 */
async function fetchAPI(endpoint, options = {}) {
  const token = getAccessToken();
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  const url = `${API_BASE_URL}${endpoint}`;
  let response = await fetch(url, config);
  let retried = false;

  // 401: tentar refresh no máximo uma vez e repetir a requisição
  if (response.status === 401 && !retried) {
    retried = true;
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      config.headers.Authorization = `Bearer ${newAccess}`;
      response = await fetch(url, config);
    }
  }

  const contentType = response.headers.get('Content-Type') || '';
  let data = null;
  if (contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch (_) {
      data = null;
    }
  }

  // Ainda 401 após refresh: deslogar e lançar
  if (response.status === 401) {
    logout();
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

/**
 * API Methods
 */
export const api = {
  // Autenticação: login via JWT (token + /me)
  login: async (username, password) => {
    const tokenRes = await fetch(`${API_BASE_URL}/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const tokenData = await tokenRes.json().catch(() => ({}));

    if (!tokenRes.ok) {
      const msg =
        tokenData.detail ||
        (Array.isArray(tokenData.non_field_errors) && tokenData.non_field_errors[0]) ||
        'Credenciais inválidas';
      throw new Error(typeof msg === 'string' ? msg : 'Credenciais inválidas');
    }

    const access = tokenData.access;
    const refresh = tokenData.refresh;
    if (!access) throw new Error('Resposta de login inválida');

    const meRes = await fetch(`${API_BASE_URL}/me/`, {
      headers: { Authorization: `Bearer ${access}` },
    });

    if (!meRes.ok) {
      throw new Error('Erro ao obter perfil do usuário');
    }

    const profile = await meRes.json();
    const user = profileToUser(profile);
    if (!user) throw new Error('Perfil inválido');

    saveAuthData(access, user);
    if (refresh) localStorage.setItem(STORAGE_KEYS.REFRESH, refresh);

    return { success: true, token: access, user };
  },

  logout: () => {
    logout();
  },

  // Avaliações (Resultados do backend)
  getAssessments: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    const endpoint = `/resultados/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const data = await fetchAPI(endpoint);
    return {
      success: true,
      data: data.results ?? (Array.isArray(data) ? data : []),
      count: data.count,
      next: data.next,
      previous: data.previous,
    };
  },

  getAssessment: async (id) => {
    return fetchAPI(`/resultados/${id}/`);
  },

  createAssessment: async (data) => {
    const alunoId = data.aluno_id || data.alunoId;
    if (!alunoId) throw new Error('aluno_id é obrigatório');
    return fetchAPI(`/iniciar-avaliacao/${alunoId}/`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  },

  updateAssessment: async (id, data) => {
    return fetchAPI(`/resultados/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteAssessment: async (id) => {
    return fetchAPI(`/resultados/${id}/`, { method: 'DELETE' });
  },

  finalizarAvaliacao: async (id) => {
    return fetchAPI(`/resultados/${id}/finalizar/`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  },

  // Alunos
  getAlunos: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.search) queryParams.append('search', params.search);
    const endpoint = `/alunos/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const data = await fetchAPI(endpoint);
    return {
      success: true,
      data: data.results ?? (Array.isArray(data) ? data : []),
      count: data.count,
      next: data.next,
      previous: data.previous,
    };
  },

  getAluno: (id) => fetchAPI(`/alunos/${id}/`),

  createAluno: async (alunoData) => {
    return fetchAPI('/alunos/', {
      method: 'POST',
      body: JSON.stringify(alunoData),
    });
  },

  updateAluno: async (id, alunoData) => {
    return fetchAPI(`/alunos/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(alunoData),
    });
  },

  deleteAluno: async (id) => {
    return fetchAPI(`/alunos/${id}/`, { method: 'DELETE' });
  },

  // Escolas
  getEscolas: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.municipio) queryParams.append('municipio', params.municipio);
    const endpoint = `/escolas/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const data = await fetchAPI(endpoint);
    return {
      success: true,
      data: data.results ?? (Array.isArray(data) ? data : []),
      count: data.count,
      next: data.next,
      previous: data.previous,
    };
  },

  getEscola: (id) => fetchAPI(`/escolas/${id}/`),

  createEscola: async (escolaData) => {
    return fetchAPI('/escolas/', {
      method: 'POST',
      body: JSON.stringify(escolaData),
    });
  },

  updateEscola: async (id, escolaData) => {
    return fetchAPI(`/escolas/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(escolaData),
    });
  },

  deleteEscola: async (id) => {
    return fetchAPI(`/escolas/${id}/`, { method: 'DELETE' });
  },

  // Classes
  getClasses: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.escola) queryParams.append('escola', params.escola);
    const endpoint = `/classes/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const data = await fetchAPI(endpoint);
    return {
      success: true,
      data: data.results ?? (Array.isArray(data) ? data : []),
      count: data.count,
      next: data.next,
      previous: data.previous,
    };
  },

  getClasse: (id) => fetchAPI(`/classes/${id}/`),

  createClasse: async (classeData) => {
    return fetchAPI('/classes/', {
      method: 'POST',
      body: JSON.stringify(classeData),
    });
  },

  updateClasse: async (id, classeData) => {
    return fetchAPI(`/classes/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(classeData),
    });
  },

  deleteClasse: async (id) => {
    return fetchAPI(`/classes/${id}/`, { method: 'DELETE' });
  },

  // Municípios
  getMunicipios: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    const endpoint = `/municipios/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const data = await fetchAPI(endpoint);
    return {
      success: true,
      data: data.results ?? (Array.isArray(data) ? data : []),
      count: data.count,
      next: data.next,
      previous: data.previous,
    };
  },

  getMunicipio: (id) => fetchAPI(`/municipios/${id}/`),

  // Questionários
  getQuestionarios: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.faixa_etaria) queryParams.append('faixa_etaria', params.faixa_etaria);
    const endpoint = `/questionarios/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const data = await fetchAPI(endpoint);
    return {
      success: true,
      data: data.results ?? (Array.isArray(data) ? data : []),
      count: data.count,
      next: data.next,
      previous: data.previous,
    };
  },

  getQuestionario: (id) => fetchAPI(`/questionarios/${id}/`),

  // Questões de um questionário
  getQuestoes: async (questionarioId) => {
    const questionario = await fetchAPI(`/questionarios/${questionarioId}/`);
    return questionario.questoes || [];
  },

  // Avaliadores
  getAvaliadores: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    const endpoint = `/avaliadores/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const data = await fetchAPI(endpoint);
    return {
      success: true,
      data: data.results ?? (Array.isArray(data) ? data : []),
      count: data.count,
      next: data.next,
      previous: data.previous,
    };
  },

  getAvaliador: (id) => fetchAPI(`/avaliadores/${id}/`),

  createAvaliador: async (avaliadorData) => {
    return fetchAPI('/avaliadores/', {
      method: 'POST',
      body: JSON.stringify(avaliadorData),
    });
  },

  updateAvaliador: async (id, avaliadorData) => {
    return fetchAPI(`/avaliadores/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(avaliadorData),
    });
  },

  deleteAvaliador: async (id) => {
    return fetchAPI(`/avaliadores/${id}/`, { method: 'DELETE' });
  },

  // Alunos por avaliador
  getAlunosPorAvaliador: async (avaliadorId) => {
    const data = await fetchAPI(`/alunos-avaliador/${avaliadorId}/`);
    return {
      success: true,
      data: Array.isArray(data) ? data : (data.results || []),
    };
  },

  // Respostas
  salvarResposta: async (resultadoId, questaoId, valor) => {
    return fetchAPI(`/resultados/${resultadoId}/responder/`, {
      method: 'POST',
      body: JSON.stringify({
        questao: questaoId,
        valor: valor,
      }),
    });
  },

  // Health (backend)
  healthCheck: async () => {
    return fetchAPI('/health/');
  },
};

function logout() {
  localStorage.removeItem(STORAGE_KEYS.ACCESS);
  localStorage.removeItem(STORAGE_KEYS.REFRESH);
  localStorage.removeItem(STORAGE_KEYS.USER);
}

/**
 * Verifica se o usuário está autenticado (tem access token).
 */
export function isAuthenticated() {
  return !!getAccessToken();
}

/**
 * Retorna o usuário atual do localStorage.
 */
export function getCurrentUser() {
  const raw = localStorage.getItem(STORAGE_KEYS.USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Salva access token e usuário (não expõe tokens em log).
 */
export function saveAuthData(token, user) {
  if (token) localStorage.setItem(STORAGE_KEYS.ACCESS, token);
  if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}
