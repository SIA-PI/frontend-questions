// Dashboard Page - Visualização de dados enriquecida com gráficos e contexto (Escola/Cidade)

import { getCurrentUser, api } from '../utils/api.js';
import { Sidebar, setupLogoutButton } from './Sidebar.js';

// Utilitários de Formatação
const statusInfo = {
    nao_iniciado: { label: 'Pendente', class: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400', icon: 'pending', color: '#f97316' },
    em_andamento: { label: 'Em Andamento', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300', icon: 'timeline', color: '#3b82f6' },
    concluido: { label: 'Concluído', class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: 'check_circle', color: '#22c55e' },
    finalizado: { label: 'Finalizada', class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: 'check_circle', color: '#22c55e' },
};

export async function DashboardPage() {
    const user = getCurrentUser();
    if (!user) {
        window.router.navigate('/login');
        return '<div></div>';
    }

    let loading = true;
    let error = null;
    let dashboardData = {};

    try {
        const [statsRes, alunosRes, avaliacoesRes] = await Promise.all([
            api.getDashboardStats(),
            user.role === 'admin' ? api.getAlunos({ page: 1 }) : api.getAlunosPorAvaliador(user.id),
            api.getAssessments({ page: 1 })
        ]);

        const alunos = Array.isArray(alunosRes.data) ? alunosRes.data : (alunosRes.results || []);
        const avaliacoesRecentes = (avaliacoesRes.data || []).slice(0, 5);

        const totalAlunos = statsRes?.total_alunos ?? (alunosRes.count ?? alunos.length);
        const totalAvaliacoes = statsRes?.total_avaliacoes ?? (avaliacoesRes.count || 0);
        const avaliacoesPorStatus = statsRes?.avaliacoes_por_status || {
            nao_iniciado: 0,
            em_andamento: 0,
            concluido: 0,
            finalizado: 0,
        };
        const alunosPorTurmaTop5 = Array.isArray(statsRes?.alunos_por_turma_top5)
            ? statsRes.alunos_por_turma_top5
            : [];

        // 2. Enriquecer Contexto (Escola, Cidade)
        // Se for admin, pega do primeiro aluno ou mostra Geral. Se for avaliador, pega da escola vinculada ao user (se houvesse endpoint) ou infere dos alunos.
        // Assumindo que o avaliador vê alunos de uma única escola (ou poucas), vamos tentar descobrir a escola principal.

        let escolaNome = 'Todas as Escolas';
        let cidadeNome = '';

        // Estratégia: Pegar a escola do primeiro aluno que tiver escola vinculada
        if (alunos.length > 0) {
            // Backend já retorna escola_nome e municipio_nome via serializer
            const firstWithSchool = alunos.find(a => a.escola_nome);
            if (firstWithSchool) {
                escolaNome = firstWithSchool.escola_nome;
                cidadeNome = firstWithSchool.municipio_nome || '';
            }
        }

        dashboardData = {
            totalAlunos,
            totalAvaliacoes,
            escolaNome,
            cidadeNome,
            alunos,
            avaliacoesRecentes,
            avaliacoesPorStatus,
            alunosPorTurmaTop5,
        };

        loading = false;

    } catch (err) {
        error = err.message || 'Erro ao carregar dashboard';
        loading = false;
        console.error(err);
    }

    return renderDashboard(user, loading, error, dashboardData);
}

function renderDashboard(user, loading, error, data) {
    if (loading) {
        return `
        <div class="flex h-screen w-full flex-row">
            ${Sidebar(user, 'dashboard')}
            <main class="flex-1 flex items-center justify-center h-full bg-slate-50 dark:bg-background-dark">
                <div class="flex flex-col items-center gap-4">
                    <div class="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
                    <p class="text-slate-500">Preparando seu painel...</p>
                </div>
            </main>
        </div>`;
    }

    if (error) {
        return `
        <div class="flex h-screen w-full flex-row">
            ${Sidebar(user, 'dashboard')}
            <main class="flex-1 p-8 bg-slate-50 dark:bg-background-dark">
                <div class="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
                    <h3 class="font-bold">Erro ao carregar</h3>
                    <p>${error}</p>
                    <button onclick="window.location.reload()" class="mt-2 text-sm underline">Tentar novamente</button>
                </div>
            </main>
        </div>`;
    }

    const { totalAlunos, totalAvaliacoes, escolaNome, cidadeNome, alunos, avaliacoesRecentes, avaliacoesPorStatus, alunosPorTurmaTop5 } = data;

    // Cálculos para Gráficos
    const pendentes = Math.max(0, totalAlunos - totalAvaliacoes);
    const concluidos = (avaliacoesPorStatus?.concluido || 0) + (avaliacoesPorStatus?.finalizado || 0);
    const iniciadasNaoConcluidas = avaliacoesPorStatus?.em_andamento || 0;

    window.dashboardStats = {
        avaliacoesPorStatus: {
            nao_iniciado: avaliacoesPorStatus?.nao_iniciado || 0,
            em_andamento: avaliacoesPorStatus?.em_andamento || 0,
            concluido: avaliacoesPorStatus?.concluido || 0,
            finalizado: avaliacoesPorStatus?.finalizado || 0,
        },
        alunosPorTurmaTop5: Array.isArray(alunosPorTurmaTop5) ? alunosPorTurmaTop5 : [],
    };

    return `
        <div class="flex h-screen w-full flex-row overflow-hidden bg-slate-50 dark:bg-gray-900">
            ${Sidebar(user, 'dashboard')}
            
            <main class="flex-1 flex flex-col h-full overflow-y-auto scrollbar-hide">
                <!-- Header / Contexto -->
                <header class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20">
                    <div class="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 class="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary">dashboard</span>
                                Visão Geral
                            </h1>
                            <div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                                <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">school</span> ${escolaNome}</span>
                                ${cidadeNome ? `<span class="w-1 h-1 rounded-full bg-slate-300"></span><span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">location_on</span> ${cidadeNome}</span>` : ''}
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="text-sm font-medium text-slate-600 dark:text-slate-300">Ano Letivo 2026</span>
                            <div class="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                    ${user.name?.substr(0, 2).toUpperCase() || 'US'}
                                </div>
                                <div class="flex flex-col">
                                    <span class="text-xs font-bold text-slate-900 dark:text-white capitalize">${user.role}</span>
                                    <span class="text-[10px] text-slate-500 truncate max-w-[100px]">${user.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div class="max-w-7xl mx-auto px-6 py-8 w-full flex flex-col gap-8">
                    
                    <!-- KPI Cards -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
                            <div class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span class="material-symbols-outlined text-8xl text-blue-600">groups</span>
                            </div>
                            <div class="relative z-10">
                                <p class="text-slate-500 dark:text-slate-400 font-medium text-sm">Total de Alunos</p>
                                <h3 class="text-4xl font-bold text-slate-900 dark:text-white mt-2">${totalAlunos}</h3>
                                <div class="mt-4 flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-medium px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg w-fit">
                                    <span class="material-symbols-outlined text-[14px]">trending_up</span>
                                    Total matriculado
                                </div>
                            </div>
                        </div>

                        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
                            <div class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span class="material-symbols-outlined text-8xl text-green-600">assignment_turned_in</span>
                            </div>
                            <div class="relative z-10">
                                <p class="text-slate-500 dark:text-slate-400 font-medium text-sm">Avaliações Concluídas</p>
                                <h3 class="text-4xl font-bold text-slate-900 dark:text-white mt-2">${concluidos}</h3>
                                <div class="mt-4 flex items-center gap-2 text-xs text-green-600 dark:text-green-400 font-medium px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded-lg w-fit">
                                    <span class="material-symbols-outlined text-[14px]">check</span>
                                    Finalizadas com sucesso
                                </div>
                            </div>
                        </div>

                        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
                            <div class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span class="material-symbols-outlined text-8xl text-blue-600">timeline</span>
                            </div>
                            <div class="relative z-10">
                                <p class="text-slate-500 dark:text-slate-400 font-medium text-sm">Iniciadas (não concluídas)</p>
                                <h3 class="text-4xl font-bold text-slate-900 dark:text-white mt-2">${iniciadasNaoConcluidas}</h3>
                                <div class="mt-4 flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-medium px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg w-fit">
                                    <span class="material-symbols-outlined text-[14px]">pending_actions</span>
                                    Em andamento
                                </div>
                            </div>
                        </div>

                        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
                            <div class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span class="material-symbols-outlined text-8xl text-orange-600">pending_actions</span>
                            </div>
                            <div class="relative z-10">
                                <p class="text-slate-500 dark:text-slate-400 font-medium text-sm">Pendentes</p>
                                <h3 class="text-4xl font-bold text-slate-900 dark:text-white mt-2">${pendentes}</h3>
                                <div class="mt-4 flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400 font-medium px-2 py-1 bg-orange-50 dark:bg-orange-900/20 rounded-lg w-fit">
                                    <span class="material-symbols-outlined text-[14px]">priority_high</span>
                                    Aguardando avaliação
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Charts Section -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <!-- Status Chart -->
                        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
                            <h3 class="font-bold text-slate-900 dark:text-white mb-6">Status das Avaliações</h3>
                            <div class="flex-1 min-h-[250px] relative w-full flex items-center justify-center">
                                <canvas id="chartStatus"></canvas>
                            </div>
                        </div>

                        <!-- Turmas Chart -->
                        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
                            <h3 class="font-bold text-slate-900 dark:text-white mb-6">Alunos por Turma (Top 5)</h3>
                             <div class="flex-1 min-h-[250px] relative w-full">
                                <canvas id="chartTurmas"></canvas>
                            </div>
                        </div>
                    </div>

                    <!-- Recent Activity -->
                    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                        <div class="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                            <h3 class="font-bold text-slate-900 dark:text-white">Avaliações Recentes</h3>
                            <a href="#/avaliacoes" class="text-sm text-primary font-medium hover:underline">Ver todas</a>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left">
                                <thead class="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase text-slate-500 dark:text-slate-400">
                                    <tr>
                                        <th class="px-6 py-4 font-semibold">Aluno</th>
                                        <th class="px-6 py-4 font-semibold">Data</th>
                                        <th class="px-6 py-4 font-semibold">Status</th>
                                        <th class="px-6 py-4 font-semibold text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                                    ${avaliacoesRecentes.length === 0
            ? `<tr><td colspan="4" class="px-6 py-8 text-center text-slate-500">Nenhuma atividade recente.</td></tr>`
            : avaliacoesRecentes.map(av => {
                const status = statusInfo[av.status] || statusInfo.nao_iniciado;
                const alunoNome = av.aluno_nome || ('Aluno #' + (av.id || '').toString().slice(0, 8));
                const data = new Date(av.created_at || av.updated_at || Date.now()).toLocaleDateString('pt-BR');

                // Usa aluno_nome do serializer (já é nome legível)
                const displayNome = alunoNome;

                return `
                                            <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                                <td class="px-6 py-4">
                                                    <div class="flex items-center gap-3">
                                                        <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                                                            ${displayNome.substr(0, 2).toUpperCase()}
                                                        </div>
                                                        <span class="text-sm font-medium text-slate-900 dark:text-white">${displayNome}</span>
                                                    </div>
                                                </td>
                                                <td class="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">${data}</td>
                                                <td class="px-6 py-4">
                                                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.class}">
                                                        <span class="material-symbols-outlined text-[14px]">${status.icon}</span>
                                                        ${status.label}
                                                    </span>
                                                </td>
                                                <td class="px-6 py-4 text-right">
                                                    <a href="#/avaliacoes/nova?aluno=${av.aluno}" class="text-slate-400 hover:text-primary transition-colors">
                                                        <span class="material-symbols-outlined">visibility</span>
                                                    </a>
                                                </td>
                                            </tr>
                                            `;
            }).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `;
}

// Inicializar gráficos após renderização
setTimeout(() => {
    // Verificar se Chart.js carregou
    if (typeof Chart === 'undefined') return;

    // Verificar se elementos existem (apenas se estivermos na rota dashboard)
    const ctxStatus = document.getElementById('chartStatus');
    const ctxTurmas = document.getElementById('chartTurmas');

    if (ctxStatus && ctxTurmas) {
        const stats = window.dashboardStats || {};
        const s = stats.avaliacoesPorStatus || {};
        const turmasTop5 = Array.isArray(stats.alunosPorTurmaTop5) ? stats.alunosPorTurmaTop5 : [];

        const statusLabels = ['Não Iniciada', 'Em Andamento', 'Concluída', 'Finalizada'];
        const statusData = [
            Number(s.nao_iniciado || 0),
            Number(s.em_andamento || 0),
            Number(s.concluido || 0),
            Number(s.finalizado || 0),
        ];

        const turmasLabels = turmasTop5.length ? turmasTop5.map(t => t.turma) : ['Sem dados'];
        const turmasData = turmasTop5.length ? turmasTop5.map(t => Number(t.total || 0)) : [0];

        new Chart(ctxStatus, {
            type: 'doughnut',
            data: {
                labels: statusLabels,
                datasets: [{
                    data: statusData,
                    backgroundColor: ['#f97316', '#3b82f6', '#22c55e', '#16a34a'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } }
                }
            }
        });

        new Chart(ctxTurmas, {
            type: 'bar',
            data: {
                labels: turmasLabels,
                datasets: [{
                    label: 'Alunos',
                    data: turmasData,
                    backgroundColor: '#135bec',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, grid: { display: false } },
                    x: { grid: { display: false } }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
}, 500);
