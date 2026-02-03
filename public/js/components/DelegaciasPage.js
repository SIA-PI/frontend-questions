// Delegacias Page Component

import { getCurrentUser } from '../services/authStorage.js';
import { escolasService } from '../services/escolasService.js';

let escolas = [];
let loading = true;
let error = null;

export async function DelegaciasPage() {
    const user = getCurrentUser();

    // Buscar escolas (delegacias) da API
    try {
        loading = true;
        error = null;
        const response = await escolasService.getAll();
        escolas = response.data || [];
        loading = false;
    } catch (err) {
        console.error('❌ Erro ao carregar escolas:', err);
        error = err.message || 'Erro ao carregar delegacias';
        loading = false;
        escolas = [];
    }

    return `
        <div class="flex h-screen w-full flex-row">
            ${getSidebar(user, 'delegacias')}
            
            <!-- Main Content -->
            <main class="flex-1 flex flex-col h-full overflow-y-auto scrollbar-hide bg-white dark:bg-background-dark">
                <div class="w-full max-w-[1200px] mx-auto p-8 md:p-12 flex flex-col gap-10">
                    <!-- Header -->
                    <div class="flex flex-col gap-4">
                        <h1 class="text-[#0d121b] dark:text-white tracking-tight text-[32px] md:text-4xl font-bold leading-tight">
                            Delegacias
                        </h1>
                        <p class="text-slate-600 dark:text-slate-400">Gerencie as delegacias cadastradas no sistema</p>
                    </div>
                    
                    ${loading ? `
                        <!-- Loading State -->
                        <div class="flex items-center justify-center py-20">
                            <div class="flex flex-col items-center gap-4">
                                <div class="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
                                <p class="text-slate-600 dark:text-slate-400">Carregando delegacias...</p>
                            </div>
                        </div>
                    ` : error ? `
                        <!-- Error State -->
                        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                            <div class="flex items-start gap-3">
                                <span class="material-symbols-outlined text-red-600 dark:text-red-400 text-[24px]">error</span>
                                <div>
                                    <h3 class="font-semibold text-red-900 dark:text-red-200 mb-1">Erro ao carregar dados</h3>
                                    <p class="text-red-700 dark:text-red-300 text-sm">${error}</p>
                                    <button onclick="window.location.reload()" class="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors">
                                        Tentar Novamente
                                    </button>
                                </div>
                            </div>
                        </div>
                    ` : escolas.length === 0 ? `
                        <!-- Empty State -->
                        <div class="flex flex-col items-center justify-center py-20 text-center">
                            <span class="material-symbols-outlined text-slate-300 dark:text-slate-600 text-[64px] mb-4">domain</span>
                            <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">Nenhuma delegacia cadastrada</h3>
                            <p class="text-slate-600 dark:text-slate-400 mb-6">Comece cadastrando a primeira delegacia no sistema</p>
                            <button class="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors">
                                <span class="flex items-center gap-2">
                                    <span class="material-symbols-outlined text-[20px]">add</span>
                                    Nova Delegacia
                                </span>
                            </button>
                        </div>
                    ` : `
                        <!-- Delegacias Grid -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            ${escolas.map(escola => `
                                <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow">
                                    <div class="flex items-start gap-4">
                                        <div class="p-3 bg-primary/10 rounded-lg">
                                            <span class="material-symbols-outlined text-primary text-[32px]">domain</span>
                                        </div>
                                        <div class="flex-1">
                                            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">${escola.nome}</h3>
                                            <div class="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                                ${escola.municipio ? `
                                                    <div class="flex items-center gap-2">
                                                        <span class="material-symbols-outlined text-[18px]">location_city</span>
                                                        <span>${typeof escola.municipio === 'object' ? escola.municipio.nome : escola.municipio}</span>
                                                    </div>
                                                ` : ''}
                                                ${escola.endereco ? `
                                                    <div class="flex items-center gap-2">
                                                        <span class="material-symbols-outlined text-[18px]">location_on</span>
                                                        <span>${escola.endereco}</span>
                                                    </div>
                                                ` : ''}
                                                ${escola.telefone ? `
                                                    <div class="flex items-center gap-2">
                                                        <span class="material-symbols-outlined text-[18px]">phone</span>
                                                        <span>${escola.telefone}</span>
                                                    </div>
                                                ` : ''}
                                            </div>
                                            <div class="mt-4 flex gap-2">
                                                <button class="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
                                                    Ver Detalhes
                                                </button>
                                                <button class="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                                    Editar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>
            </main>
        </div>
    `;
}

function getSidebar(user, activePage) {
    return `
        <aside class="hidden lg:flex w-72 bg-primary flex-col justify-between shrink-0 shadow-xl z-20 h-full border-r border-white/10 relative">
            <div class="absolute inset-y-0 right-0 w-px shadow-[0_0_20px_rgba(0,0,0,0.1)]"></div>
            <div class="flex flex-col p-6 gap-8">
                <div class="flex items-center gap-3 px-2">
                    <div class="bg-white/20 p-2 rounded-lg">
                        <span class="material-symbols-outlined text-white">shield</span>
                    </div>
                    <span class="text-white text-xl font-bold tracking-tight">SSP Delegacias</span>
                </div>
                <nav class="flex flex-col gap-2">
                    <a class="flex items-center gap-3 px-4 py-3 rounded-lg ${activePage === 'dashboard' ? 'bg-white/15 text-white shadow-sm ring-1 ring-white/10' : 'text-white/80 hover:bg-white/10 hover:text-white'} transition-all duration-200" href="#/dashboard">
                        <span class="material-symbols-outlined text-[24px]">dashboard</span>
                        <span class="text-sm ${activePage === 'dashboard' ? 'font-semibold' : 'font-medium'}">Dashboard</span>
                    </a>
                    <a class="flex items-center gap-3 px-4 py-3 rounded-lg ${activePage === 'avaliacoes' ? 'bg-white/15 text-white shadow-sm ring-1 ring-white/10' : 'text-white/80 hover:bg-white/10 hover:text-white'} transition-all duration-200" href="#/avaliacoes">
                        <span class="material-symbols-outlined text-[24px]">assignment</span>
                        <span class="text-sm ${activePage === 'avaliacoes' ? 'font-semibold' : 'font-medium'}">Avaliações</span>
                    </a>
                    <a class="flex items-center gap-3 px-4 py-3 rounded-lg ${activePage === 'delegacias' ? 'bg-white/15 text-white shadow-sm ring-1 ring-white/10' : 'text-white/80 hover:bg-white/10 hover:text-white'} transition-all duration-200" href="#/delegacias">
                        <span class="material-symbols-outlined text-[24px]">domain</span>
                        <span class="text-sm ${activePage === 'delegacias' ? 'font-semibold' : 'font-medium'}">Delegacias</span>
                    </a>
                    <a class="flex items-center gap-3 px-4 py-3 rounded-lg ${activePage === 'relatorios' ? 'bg-white/15 text-white shadow-sm ring-1 ring-white/10' : 'text-white/80 hover:bg-white/10 hover:text-white'} transition-all duration-200" href="#/relatorios">
                        <span class="material-symbols-outlined text-[24px]">bar_chart</span>
                        <span class="text-sm ${activePage === 'relatorios' ? 'font-semibold' : 'font-medium'}">Relatórios</span>
                    </a>
                    <div class="h-px bg-white/10 my-2 mx-4"></div>
                    <a class="flex items-center gap-3 px-4 py-3 rounded-lg ${activePage === 'configuracoes' ? 'bg-white/15 text-white shadow-sm ring-1 ring-white/10' : 'text-white/80 hover:bg-white/10 hover:text-white'} transition-all duration-200" href="#/configuracoes">
                        <span class="material-symbols-outlined text-[24px]">settings</span>
                        <span class="text-sm ${activePage === 'configuracoes' ? 'font-semibold' : 'font-medium'}">Configurações</span>
                    </a>
                </nav>
            </div>
            <div class="p-6">
                <div class="flex items-center gap-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/5 hover:bg-white/15 transition-colors cursor-pointer group">
                    <div class="bg-white/20 rounded-full h-10 w-10 flex items-center justify-center border-2 border-white/30 group-hover:border-white/50 transition-colors">
                        <span class="material-symbols-outlined text-white text-[20px]">person</span>
                    </div>
                    <div class="flex flex-col overflow-hidden">
                        <h3 class="text-white text-sm font-semibold truncate">${user.name}</h3>
                        <p class="text-blue-100 text-xs truncate">${user.role === 'admin' ? 'Administrador' : 'Avaliador'}</p>
                    </div>
                    <button id="logout-btn" class="ml-auto text-white/70 hover:text-white">
                        <span class="material-symbols-outlined text-[20px]">logout</span>
                    </button>
                </div>
            </div>
        </aside>
    `;
}

// Initialize after component is mounted
window.addEventListener('route-changed', (e) => {
    if (e.detail.route === '/delegacias') {
        initDelegaciasPage();
    }
});

function initDelegaciasPage() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.clear();
            window.router.navigate('/login');
        });
    }
}
