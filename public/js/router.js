// Simple SPA Router

class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.beforeEachHooks = [];

        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleRouteChange());
        window.addEventListener('load', () => this.handleRouteChange());
    }

    /**
     * Register a route
     */
    addRoute(path, component) {
        this.routes[path] = component;
    }

    /**
     * Navigate to a route
     */
    navigate(path) {
        window.location.hash = path;
    }

    /**
     * Add before navigation hook
     */
    beforeEach(hook) {
        this.beforeEachHooks.push(hook);
    }

    /**
     * Handle route changes
     */
    async handleRouteChange() {
        const hash = window.location.hash.slice(1) || '/';
        // Separar path de query params
        const [path, queryString] = hash.split('?');
        const route = this.routes[path];

        // Run before each hooks
        for (const hook of this.beforeEachHooks) {
            const result = await hook(path, this.currentRoute);
            if (result === false) {
                // Navigation cancelled
                return;
            }
        }

        if (route) {
            this.currentRoute = path;
            await this.renderRoute(route);
        } else {
            // 404 - Route not found
            this.render404();
        }
    }

    /**
     * Render a route component
     */
    async renderRoute(component) {
        const appContainer = document.getElementById('app');
        if (!appContainer) {
            console.error('App container not found');
            return;
        }

        try {
            // Show loading
            this.showLoading();

            // Render component
            const content = await component();
            appContainer.innerHTML = content;

            // Hide loading
            this.hideLoading();

            // Trigger custom event for component mounted
            window.dispatchEvent(new CustomEvent('route-changed', {
                detail: { route: this.currentRoute }
            }));
        } catch (error) {
            console.error('Error rendering route:', error);
            this.renderError(error);
        }
    }

    /**
     * Render 404 page
     */
    render404() {
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = `
            <div class="container" style="padding-top: 4rem; text-align: center;">
                <h1 style="font-size: 6rem; margin-bottom: 1rem;">404</h1>
                <h2>Página não encontrada</h2>
                <p style="margin: 2rem 0;">A página que você está procurando não existe.</p>
                <button class="btn btn-primary" onclick="router.navigate('/')">
                    Voltar para o início
                </button>
            </div>
        `;
    }

    /**
     * Render error page
     */
    renderError(error) {
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = `
            <div class="container" style="padding-top: 4rem; text-align: center;">
                <h1 style="color: var(--error-500);">Erro</h1>
                <p style="margin: 2rem 0;">Ocorreu um erro ao carregar a página.</p>
                <p style="color: var(--gray-600); font-size: 0.875rem;">${error.message}</p>
                <button class="btn btn-primary" onclick="location.reload()">
                    Recarregar página
                </button>
            </div>
        `;
    }

    /**
     * Show loading spinner
     */
    showLoading() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.classList.remove('hidden');
        }
    }

    /**
     * Hide loading spinner
     */
    hideLoading() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.classList.add('hidden');
        }
    }

    /**
     * Get current route
     */
    getCurrentRoute() {
        return this.currentRoute;
    }

    /**
     * Get query parameters
     */
    getQueryParams() {
        const hash = window.location.hash;
        const queryString = hash.split('?')[1];
        if (!queryString) return {};

        return queryString.split('&').reduce((params, param) => {
            const [key, value] = param.split('=');
            params[key] = decodeURIComponent(value);
            return params;
        }, {});
    }
}

// Create global router instance
export const router = new Router();

// Make router available globally
window.router = router;
