// Main Application Entry Point

import { router } from './router.js';
import { LoginPage } from './components/LoginPage.js';
import { DashboardPage } from './components/DashboardPage.js';
import { AvaliacoesPage } from './components/AvaliacoesPage.js';
import { SelecionarAlunoPage } from './components/SelecionarAlunoPage.js';
import { NovaAvaliacaoPage } from './components/NovaAvaliacaoPage.js';
import { AlunosPage } from './components/AlunosPage.js';
import { AvaliadoresPage } from './components/AvaliadoresPage.js';
import { DelegaciasPage } from './components/DelegaciasPage.js';
import { RelatoriosPage } from './components/RelatoriosPage.js';
import { isAuthenticated } from './utils/api.js';
import { toast } from './utils/toast.js';

/**
 * Initialize the application
 */
function initApp() {
    console.log('🚀 Initializing SSP Delegacias Application...');

    // Setup router
    setupRouter();

    // Setup global error handling
    setupErrorHandling();

    // Setup dark mode toggle
    setupDarkMode();

    // Check authentication and start routing
    checkAuth();

    console.log('✅ Application initialized successfully');
}

/**
 * Setup application routes
 */
function setupRouter() {
    // Public routes
    router.addRoute('/', LoginPage);
    router.addRoute('/login', LoginPage);

    // Protected routes
    router.addRoute('/dashboard', DashboardPage);
    router.addRoute('/avaliacoes', AvaliacoesPage);
    router.addRoute('/avaliacoes/selecionar-aluno', SelecionarAlunoPage);
    router.addRoute('/avaliacoes/nova', NovaAvaliacaoPage);
    router.addRoute('/alunos', AlunosPage);
    router.addRoute('/avaliadores', AvaliadoresPage);
    router.addRoute('/delegacias', DelegaciasPage);
    router.addRoute('/relatorios', RelatoriosPage);

    // Add authentication guard
    router.beforeEach((to, from) => {
        const publicRoutes = ['/', '/login'];
        const requiresAuth = !publicRoutes.includes(to);

        if (requiresAuth && !isAuthenticated()) {
            toast.warning('Você precisa fazer login para acessar esta página');
            router.navigate('/login');
            return false; // Cancel navigation
        }

        // Redirect to dashboard if already authenticated and trying to access login
        if (publicRoutes.includes(to) && isAuthenticated()) {
            router.navigate('/dashboard');
            return false;
        }

        return true; // Allow navigation
    });
}

/**
 * Setup global error handling
 */
function setupErrorHandling() {
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
        toast.error('Ocorreu um erro inesperado');
    });

    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        toast.error('Erro ao processar requisição');
    });
}

/**
 * Setup dark mode functionality
 */
function setupDarkMode() {
    // Check for saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    // Listen for theme toggle events
    window.addEventListener('toggle-dark-mode', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

/**
 * Check authentication status
 */
function checkAuth() {
    const currentHash = window.location.hash.slice(1) || '/';

    if (!isAuthenticated() && currentHash !== '/login' && currentHash !== '/') {
        router.navigate('/login');
    } else if (isAuthenticated() && (currentHash === '/login' || currentHash === '/')) {
        router.navigate('/dashboard');
    }
}

/**
 * Utility function to toggle dark mode (can be called from anywhere)
 */
window.toggleDarkMode = function () {
    window.dispatchEvent(new CustomEvent('toggle-dark-mode'));
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Export for debugging
window.app = {
    router,
    toast,
    version: '1.0.0'
};
