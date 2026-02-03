/**
 * Serviço de Alunos
 * Responsável por operações CRUD de alunos
 */

import { fetchWithAuth } from './httpClient.js';

export const alunosService = {
    /**
     * Listar alunos com filtros opcionais
     * @param {Object} params - Parâmetros de filtro (page, search, escola, classe)
     * @returns {Promise<{success: boolean, data: Array, count: number, next: string, previous: string}>}
     */
    getAll: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.search) queryParams.append('search', params.search);
        if (params.escola) queryParams.append('escola', params.escola);
        if (params.classe) queryParams.append('classe', params.classe);
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

    /**
     * Buscar aluno por ID
     * @param {string|number} id - ID do aluno
     * @returns {Promise<Object>}
     */
    getById: (id) => fetchWithAuth(`/alunos/${id}/`),

    /**
     * Buscar alunos de um avaliador específico
     * @param {string|number} avaliadorId - ID do avaliador
     * @returns {Promise<Array>}
     */
    getByAvaliador: async (avaliadorId) => {
        const data = await fetchWithAuth(`/alunos-avaliador/${avaliadorId}/`);
        return Array.isArray(data) ? data : [];
    },

    /**
     * Criar novo aluno
     * @param {Object} alunoData - Dados do aluno {nome, matricula, cpf, faixa_etaria, escola, classe}
     * @returns {Promise<Object>}
     */
    create: async (alunoData) => {
        return fetchWithAuth('/alunos/', {
            method: 'POST',
            body: JSON.stringify(alunoData),
        });
    },

    /**
     * Atualizar aluno existente
     * @param {string|number} id - ID do aluno
     * @param {Object} alunoData - Dados para atualizar
     * @returns {Promise<Object>}
     */
    update: async (id, alunoData) => {
        return fetchWithAuth(`/alunos/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(alunoData),
        });
    },

    /**
     * Deletar aluno
     * @param {string|number} id - ID do aluno
     * @returns {Promise<void>}
     */
    delete: async (id) => {
        return fetchWithAuth(`/alunos/${id}/`, { method: 'DELETE' });
    },
};
