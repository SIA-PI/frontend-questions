/**
 * API Utility - Integração segura com backend (JWT + refresh, proxy same-origin).
 * Tokens nunca são logados. Refresh automático em 401.
 * 
 * Camadas internas: config + storage + http client (serviços).
 */

import { APP_CONFIG } from '../config/appConfig.js';
import {
  clearAuthData,
  getCurrentUser,
  isAuthenticated,
  saveAuthData,
  setRefreshToken,
} from '../services/authStorage.js';
import { fetchWithAuth, fetchWithToken, fetchWithoutAuth } from '../services/httpClient.js';
import { withCache } from './cache.js';

/**
 * Converte perfil do backend (/api/me/) para formato esperado pelo frontend.
 */
function profileToUser(profile) {
  if (!profile || !profile.user) return null;
  const u = profile.user;
  const roleMap = { administrador: 'admin', avaliador: 'evaluator' };
  return {
    id: profile.id,
    username: u.username,
    name: u.username || u.email || 'Usuário',
    role: roleMap[profile.role] || profile.role,
    email: u.email || '',
  };
}

/**
 * API Methods
 */
export const api = {
  // Autenticação: login via JWT (token + /me)
  login: async (username, password) => {
    const { response: tokenRes, data: tokenData } = await fetchWithoutAuth('/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

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

    const profile = await fetchWithToken('/me/', access);
    const user = profileToUser(profile);
    if (!user) throw new Error('Perfil inválido');

    saveAuthData(access, user);
    if (refresh) setRefreshToken(refresh);

    return { success: true, token: access, user };
  },

  logout: () => {
    clearAuthData();
  },

  getSchema: async () => {
    const schemaEndpoint = APP_CONFIG.apiSchemaUrl.startsWith(APP_CONFIG.apiBaseUrl)
      ? APP_CONFIG.apiSchemaUrl.replace(APP_CONFIG.apiBaseUrl, '') || '/schema/'
      : '/schema/';
    const { response, data } = await fetchWithoutAuth(schemaEndpoint);
    if (!response.ok) {
      const err = new Error('Erro ao obter schema do backend');
      err.status = response.status;
      err.data = data;
      throw err;
    }
    return data;
  },

  // Avaliações (Resultados do backend)
  getAssessments: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    const endpoint = `/resultados/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const data = await fetchWithAuth(endpoint);
    return {
      success: true,
      data: data.results ?? (Array.isArray(data) ? data : []),
      count: data.count,
      next: data.next,
      previous: data.previous,
    };
  },

  getAssessment: async (id) => {
    return fetchWithAuth(`/resultados/${id}/`);
  },

  /**
   * Busca o resultado (avaliação) DESTE aluno. Usa endpoint por-aluno para sempre carregar o correto.
   * Retorna o objeto resultado ou null se 404 (ainda não existe).
   */
  getAssessmentByAluno: async (alunoId) => {
    const id = String(alunoId || '').trim();
    if (!id) return null;
    try {
      return await fetchWithAuth(`/resultados/por-aluno/${id}/`);
    } catch (err) {
      if (err.status === 404) return null;
      throw err;
    }
  },

  createAssessment: async (data) => {
    const alunoId = data.aluno_id || data.alunoId;
    if (!alunoId) throw new Error('aluno_id é obrigatório');
    return fetchWithAuth(`/iniciar-avaliacao/${alunoId}/`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  },

  updateAssessment: async (id, data) => {
    return fetchWithAuth(`/resultados/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteAssessment: async (id) => {
    return fetchWithAuth(`/resultados/${id}/`, { method: 'DELETE' });
  },

  finalizarAvaliacao: async (id) => {
    return fetchWithAuth(`/resultados/${id}/finalizar/`, {
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
    const data = await fetchWithAuth(endpoint);
    return {
      success: true,
      data: data.results ?? (Array.isArray(data) ? data : []),
      count: data.count,
      next: data.next,
      previous: data.previous,
    };
  },

  getAluno: (id) => fetchWithAuth(`/alunos/${id}/`),

  createAluno: async (alunoData) => {
    return fetchWithAuth('/alunos/', {
      method: 'POST',
      body: JSON.stringify(alunoData),
    });
  },

  updateAluno: async (id, alunoData) => {
    return fetchWithAuth(`/alunos/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(alunoData),
    });
  },

  deleteAluno: async (id) => {
    return fetchWithAuth(`/alunos/${id}/`, { method: 'DELETE' });
  },

  // Escolas
  getEscolas: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.municipio) queryParams.append('municipio', params.municipio);
    const endpoint = `/escolas/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const data = await fetchWithAuth(endpoint);
    return {
      success: true,
      data: data.results ?? (Array.isArray(data) ? data : []),
      count: data.count,
      next: data.next,
      previous: data.previous,
    };
  },

  getEscola: withCache((id) => fetchWithAuth(`/escolas/${id}/`), 'escola'),

  createEscola: async (escolaData) => {
    return fetchWithAuth('/escolas/', {
      method: 'POST',
      body: JSON.stringify(escolaData),
    });
  },

  updateEscola: async (id, escolaData) => {
    return fetchWithAuth(`/escolas/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(escolaData),
    });
  },

  deleteEscola: async (id) => {
    return fetchWithAuth(`/escolas/${id}/`, { method: 'DELETE' });
  },

  // Municípios
  getMunicipios: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.search) queryParams.append('search', params.search);
    const endpoint = `/municipios/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const data = await fetchWithAuth(endpoint);
    return {
      success: true,
      data: data.results ?? (Array.isArray(data) ? data : []),
      count: data.count,
      next: data.next,
      previous: data.previous,
    };
  },

  getMunicipio: withCache((id) => fetchWithAuth(`/municipios/${id}/`), 'municipio'),

  createMunicipio: async (municipioData) => {
    return fetchWithAuth('/municipios/', {
      method: 'POST',
      body: JSON.stringify(municipioData),
    });
  },

  updateMunicipio: async (id, municipioData) => {
    return fetchWithAuth(`/municipios/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(municipioData),
    });
  },

  deleteMunicipio: async (id) => {
    return fetchWithAuth(`/municipios/${id}/`, { method: 'DELETE' });
  },

  // Classes
  getClasses: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.escola) queryParams.append('escola', params.escola);
    const endpoint = `/classes/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const data = await fetchWithAuth(endpoint);
    return {
      success: true,
      data: data.results ?? (Array.isArray(data) ? data : []),
      count: data.count,
      next: data.next,
      previous: data.previous,
    };
  },

  getClasse: withCache((id) => fetchWithAuth(`/classes/${id}/`), 'classe'),

  createClasse: async (classeData) => {
    return fetchWithAuth('/classes/', {
      method: 'POST',
      body: JSON.stringify(classeData),
    });
  },

  updateClasse: async (id, classeData) => {
    return fetchWithAuth(`/classes/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(classeData),
    });
  },

  deleteClasse: async (id) => {
    return fetchWithAuth(`/classes/${id}/`, { method: 'DELETE' });
  },

  // Questionários
  getQuestionarios: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.faixa_etaria) queryParams.append('faixa_etaria', params.faixa_etaria);
    const endpoint = `/questionarios/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const data = await fetchWithAuth(endpoint);
    return {
      success: true,
      data: data.results ?? (Array.isArray(data) ? data : []),
      count: data.count,
      next: data.next,
      previous: data.previous,
    };
  },

  getQuestionario: (id) => fetchWithAuth(`/questionarios/${id}/`),

  // Questões de um questionário (endpoint perguntas da API)
  getQuestoes: async (questionarioId) => {
    const data = await fetchWithAuth(`/questionarios/${questionarioId}/perguntas/`);
    return Array.isArray(data) ? data : [];
  },

  // Avaliadores
  getAvaliadores: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    const endpoint = `/avaliadores/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const data = await fetchWithAuth(endpoint);
    return {
      success: true,
      data: data.results ?? (Array.isArray(data) ? data : []),
      count: data.count,
      next: data.next,
      previous: data.previous,
    };
  },

  getAvaliador: withCache((id) => fetchWithAuth(`/avaliadores/${id}/`), 'avaliador'),

  createAvaliador: async (avaliadorData) => {
    return fetchWithAuth('/avaliadores/', {
      method: 'POST',
      body: JSON.stringify(avaliadorData),
    });
  },

  updateAvaliador: async (id, avaliadorData) => {
    return fetchWithAuth(`/avaliadores/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(avaliadorData),
    });
  },

  deleteAvaliador: async (id) => {
    return fetchWithAuth(`/avaliadores/${id}/`, { method: 'DELETE' });
  },

  // Alunos por avaliador
  getAlunosPorAvaliador: async (avaliadorId) => {
    const data = await fetchWithAuth(`/alunos-avaliador/${avaliadorId}/`);
    return {
      success: true,
      data: Array.isArray(data) ? data : (data.results || []),
    };
  },

  // Respostas (lote): POST /respostas/ com { resultado, respostas: [{ question, valor }] }, valor 0 ou 1
  salvarRespostas: async (resultadoId, respostas) => {
    return fetchWithAuth('/respostas/', {
      method: 'POST',
      body: JSON.stringify({
        resultado: resultadoId,
        respostas: Array.isArray(respostas) ? respostas : [],
      }),
    });
  },

  getRespostas: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.resultado) queryParams.append('resultado', params.resultado);
    const endpoint = `/respostas/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const data = await fetchWithAuth(endpoint);
    return data.results ?? (Array.isArray(data) ? data : []);
  },

  getDashboardStats: async () => {
    return fetchWithAuth('/dashboard/stats/');
  },

  // Health (backend)
  healthCheck: async () => {
    return fetchWithAuth('/health/');
  },
};
export { APP_CONFIG, getCurrentUser, isAuthenticated, saveAuthData };
