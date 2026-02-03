/**
 * Índice de Serviços da API
 * Exporta todos os serviços modulares para fácil importação
 */

export { escolasService } from './escolasService.js';
export { municipiosService } from './municipiosService.js';
export { alunosService } from './alunosService.js';
export { avaliacoesService } from './avaliacoesService.js';
export { questionariosService } from './questionariosService.js';

// Re-exportar httpClient e authStorage para conveniência
export { fetchWithAuth, fetchWithoutAuth, fetchWithToken } from './httpClient.js';
export {
    getAccessToken,
    getRefreshToken,
    setAccessToken,
    setRefreshToken,
    clearAuthData,
    saveAuthData,
    getCurrentUser,
    isAuthenticated
} from './authStorage.js';
