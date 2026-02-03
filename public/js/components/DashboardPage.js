// Dashboard Page - Dados da API (alunos, resultados) com progresso real e link para continuar

import { getCurrentUser, api } from '../utils/api.js';
import { Sidebar, setupLogoutButton } from './Sidebar.js';

const statusLabel = { nao_iniciado: 'Pendente', em_andamento: 'Em Andamento', concluido: 'Concluído', finalizado: 'Finalizada' };
const statusClass = {
    nao_iniciado: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400',
    em_andamento: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    concluido: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
    finalizado: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
};

function getAlunoId(r) {
    return r.aluno && (typeof r.aluno === 'object' ? r.aluno.id : r.aluno);
}
function getQuestionarioId(r) {
    return r.questionario && (typeof r.questionario === 'object' ? r.questionario.id : r.questionario);
}

export async function DashboardPage() {
    const user = getCurrentUser();
    if (!user) {
        window.router.navigate('/login');
        return '<div></div>';
    }

    let alunosCount = 0;
    let resultados = [];
    let loading = true;
    let error = null;
    try {
        const [alunosRes, avaliacoesRes] = await Promise.all([
            user.role === 'admin' ? api.getAlunos({ page: 1 }) : api.getAlunosPorAvaliador(user.id).then(r => ({ data: r.data, count: (r.data || []).length })),
            api.getAssessments({ page: 1 }),
        ]);
        alunosCount = alunosRes.count ?? (alunosRes.data || []).length;
        resultados = (avaliacoesRes.data || []).slice(0, 10);
        loading = false;
    } catch (err) {
        error = err.message || 'Erro ao carregar dados';
        loading = false;
    }

    const concluidos = resultados.filter(r => r.status === 'concluido' || r.status === 'finalizado').length;
    const emAndamento = resultados.filter(r => r.status === 'em_andamento').length;
    const pendentes = resultados.filter(r => r.status === 'nao_iniciado').length;

    // Enriquecer cada resultado: aluno (nome, turma), progresso real (respostas/total questões)
    let rows = [];
    if (resultados.length > 0) {
        const enriched = await Promise.all(
            resultados.map(async (r) => {
                const alunoId = getAlunoId(r);
                const questionarioId = getQuestionarioId(r);
                const status = r.status || 'nao_iniciado';
                let alunoNome = '—';
                let classeNome = '—';
                let faixaEtaria = '';
                let respondidas = 0;
                let totalQuestoes = 0;
                try {
                    const [alunoData, respostasData, questoesData] = await Promise.all([
                        alunoId ? api.getAluno(alunoId) : Promise.resolve(null),
                        r.id ? api.getRespostas({ resultado: r.id }) : Promise.resolve([]),
                        questionarioId ? api.getQuestoes(questionarioId) : Promise.resolve([]),
                    ]);
                    if (alunoData) {
                        alunoNome = alunoData.nome || '—';
                        const cls = alunoData.classe;
                        if (cls != null) {
                            if (typeof cls === 'object' && cls !== null && cls.nome != null) {
                                classeNome = cls.nome;
                            } else {
                                const id = typeof cls === 'object' && cls !== null && cls.id != null ? cls.id : cls;
                                try {
                                    const classeData = await api.getClasse(id);
                                    classeNome = classeData && classeData.nome ? classeData.nome : String(id);
                                } catch (_) {
                                    classeNome = String(id).slice(0, 8);
                                }
                            }
                        }
                        faixaEtaria = alunoData.faixa_etaria || '';
                    }
                    const respostas = Array.isArray(respostasData) ? respostasData : [];
                    const questoes = Array.isArray(questoesData) ? questoesData : [];
                    respondidas = respostas.length;
                    totalQuestoes = questoes.length;
                } catch (_) {}
                const pct = totalQuestoes > 0 ? Math.round((respondidas / totalQuestoes) * 100) : (status === 'finalizado' || status === 'concluido' ? 100 : 0);
                return {
                    resultadoId: r.id,
                    alunoId,
                    alunoNome,
                    classeNome,
                    faixaEtaria,
                    status,
                    pct,
                    respondidas,
                    totalQuestoes,
                };
            })
        );
        rows = enriched;
    }

    return `
        <div class="flex h-screen w-full flex-row">
            ${Sidebar(user, 'dashboard')}
            <main class="flex-1 flex flex-col h-full overflow-y-auto scrollbar-hide bg-white dark:bg-background-dark">
                <div class="w-full max-w-[1200px] mx-auto p-8 md:p-12 flex flex-col gap-10">
                    <div class="flex flex-col gap-1">
                        <h1 class="text-[#0d121b] dark:text-white tracking-tight text-[32px] md:text-4xl font-bold leading-tight">
                            Olá, ${user.role === 'admin' ? 'Admin' : 'Avaliador'} ${(user.name || user.username || '').split(' ')[0] || 'Usuário'}
                        </h1>
                        <p class="text-slate-500 dark:text-slate-400 text-sm">Visão geral do progresso das avaliações e acesso rápido às pendentes.</p>
                    </div>
                    ${loading ? `
                    <div class="flex items-center justify-center py-12"><div class="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div></div>
                    ` : error ? `
                    <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-red-700 dark:text-red-300">${error}</div>
                    ` : `
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                            <div class="flex items-center justify-between">
                                <div class="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300">
                                    <span class="material-symbols-outlined text-[28px]">person_off</span>
                                </div>
                            </div>
                            <div>
                                <p class="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Alunos Faltantes</p>
                                <p class="text-slate-900 dark:text-white text-3xl font-bold">${Math.max(0, pendentes)}</p>
                            </div>
                        </div>
                        <div class="flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                            <div class="flex items-center justify-between">
                                <div class="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-primary">
                                    <span class="material-symbols-outlined text-[28px]">check_circle</span>
                                </div>
                            </div>
                            <div>
                                <p class="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Alunos Feitos</p>
                                <p class="text-slate-900 dark:text-white text-3xl font-bold">${concluidos}</p>
                            </div>
                        </div>
                        <div class="flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                            <div class="flex items-center justify-between">
                                <div class="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
                                    <span class="material-symbols-outlined text-[28px]">priority_high</span>
                                </div>
                            </div>
                            <div>
                                <p class="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Em Andamento</p>
                                <p class="text-slate-900 dark:text-white text-3xl font-bold">${emAndamento}</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col gap-6">
                        <div class="flex items-center justify-between">
                            <h2 class="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-tight">Progresso Comportamental</h2>
                            <a href="#/avaliacoes" class="text-primary text-sm font-semibold hover:underline">Ver Todas</a>
                        </div>
                        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                            <div class="overflow-x-auto">
                                <table class="w-full text-left border-collapse table-fixed">
                                    <thead>
                                        <tr class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                            <th class="py-3 px-4 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider w-[28%]">Aluno</th>
                                            <th class="py-3 px-3 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider w-[12%]">Turma</th>
                                            <th class="py-3 px-3 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider w-[22%]">Progresso</th>
                                            <th class="py-3 px-3 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider w-[18%] text-right">Status</th>
                                            <th class="py-3 px-3 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider w-[12%] text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                                        ${rows.length === 0 ? '<tr><td colspan="5" class="py-6 text-center text-slate-500 dark:text-slate-400 text-sm">Nenhuma avaliação recente.</td></tr>' : rows.map(row => `
                                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                            <td class="py-3 px-4">
                                                <div class="flex items-center gap-2.5 min-w-0">
                                                    <div class="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 flex-shrink-0">
                                                        <span class="text-xs font-bold text-slate-600 dark:text-slate-300">${(row.alunoNome || '?').split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                                                    </div>
                                                    <div class="flex flex-col min-w-0">
                                                        <span class="text-sm font-semibold text-slate-900 dark:text-white truncate">${row.alunoNome}</span>
                                                        ${row.faixaEtaria ? '<span class="text-xs text-slate-500">' + row.faixaEtaria + '</span>' : ''}
                                                        <span class="text-[11px] text-slate-400">${row.alunoId ? '#' + String(row.alunoId).slice(0, 8) : ''}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="py-3 px-3 text-xs text-slate-600 dark:text-slate-300 truncate" title="${(row.classeNome || '').replace(/"/g, '&quot;')}">${row.classeNome}</td>
                                            <td class="py-3 px-3">
                                                <div class="flex items-center gap-2">
                                                    <div class="flex-1 min-w-0 h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                                                        <div class="h-full bg-primary rounded-full transition-all" style="width: ${row.pct}%"></div>
                                                    </div>
                                                    <span class="text-[11px] font-medium text-primary shrink-0 whitespace-nowrap">${row.totalQuestoes ? row.respondidas + '/' + row.totalQuestoes : row.pct + '%'}</span>
                                                </div>
                                            </td>
                                            <td class="py-3 px-3 text-right">
                                                <span class="inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium ${statusClass[row.status] || 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400'}">
                                                    ${statusLabel[row.status] || row.status}
                                                </span>
                                            </td>
                                            <td class="py-3 px-3 text-right">
                                                ${row.status !== 'finalizado' && row.alunoId ? '<a href="#/avaliacoes/nova?aluno=' + row.alunoId + '" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors">Acessar</a>' : row.status === 'finalizado' ? '<span class="text-slate-400 text-xs">—</span>' : ''}
                                            </td>
                                        </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    `}
                </div>
            </main>
        </div>
    `;
}

// Initialize dashboard after component is mounted
window.addEventListener('route-changed', (e) => {
    if (e.detail.route === '/dashboard') {
        setupLogoutButton();
    }
});
