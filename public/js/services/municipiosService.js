/**
 * Serviço de Municípios
 * Responsável por operações CRUD de municípios
 */

import { fetchWithAuth } from './httpClient.js';

export const municipiosService = {
    /**
     * Listar municípios com filtros opcionais
     * @param {Object} params - Parâmetros de filtro (page, search)
     * @returns {Promise<{success: boolean, data: Array, count: number, next: string, previous: string}>}
     */
    getAll: async (params = {}) => {
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

    /**
     * Buscar município por ID
     * @param {string|number} id - ID do município
     * @returns {Promise<Object>}
     */
    getById: (id) => fetchWithAuth(`/municipios/${id}/`),

    /**
     * Criar novo município
     * @param {Object} municipioData - Dados do município {nome}
     * @returns {Promise<Object>}
     */
    create: async (municipioData) => {
        return fetchWithAuth('/municipios/', {
            method: 'POST',
            body: JSON.stringify(municipioData),
        });
    },

    /**
     * Atualizar município existente
     * @param {string|number} id - ID do município
     * @param {Object} municipioData - Dados para atualizar
     * @returns {Promise<Object>}
     */
    update: async (id, municipioData) => {
        return fetchWithAuth(`/municipios/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(municipioData),
        });
    },

    /**
     * Deletar município
     * @param {string|number} id - ID do município
     * @returns {Promise<void>}
     */
    delete: async (id) => {
        return fetchWithAuth(`/municipios/${id}/`, { method: 'DELETE' });
    },
};
