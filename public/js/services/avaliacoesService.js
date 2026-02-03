/**
 * Serviço de Avaliações (Resultados)
 * Responsável por operações de avaliações e respostas
 */

import { fetchWithAuth } from './httpClient.js';

export const avaliacoesService = {
    /**
     * Listar avaliações/resultados com filtros opcionais
     * @param {Object} params - Parâmetros de filtro (page, aluno, finalizado)
     * @returns {Promise<{success: boolean, data: Array, count: number, next: string, previous: string}>}
     */
    getAll: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.aluno) queryParams.append('aluno', params.aluno);
        if (params.finalizado !== undefined) queryParams.append('finalizado', params.finalizado);
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

    /**
     * Buscar avaliação por ID
     * @param {string|number} id - ID da avaliação/resultado
     * @returns {Promise<Object>}
     */
    getById: (id) => fetchWithAuth(`/resultados/${id}/`),

    /**
     * Iniciar nova avaliação para um aluno
     * @param {string|number} alunoId - ID do aluno
     * @returns {Promise<Object>} Resultado criado
     */
    iniciar: async (alunoId) => {
        return fetchWithAuth(`/iniciar-avaliacao/${alunoId}/`, {
            method: 'POST',
            body: JSON.stringify({}),
        });
    },

    /**
     * Finalizar avaliação
     * @param {string|number} resultadoId - ID do resultado/avaliação
     * @returns {Promise<Object>}
     */
    finalizar: async (resultadoId) => {
        return fetchWithAuth(`/resultados/${resultadoId}/finalizar/`, {
            method: 'POST',
            body: JSON.stringify({}),
        });
    },

    /**
     * Salvar respostas em lote
     * @param {Object} data - {resultado: id, respostas: [{question: id, valor: number}]}
     * @returns {Promise<Object>}
     */
    salvarRespostas: async (data) => {
        return fetchWithAuth('/respostas/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Listar respostas
     * @param {Object} params - Parâmetros de filtro (resultado, question)
     * @returns {Promise<Array>}
     */
    getRespostas: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.resultado) queryParams.append('resultado', params.resultado);
        if (params.question) queryParams.append('question', params.question);
        const endpoint = `/respostas/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const data = await fetchWithAuth(endpoint);
        return data.results ?? (Array.isArray(data) ? data : []);
    },

    /**
     * Atualizar avaliação
     * @param {string|number} id - ID da avaliação
     * @param {Object} avaliacaoData - Dados para atualizar
     * @returns {Promise<Object>}
     */
    update: async (id, avaliacaoData) => {
        return fetchWithAuth(`/resultados/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(avaliacaoData),
        });
    },

    /**
     * Deletar avaliação
     * @param {string|number} id - ID da avaliação
     * @returns {Promise<void>}
     */
    delete: async (id) => {
        return fetchWithAuth(`/resultados/${id}/`, { method: 'DELETE' });
    },
};
