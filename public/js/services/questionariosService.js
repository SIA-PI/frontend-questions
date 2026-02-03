/**
 * Serviço de Questionários e Questões
 * Responsável por operações de questionários e perguntas
 */

import { fetchWithAuth } from './httpClient.js';

export const questionariosService = {
    /**
     * Listar questionários
     * @param {Object} params - Parâmetros de filtro (page, faixa_etaria)
     * @returns {Promise<{success: boolean, data: Array, count: number}>}
     */
    getAll: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.faixa_etaria) queryParams.append('faixa_etaria', params.faixa_etaria);
        const endpoint = `/questionarios/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const data = await fetchWithAuth(endpoint);
        return {
            success: true,
            data: data.results ?? (Array.isArray(data) ? data : []),
            count: data.count,
        };
    },

    /**
     * Buscar questionário por ID
     * @param {string|number} id - ID do questionário
     * @returns {Promise<Object>}
     */
    getById: (id) => fetchWithAuth(`/questionarios/${id}/`),

    /**
     * Buscar perguntas de um questionário
     * @param {string|number} questionarioId - ID do questionário
     * @returns {Promise<Array>} Lista de perguntas
     */
    getPerguntas: async (questionarioId) => {
        const data = await fetchWithAuth(`/questionarios/${questionarioId}/perguntas/`);
        return Array.isArray(data) ? data : [];
    },

    /**
     * Listar todas as questões
     * @param {Object} params - Parâmetros de filtro (page)
     * @returns {Promise<{success: boolean, data: Array}>}
     */
    getAllQuestoes: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        const endpoint = `/questions/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const data = await fetchWithAuth(endpoint);
        return {
            success: true,
            data: data.results ?? (Array.isArray(data) ? data : []),
        };
    },

    /**
     * Buscar questão por ID
     * @param {string|number} id - ID da questão
     * @returns {Promise<Object>}
     */
    getQuestaoById: (id) => fetchWithAuth(`/questions/${id}/`),

    /**
     * Buscar schema da API
     * @returns {Promise<Object>}
     */
    getSchema: async () => {
        const data = await fetchWithAuth('/schema/');
        return data;
    },
};
