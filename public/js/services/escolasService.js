/**
 * Serviço de Escolas/Delegacias
 * Responsável por operações CRUD de escolas
 */

import { fetchWithAuth } from './httpClient.js';

export const escolasService = {
    /**
     * Listar escolas com filtros opcionais
     * @param {Object} params - Parâmetros de filtro (page, municipio, search)
     * @returns {Promise<{success: boolean, data: Array, count: number, next: string, previous: string}>}
     */
    getAll: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.municipio) queryParams.append('municipio', params.municipio);
        if (params.search) queryParams.append('search', params.search);
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

    /**
     * Buscar escola por ID
     * @param {string|number} id - ID da escola
     * @returns {Promise<Object>}
     */
    getById: (id) => fetchWithAuth(`/escolas/${id}/`),

    /**
     * Criar nova escola
     * @param {Object} escolaData - Dados da escola {nome, municipio, ...}
     * @returns {Promise<Object>}
     */
    create: async (escolaData) => {
        return fetchWithAuth('/escolas/', {
            method: 'POST',
            body: JSON.stringify(escolaData),
        });
    },

    /**
     * Atualizar escola existente
     * @param {string|number} id - ID da escola
     * @param {Object} escolaData - Dados para atualizar
     * @returns {Promise<Object>}
     */
    update: async (id, escolaData) => {
        return fetchWithAuth(`/escolas/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(escolaData),
        });
    },

    /**
     * Deletar escola
     * @param {string|number} id - ID da escola
     * @returns {Promise<void>}
     */
    delete: async (id) => {
        return fetchWithAuth(`/escolas/${id}/`, { method: 'DELETE' });
    },
};
