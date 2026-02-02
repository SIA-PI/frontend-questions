// Relatórios Page - Dashboard Administrativo Completo

import { getCurrentUser } from '../utils/api.js';
import { Sidebar, setupLogoutButton } from './Sidebar.js';

export async function RelatoriosPage() {
    const user = getCurrentUser();

    if (!user) {
        window.router.navigate('/login');
        return '<div></div>';
    }

    // Verificar se é admin
    const isAdmin = user.role === 'admin';

    return `
        <div class="flex h-screen w-full flex-row">
            ${Sidebar(user, 'relatorios')}
            
            <main class="flex-1 flex flex-col h-full overflow-y-auto scrollbar-hide bg-slate-50 dark:bg-background-dark">
                <div class="w-full max-w-[1400px] mx-auto p-6 md:p-8 flex flex-col gap-6">
                    <!-- Header -->
                    <div class="flex flex-col gap-3">
                        <div class="flex items-center justify-between">
                            <div>
                                <h1 class="text-[#0d121b] dark:text-white tracking-tight text-2xl md:text-3xl font-bold leading-tight">
                                    Relatórios ${isAdmin ? 'Administrativos' : ''}
                                </h1>
                                <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                    ${isAdmin ? 'Visão completa de todos os dados do sistema' : 'Visualize seus relatórios e estatísticas'}
                                </p>
                            </div>
                            <div class="flex items-center gap-2">
                                <button class="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
                                    <span class="material-symbols-outlined text-[18px]">filter_list</span>
                                    Filtros
                                </button>
                                <button class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2">
                                    <span class="material-symbols-outlined text-[18px]">download</span>
                                    Exportar
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Cards de Estatísticas Gerais -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        ${getStatsCards(isAdmin).map(card => `
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
                                <select class="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option>Todas as Cidades</option>
                                    <option>São Paulo - SP</option>
                                    <option>Rio de Janeiro - RJ</option>
                                    <option>Belo Horizonte - MG</option>
                                </select>
                                <select class="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option>Todas as Escolas</option>
                                    <option>Escola Central</option>
                                    <option>Escola Norte</option>
                                    <option>Escola Sul</option>
                                </select>
                                <select class="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option>Todos os Avaliadores</option>
                                    <option>Maria Silva</option>
                                    <option>João Santos</option>
                                    <option>Ana Costa</option>
                                </select>
                                <select class="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option>Último mês</option>
                                    <option>Últimos 3 meses</option>
                                    <option>Último ano</option>
                                    <option>Personalizado</option>
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
                                        ${getAvaliadoresData().map(av => `
                                            <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                                <td class="py-4 px-6">
                                                    <div class="flex items-center gap-3">
                                                        <div class="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                                            <span class="text-sm font-bold text-slate-600 dark:text-slate-300">${av.nome.split(' ').map(n => n[0]).join('')}</span>
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
                                    ${getCidadesData().map(cidade => `
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
                                    ${getEscolasData().map(escola => `
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
                    ` : `
                        <!-- Visão do Avaliador -->
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
                    `}
                </div>
            </main>
        </div>
    `;
}

function getStatsCards(isAdmin) {
    if (isAdmin) {
        return [
            { label: 'Total de Avaliações', value: '1,247', change: '+12%', trend: 'up', icon: 'assignment', color: 'blue' },
            { label: 'Avaliadores Ativos', value: '45', change: '+5%', trend: 'up', icon: 'people', color: 'green' },
            { label: 'Escolas Cadastradas', value: '18', change: '+2', trend: 'up', icon: 'school', color: 'purple' },
            { label: 'Taxa de Conclusão', value: '87%', change: '-3%', trend: 'down', icon: 'check_circle', color: 'orange' }
        ];
    } else {
        return [
            { label: 'Minhas Avaliações', value: '28', change: '+4', trend: 'up', icon: 'assignment', color: 'blue' },
            { label: 'Concluídas', value: '24', change: '+3', trend: 'up', icon: 'check_circle', color: 'green' },
            { label: 'Em Andamento', value: '3', change: '0', trend: 'up', icon: 'timelapse', color: 'orange' },
            { label: 'Pendentes', value: '1', change: '+1', trend: 'up', icon: 'pending', color: 'red' }
        ];
    }
}

function getAvaliadoresData() {
    return [
        { nome: 'Maria Silva', email: 'maria@escola.com', cidade: 'São Paulo - SP', escola: 'Escola Central', total: 45, concluidas: 42, taxa: 93 },
        { nome: 'João Santos', email: 'joao@escola.com', cidade: 'São Paulo - SP', escola: 'Escola Norte', total: 38, concluidas: 35, taxa: 92 },
        { nome: 'Ana Costa', email: 'ana@escola.com', cidade: 'Rio de Janeiro - RJ', escola: 'Escola Sul', total: 52, concluidas: 48, taxa: 92 },
        { nome: 'Pedro Oliveira', email: 'pedro@escola.com', cidade: 'Belo Horizonte - MG', escola: 'Escola Leste', total: 41, concluidas: 32, taxa: 78 },
        { nome: 'Carla Mendes', email: 'carla@escola.com', cidade: 'São Paulo - SP', escola: 'Escola Oeste', total: 29, concluidas: 15, taxa: 52 }
    ];
}

function getCidadesData() {
    return [
        { nome: 'São Paulo - SP', total: 485, porcentagem: 100 },
        { nome: 'Rio de Janeiro - RJ', total: 342, porcentagem: 70 },
        { nome: 'Belo Horizonte - MG', total: 256, porcentagem: 53 },
        { nome: 'Curitiba - PR', total: 164, porcentagem: 34 }
    ];
}

function getEscolasData() {
    return [
        { nome: 'Escola Central', total: 245, porcentagem: 100 },
        { nome: 'Escola Norte', total: 198, porcentagem: 81 },
        { nome: 'Escola Sul', total: 187, porcentagem: 76 },
        { nome: 'Escola Leste', total: 156, porcentagem: 64 },
        { nome: 'Escola Oeste', total: 142, porcentagem: 58 }
    ];
}

// Initialize after component is mounted
window.addEventListener('route-changed', (e) => {
    if (e.detail.route === '/relatorios') {
        setupLogoutButton();
    }
});
