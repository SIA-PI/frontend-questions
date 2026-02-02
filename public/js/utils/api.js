// API Utility Functions

const API_BASE_URL = '/api';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    };

    const config = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro na requisição');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * API Methods
 */
export const api = {
    // Authentication
    login: async (username, password) => {
        return fetchAPI('/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
    },

    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
    },

    // Assessments
    getAssessments: async () => {
        return fetchAPI('/assessments');
    },

    getAssessment: async (id) => {
        return fetchAPI(`/assessments/${id}`);
    },

    createAssessment: async (data) => {
        return fetchAPI('/assessments', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    updateAssessment: async (id, data) => {
        return fetchAPI(`/assessments/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    deleteAssessment: async (id) => {
        return fetchAPI(`/assessments/${id}`, {
            method: 'DELETE'
        });
    },

    // Health Check
    healthCheck: async () => {
        return fetchAPI('/health');
    }
};

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
    return !!localStorage.getItem('authToken');
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

/**
 * Save auth data to localStorage
 */
export function saveAuthData(token, user) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
}
