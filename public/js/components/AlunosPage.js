// Alunos Page - Gerenciamento de Alunos com Contexto Rico (Escola/Cidade)

import { getCurrentUser, api } from '../utils/api.js';
import { Sidebar, setupLogoutButton } from './Sidebar.js';

let alunosState = {
    list: [],
    loading: true,
    error: null,
    count: 0,
    next: null,
    previous: null,
    page: 1,
    filters: { search: '', turma: '', escola: '', status: '' }
};

export async function AlunosPage() {
    const user = getCurrentUser();

    if (!user) {
        window.router.navigate('/login');
        return '<div></div>';
    }

    alunosState.loading = true;
    alunosState.error = null;

    // Reset filters on first load if needed, or keep them? Keeping simple for now.

    try {
        const isAdmin = user.role === 'admin';
        const res = isAdmin
            ? await api.getAlunos({ page: alunosState.page })
            : await api.getAlunosPorAvaliador(user.id);

        const rawAlunos = (res.data || []);

        // Dados de avaliações para status
        const assessmentsMap = await buildAssessmentsMapByAluno();

        // Backend já retorna escola_nome, classe_nome, municipio_nome
        alunosState.list = rawAlunos.map(row => mapAlunoFromApi(row, assessmentsMap));
        alunosState.count = isAdmin ? (res.count ?? alunosState.list.length) : alunosState.list.length;
        alunosState.next = isAdmin ? (res.next ?? null) : null;
        alunosState.previous = isAdmin ? (res.previous ?? null) : null;

    } catch (err) {
        alunosState.error = err.message || 'Erro ao carregar alunos';
        alunosState.list = [];
        console.error('AlunosPage:', err);
    }
    alunosState.loading = false;

    return renderAlunosPage(user);
}

