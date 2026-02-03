// Relatórios Page - Dashboard com dados da API

import { getCurrentUser, api } from '../utils/api.js';
import { Sidebar, setupLogoutButton } from './Sidebar.js';

export async function RelatoriosPage() {
    const user = getCurrentUser();

    if (!user) {
        window.router.navigate('/login');
        return '<div></div>';
    }

    const isAdmin = user.role === 'admin';

    if (!isAdmin) {
        return `
        <div class="flex h-screen w-full flex-row">
            ${Sidebar(user, 'relatorios')}
            <main class="flex-1 flex flex-col h-full overflow-y-auto scrollbar-hide bg-white dark:bg-background-dark">
                <div class="w-full max-w-[800px] mx-auto p-8 md:p-12 flex flex-col items-center justify-center min-h-[60vh]">
                    <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-8 text-center">
                        <span class="material-symbols-outlined text-amber-600 dark:text-amber-400 text-[48px] mb-4 block">block</span>
                        <h2 class="text-xl font-bold text-amber-800 dark:text-amber-200 mb-2">Acesso restrito</h2>
                        <p class="text-amber-700 dark:text-amber-300 mb-6">Você não tem permissão para executar essa ação.</p>
                        <a href="#/dashboard" class="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">Ir para o Dashboard</a>
                    </div>
                </div>
            </main>
        </div>`;
    }

    let statsCards = [];
    let avaliadoresData = [];
    let cidadesData = [];
    let escolasData = [];
    let municipios = [];
    let escolas = [];
    let loading = true;
    let error = null;

    try {
        const [avaliacoesRes, avaliadoresRes, municipiosRes, escolasRes] = await Promise.all([
            api.getAssessments({ page: 1 }),
            api.getAvaliadores({ page: 1 }),
            api.getMunicipios({ page: 1 }),
            api.getEscolas({ page: 1 }),
        ]);
        const avaliacoes = avaliacoesRes.data || [];
        const totalAvaliacoes = avaliacoesRes.count ?? avaliacoes.length;
        const concluidas = avaliacoes.filter(r => r.status === 'concluido' || r.status === 'finalizado').length;
        const emAndamento = avaliacoes.filter(r => r.status === 'em_andamento').length;
        const pendentes = avaliacoes.filter(r => r.status === 'nao_iniciado').length;
        const taxa = totalAvaliacoes ? Math.round((concluidas / totalAvaliacoes) * 100) : 0;

        if (isAdmin) {
            const avaliadores = avaliadoresRes.data || [];
            escolas = escolasRes.data || [];
            municipios = municipiosRes.data || [];
            statsCards = [
                { label: 'Total de Avaliações', value: String(totalAvaliacoes), change: '—', trend: 'up', icon: 'assignment', color: 'blue' },
                { label: 'Avaliadores Ativos', value: String(avaliadores.length), change: '—', trend: 'up', icon: 'people', color: 'green' },
                { label: 'Escolas Cadastradas', value: String(escolas.length), change: '—', trend: 'up', icon: 'school', color: 'purple' },
                { label: 'Taxa de Conclusão', value: taxa + '%', change: '—', trend: 'up', icon: 'check_circle', color: 'orange' },
            ];
            avaliadoresData = avaliadores.map(av => ({
                id: av.id,
                nome: (av.user && av.user.username) || '—',
                email: (av.user && av.user.email) || '—',
                cidade: av.escola && typeof av.escola === 'object' && av.escola.municipio ? (typeof av.escola.municipio === 'object' ? av.escola.municipio.nome : av.escola.municipio) : '—',
                escola: av.escola && (typeof av.escola === 'object' ? av.escola.nome : av.escola) || '—',
                total: 0,
                concluidas: 0,
                taxa: 0,
            }));
            const totalPorCidade = {};
            municipios.forEach(m => { totalPorCidade[m.nome] = 0; });
            const maxCidade = Math.max(...Object.values(totalPorCidade), 1);
            cidadesData = municipios.map(m => ({ nome: m.nome, total: totalPorCidade[m.nome] || 0, porcentagem: Math.round(((totalPorCidade[m.nome] || 0) / maxCidade) * 100) || 0 }));
            const totalPorEscola = {};
            escolas.forEach(e => { totalPorEscola[e.nome] = 0; });
            const maxEscola = Math.max(...Object.values(totalPorEscola), 1);
            escolasData = escolas.map(e => ({ nome: e.nome, total: totalPorEscola[e.nome] || 0, porcentagem: maxEscola ? Math.round(((totalPorEscola[e.nome] || 0) / maxEscola) * 100) : 0 }));
        } else {
            statsCards = [
                { label: 'Minhas Avaliações', value: String(totalAvaliacoes), change: '—', trend: 'up', icon: 'assignment', color: 'blue' },
                { label: 'Concluídas', value: String(concluidas), change: '—', trend: 'up', icon: 'check_circle', color: 'green' },
                { label: 'Em Andamento', value: String(emAndamento), change: '—', trend: 'up', icon: 'timelapse', color: 'orange' },
                { label: 'Pendentes', value: String(pendentes), change: '—', trend: 'up', icon: 'pending', color: 'red' },
            ];
        }
        loading = false;
    } catch (err) {
        error = err.message || 'Erro ao carregar relatórios';
        loading = false;
    }

    const avaliadorBlock = !isAdmin && !loading && !error
        ? `
                        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
                            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                                <span class="material-symbols-outlined text-primary text-[48px]">bar_chart</span>
                            </div>
                            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">Relatórios Pessoais</h2>
                            <p class="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
                                Aqui você poderá visualizar seus relatórios individuais e estatísticas de desempenho.
                            </p>
                            <button onclick="window.router.navigate('/dashboard')" class="px-6 py-3 bg-primary hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
                                Voltar ao Dashboard
                            </button>
                        </div>
                    `
        : '';

    return `
        <div class="flex h-screen w-full flex-row">
            ${Sidebar(user, 'relatorios')}
            <main class="flex-1 flex flex-col h-full overflow-y-auto scrollbar-hide bg-slate-50 dark:bg-background-dark">
                <div class="w-full max-w-[1400px] mx-auto p-6 md:p-8 flex flex-col gap-6">
                    <div class="flex flex-col gap-3">
                        <div class="flex items-center justify-between">
                            <div>
                                <h1 class="text-[#0d121b] dark:text-white tracking-tight text-2xl md:text-3xl font-bold leading-tight">Relatórios ${isAdmin ? 'Administrativos' : ''}</h1>
                                <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">${isAdmin ? 'Visão completa de todos os dados do sistema' : 'Visualize seus relatórios e estatísticas'}</p>
                            </div>
                            <div class="flex items-center gap-2">
                                <button class="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
                                    <span class="material-symbols-outlined text-[18px]">filter_list</span> Filtros
                                </button>
                                <button class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2">
                                    <span class="material-symbols-outlined text-[18px]">download</span> Exportar
                                </button>
                            </div>
                        </div>
                    </div>
                    ${loading ? `
                    <div class="flex items-center justify-center py-12"><div class="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div></div>
                    ` : error ? `
                    <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-red-700 dark:text-red-300">${error}</div>
                    ` : `
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        ${statsCards.map(card => `
                            <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow">
                                <div class="flex items-center justify-between mb-4">
                                    <div class="p-3 bg-${card.color}-50 dark:bg-${card.color}-900/20 rounded-lg">
                                        <span class="material-symbols-outlined text-${card.color}-600 dark:text-${card.color}-400 text-[24px]">${card.icon}</span>
                                    </div>
                                    <span class="text-xs font-semibold px-2 py-1 rounded ${card.trend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}">
                                        ${card.change}
                                    </span>
                                </div>
                                <div>
                                    <p class="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">${card.label}</p>
                                    <p class="text-slate-900 dark:text-white text-2xl font-bold">${card.value}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    ${isAdmin ? `
                        <!-- Filtros por Região/Escola -->
                        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                            <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Filtrar Dados</h2>
                            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <select id="filter-rel-municipio" class="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option value="">Todas as Cidades</option>
                                    ${(municipios || []).map(m => `<option value="${m.id}">${m.nome || ''}</option>`).join('')}
                                </select>
                                <select id="filter-rel-escola" class="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option value="">Todas as Escolas</option>
                                    ${(escolas || []).map(e => `<option value="${e.id}">${e.nome || ''}</option>`).join('')}
                                </select>
                                <select id="filter-rel-avaliador" class="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option value="">Todos os Avaliadores</option>
                                    ${(avaliadoresData || []).map(av => `<option value="${av.id || ''}">${av.nome || ''}</option>`).join('')}
                                </select>
                                <select id="filter-rel-periodo" class="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option value="">Período</option>
                                    <option value="30">Último mês</option>
                                    <option value="90">Últimos 3 meses</option>
                                    <option value="365">Último ano</option>
                                </select>
                            </div>
                        </div>

                        <!-- Tabela de Avaliadores -->
                        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <div class="p-6 border-b border-slate-200 dark:border-slate-700">
                                <h2 class="text-lg font-bold text-slate-900 dark:text-white">Desempenho por Avaliador</h2>
                            </div>
                            <div class="overflow-x-auto">
                                <table class="w-full text-left border-collapse">
                                    <thead>
                                        <tr class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                            <th class="py-3 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Avaliador</th>
                                            <th class="py-3 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Cidade</th>
                                            <th class="py-3 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Escola</th>
                                            <th class="py-3 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 text-center">Avaliações</th>
                                            <th class="py-3 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 text-center">Concluídas</th>
                                            <th class="py-3 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 text-right">Taxa</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                                        ${avaliadoresData.map(av => `
                                            <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                                <td class="py-4 px-6">
                                                    <div class="flex items-center gap-3">
                                                        <div class="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                                            <span class="text-sm font-bold text-slate-600 dark:text-slate-300">${(av.nome || '?').toString().split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                                                        </div>
                                                        <div>
                                                            <p class="text-sm font-semibold text-slate-900 dark:text-white">${av.nome}</p>
                                                            <p class="text-xs text-slate-500">${av.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">${av.cidade}</td>
                                                <td class="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">${av.escola}</td>
                                                <td class="py-4 px-6 text-sm text-slate-900 dark:text-white text-center font-semibold">${av.total}</td>
                                                <td class="py-4 px-6 text-sm text-slate-900 dark:text-white text-center font-semibold">${av.concluidas}</td>
                                                <td class="py-4 px-6 text-right">
                                                    <div class="flex items-center justify-end gap-2">
                                                        <span class="text-sm font-bold ${av.taxa >= 80 ? 'text-green-600 dark:text-green-400' : av.taxa >= 50 ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'}">${av.taxa}%</span>
                                                        <div class="h-2 w-20 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                                                            <div class="h-full ${av.taxa >= 80 ? 'bg-green-500' : av.taxa >= 50 ? 'bg-orange-500' : 'bg-red-500'} rounded-full" style="width: ${av.taxa}%"></div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Estatísticas por Cidade -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                                <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Avaliações por Cidade</h2>
                                <div class="space-y-4">
                                    ${cidadesData.map(cidade => `
                                        <div>
                                            <div class="flex items-center justify-between mb-2">
                                                <span class="text-sm font-medium text-slate-700 dark:text-slate-300">${cidade.nome}</span>
                                                <span class="text-sm font-bold text-slate-900 dark:text-white">${cidade.total}</span>
                                            </div>
                                            <div class="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                                                <div class="h-full bg-primary rounded-full transition-all" style="width: ${cidade.porcentagem}%"></div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                                <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Avaliações por Escola</h2>
                                <div class="space-y-4">
                                    ${escolasData.map(escola => `
                                        <div>
                                            <div class="flex items-center justify-between mb-2">
                                                <span class="text-sm font-medium text-slate-700 dark:text-slate-300">${escola.nome}</span>
                                                <span class="text-sm font-bold text-slate-900 dark:text-white">${escola.total}</span>
                                            </div>
                                            <div class="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                                                <div class="h-full bg-blue-500 rounded-full transition-all" style="width: ${escola.porcentagem}%"></div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    ` : ''}
                    ${avaliadorBlock}
                `}
                </div>
            </main>
        </div>
    `;
}

// Initialize after component is mounted
window.addEventListener('route-changed', (e) => {
    if (e.detail.route === '/relatorios') {
        setupLogoutButton();
    }
});
