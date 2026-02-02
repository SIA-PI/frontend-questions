// Delegacias Page Component

import { getCurrentUser } from '../utils/api.js';
import { mockDelegacias } from '../../data/mock-data.js';

export async function DelegaciasPage() {
    const user = getCurrentUser();

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
                    
                    <!-- Delegacias Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        ${mockDelegacias.map(delegacia => `
                            <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow">
                                <div class="flex items-start gap-4">
                                    <div class="p-3 bg-primary/10 rounded-lg">
                                        <span class="material-symbols-outlined text-primary text-[32px]">domain</span>
                                    </div>
                                    <div class="flex-1">
                                        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">${delegacia.nome}</h3>
                                        <div class="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                            <div class="flex items-center gap-2">
                                                <span class="material-symbols-outlined text-[18px]">location_on</span>
                                                <span>${delegacia.endereco}, ${delegacia.cidade}</span>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <span class="material-symbols-outlined text-[18px]">phone</span>
                                                <span>${delegacia.telefone}</span>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <span class="material-symbols-outlined text-[18px]">person</span>
                                                <span>${delegacia.responsavel}</span>
                                            </div>
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