function renderAlunosPage(user) {
    const alunos = filterAlunos(alunosState.list);
    const totalAlunos = alunosState.count ?? alunos.length;

    // Extract unique values for filters
    const turmasUnicas = [...new Set(alunosState.list.map(a => a.turma).filter(Boolean))].sort();
    const escolasUnicas = [...new Set(alunosState.list.map(a => a.escolaNome).filter(Boolean))].sort();

    // Stats
    const comPendente = alunos.filter(a => a.temPendente).length;
    const finalizados = alunos.filter(a => a.temFinalizado).length;

    return `
        <div class="flex h-screen w-full flex-row">
            ${Sidebar(user, 'alunos')}
            <main class="flex-1 flex flex-col h-full overflow-y-auto scrollbar-hide bg-slate-50 dark:bg-background-dark">
                <div class="w-full max-w-[1400px] mx-auto p-6 md:p-8 flex flex-col gap-6">
                    
                    <!-- Header -->
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 class="text-[#0d121b] dark:text-white tracking-tight text-2xl md:text-3xl font-bold leading-tight">Alunos</h1>
                            <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Gerencie os alunos, visualize escolas e acompanhe avaliações.</p>
                        </div>
                        <button id="novo-aluno-btn" class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm flex items-center gap-2">
                            <span class="material-symbols-outlined text-[18px]">add</span> Novo Aluno
                        </button>
                    </div>

                    ${!alunosState.loading && !alunosState.error ? `
                    <!-- Stats Cards -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                         <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between">
                            <div><p class="text-xs text-slate-500 uppercase font-medium">Total</p><p class="text-xl font-bold text-slate-900 dark:text-white">${totalAlunos}</p></div>
                            <span class="material-symbols-outlined text-blue-500 bg-blue-50 p-2 rounded-lg">groups</span>
                        </div>
                        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between">
                            <div><p class="text-xs text-slate-500 uppercase font-medium">Pendentes</p><p class="text-xl font-bold text-slate-900 dark:text-white">${comPendente}</p></div>
                            <span class="material-symbols-outlined text-amber-500 bg-amber-50 p-2 rounded-lg">pending</span>
                        </div>
                        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between">
                            <div><p class="text-xs text-slate-500 uppercase font-medium">Finalizados</p><p class="text-xl font-bold text-slate-900 dark:text-white">${finalizados}</p></div>
                            <span class="material-symbols-outlined text-green-500 bg-green-50 p-2 rounded-lg">check_circle</span>
                        </div>
                    </div>

                    <!-- Filters -->
                    <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                         <div class="relative md:col-span-1">
                            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
                            <input type="text" id="search-aluno" value="${alunosState.filters.search}" placeholder="Buscar aluno..." class="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"/>
                        </div>
                        <select id="filter-escola" class="h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                            <option value="">Todas as Escolas</option>
                            ${escolasUnicas.map(e => `<option value="${e}" ${alunosState.filters.escola === e ? 'selected' : ''}>${e}</option>`).join('')}
                        </select>
                        <select id="filter-turma" class="h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                            <option value="">Todas as Turmas</option>
                            ${turmasUnicas.map(t => `<option value="${t}" ${alunosState.filters.turma === t ? 'selected' : ''}>${t}</option>`).join('')}
                        </select>
                        <select id="filter-status" class="h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                            <option value="">Status</option>
                            <option value="Pendente" ${alunosState.filters.status === 'Pendente' ? 'selected' : ''}>Pendente</option>
                            <option value="Avaliado" ${alunosState.filters.status === 'Avaliado' ? 'selected' : ''}>Avaliado</option>
                        </select>
                    </div>

                    <!-- Table -->
                    <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                        <div class="overflow-x-auto min-h-[400px]">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                        <th class="py-3 px-6 text-xs font-semibold uppercase text-slate-500 tracking-wider">Aluno</th>
                                        <th class="py-3 px-6 text-xs font-semibold uppercase text-slate-500 tracking-wider">Escola / Cidade</th>
                                        <th class="py-3 px-6 text-xs font-semibold uppercase text-slate-500 tracking-wider">Turma</th>
                                        <th class="py-3 px-6 text-xs font-semibold uppercase text-slate-500 tracking-wider text-center">Status</th>
                                        <th class="py-3 px-6 text-xs font-semibold uppercase text-slate-500 tracking-wider text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                                    ${alunos.length === 0 ? `<tr><td colspan="5" class="py-12 text-center text-slate-500">Nenhum aluno encontrado.</td></tr>` :
                alunos.map(aluno => `
                                        <tr class="hover:bg-slate-50 transition-colors">
                                            <td class="py-3 px-6">
                                                <div class="flex items-center gap-3">
                                                    <div class="h-9 w-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs ring-1 ring-indigo-100">
                                                        ${getInitials(aluno.nome)}
                                                    </div>
                                                    <div class="flex flex-col">
                                                        <span class="text-sm font-semibold text-slate-900 dark:text-white">${aluno.nome}</span>
                                                        <span class="text-[11px] text-slate-400 font-mono">#${aluno.id.slice(0, 8)}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="py-3 px-6">
                                                <div class="flex flex-col">
                                                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                                        ${aluno.escolaNome !== '—' ? '<span class="material-symbols-outlined text-[14px] text-slate-400">school</span>' : ''} ${aluno.escolaNome}
                                                    </span>
                                                     <span class="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                        ${aluno.cidadeNome !== '—' ? '<span class="material-symbols-outlined text-[14px] text-slate-400">location_on</span>' : ''} ${aluno.cidadeNome}
                                                     </span>
                                                </div>
                                            </td>
                                            <td class="py-3 px-6 text-sm text-slate-600">${aluno.turma}</td>
                                            <td class="py-3 px-6 text-center">
                                                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClass(aluno.status)}">
                                                    ${aluno.status}
                                                </span>
                                                ${aluno.ultimaAvaliacao ? `<div class="text-[10px] text-slate-400 mt-1">${formatDate(aluno.ultimaAvaliacao)}</div>` : ''}
                                            </td>
                                            <td class="py-3 px-6 text-right">
                                                <div class="flex items-center justify-end gap-1">
                                                     <a href="#/avaliacoes/nova?aluno=${aluno.id}" class="p-1.5 text-slate-400 hover:text-primary hover:bg-blue-50 rounded transition-colors" title="Avaliar">
                                                        <span class="material-symbols-outlined text-[18px]">edit_document</span>
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                         <!-- Pagination -->
                         <div class="flex items-center justify-between p-4 border-t border-slate-200">
                            <span class="text-sm text-slate-500">Mostrando ${alunos.length} de ${totalAlunos}</span>
                             <div class="flex gap-2">
                                <button id="btn-prev-alunos" ${alunosState.previous ? '' : 'disabled'} class="px-3 py-1.5 border border-slate-200 rounded text-sm hover:bg-slate-50 disabled:opacity-50">Anterior</button>
                                <button id="btn-next-alunos" ${alunosState.next ? '' : 'disabled'} class="px-3 py-1.5 border border-slate-200 rounded text-sm hover:bg-slate-50 disabled:opacity-50">Próximo</button>
                            </div>
                        </div>
                    </div>
                    ` : loadingState()}
                </div>
            </main>
        </div>
    `;
}

function loadingState() {
    return `
        <div class="flex items-center justify-center py-20">
            <div class="flex flex-col items-center gap-4">
                <div class="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
                <p class="text-slate-600">Carregando dados completos...</p>
            </div>
        </div>`;
}

// Logic Helpers

async function buildAssessmentsMapByAluno() {
    const map = {};
    try {
        const res = await api.getAssessments({ page: 1 });
        const list = res.data || [];
        list.forEach(r => {
            const alunoId = r.aluno;
            if (alunoId) {
                if (!map[alunoId]) map[alunoId] = { count: 0, lastDate: null, status: 'Pendente' };
                map[alunoId].count++;
                map[alunoId].lastDate = r.updated_at;
                map[alunoId].status = r.status === 'concluido' || r.status === 'finalizado' ? 'Avaliado' : 'Pendente';
            }
        });
    } catch (_) { }
    return map;
}

function mapAlunoFromApi(row, assessmentsMap) {
    // Backend já envia escola_nome, classe_nome, municipio_nome
    const stats = assessmentsMap[row.id] || {};

    return {
        id: row.id || '',
        nome: row.nome || '—',
        turma: row.classe_nome || '—',
        escolaNome: row.escola_nome || '—',
        cidadeNome: row.municipio_nome || '—',
        status: row.avaliado ? 'Avaliado' : (stats.status || 'Pendente'),
        avaliacoes: row.avaliacoes || stats.count || 0,
        ultimaAvaliacao: stats.lastDate,
        temPendente: !row.avaliado,
        temFinalizado: row.avaliado
    };
}

function filterAlunos(list) {
    const { search, turma, escola, status } = alunosState.filters;
    return list.filter(a => {
        const matchesSearch = !search || a.nome.toLowerCase().includes(search.toLowerCase());
        const matchesTurma = !turma || a.turma === turma;
        const matchesEscola = !escola || a.escolaNome === escola;
        const matchesStatus = !status || a.status === status;
        return matchesSearch && matchesTurma && matchesEscola && matchesStatus;
    });
}

function getInitials(name) {
    return (name || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function getStatusClass(status) {
    if (status === 'Avaliado') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    if (status === 'Pendente') return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
    return 'bg-slate-100 text-slate-700';
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('pt-BR');
}

// Event Listeners initialization
window.addEventListener('route-changed', (e) => {
    if (e.detail.route === '/alunos') {
        setupLogoutButton();
        setTimeout(setupInteractions, 100);
    }
});

function setupInteractions() {
    // Pagination
    document.getElementById('btn-prev-alunos')?.addEventListener('click', () => {
        alunosState.page--;
        window.router.navigate('/alunos');
    });
    document.getElementById('btn-next-alunos')?.addEventListener('click', () => {
        alunosState.page++;
        window.router.navigate('/alunos');
    });

    // Filters
    ['search-aluno', 'filter-escola', 'filter-turma', 'filter-status'].forEach(id => {
        document.getElementById(id)?.addEventListener(id.includes('search') ? 'input' : 'change', (e) => {
            const key = id.replace('filter-', '').replace('search-', '');
            const val = e.target.value;
            // Map 'aluno' to 'search' because ID is search-aluno but filter key is search
            alunosState.filters[key === 'aluno' ? 'search' : key] = val;

            // Re-render without full reload? Or just replace innerHTML?
            // Simple way: navigate to same route forces re-render in this simple router
            window.router.navigate('/alunos');
        });
    });

    document.getElementById('novo-aluno-btn')?.addEventListener('click', () => alert('Em breve'));
}
