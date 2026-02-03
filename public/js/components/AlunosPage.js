// Alunos Page - Gerenciamento de Alunos (dados da API)

import { getCurrentUser, api } from '../utils/api.js';
import { Sidebar, setupLogoutButton } from './Sidebar.js';
import { toast } from '../utils/toast.js';

let alunosState = { list: [], loading: true, error: null, count: 0, next: null, previous: null, page: 1 };

export async function AlunosPage() {
    const user = getCurrentUser();

    if (!user) {
        window.router.navigate('/login');
        return '<div></div>';
    }

    alunosState.loading = true;
    alunosState.error = null;
    try {
        const isAdmin = user.role === 'admin';
        const res = isAdmin
            ? await api.getAlunos({ page: alunosState.page })
            : await api.getAlunosPorAvaliador(user.id);
        const rawAlunos = (res.data || []);
        const assessmentsMap = await buildAssessmentsMapByAluno();
        const classesMap = await buildClassesMap(rawAlunos);
        alunosState.list = rawAlunos.map(row => mapAlunoFromApi(row, classesMap, assessmentsMap));
        alunosState.count = isAdmin ? (res.count ?? alunosState.list.length) : alunosState.list.length;
        alunosState.next = isAdmin ? (res.next ?? null) : null;
        alunosState.previous = isAdmin ? (res.previous ?? null) : null;
    } catch (err) {
        alunosState.error = err.message || 'Erro ao carregar alunos';
        alunosState.list = [];
        console.error('AlunosPage:', err);
    }
    alunosState.loading = false;

    const alunos = alunosState.list;
    const totalAlunos = alunosState.count ?? alunos.length;
    const comPendente = alunos.filter(a => a.temPendente).length;
    const finalizados = alunos.filter(a => a.temFinalizado).length;

    let mainContent = '';
    if (alunosState.loading) {
        mainContent = `
            <div class="flex items-center justify-center py-20">
                <div class="flex flex-col items-center gap-4">
                    <div class="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
                    <p class="text-slate-600 dark:text-slate-400">Carregando alunos...</p>
                </div>
            </div>`;
    } else if (alunosState.error) {
        mainContent = `
            <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                <p class="text-red-700 dark:text-red-300">${alunosState.error}</p>
                <button id="retry-alunos" class="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm">Tentar novamente</button>
            </div>`;
    } else {
        const turmasUnicas = [...new Set(alunos.map(a => a.turma).filter(Boolean))].sort();
        mainContent = `
                    <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div class="relative md:col-span-2">
                                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
                                <input type="text" id="search-aluno" placeholder="Buscar por nome, ID ou turma..." class="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"/>
                            </div>
                            <select id="filter-turma" class="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                                <option value="">Todas as Turmas</option>
                                ${turmasUnicas.map(t => `<option value="${(t || '').toLowerCase()}">${t}</option>`).join('')}
                            </select>
                            <select id="filter-status" class="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                                <option value="">Todos os Status</option>
                                <option value="Pendente">Pendente</option>
                                <option value="Avaliado">Avaliado</option>
                                <option value="Não avaliado">Não avaliado</option>
                            </select>
                        </div>
                    </div>
                    <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                        <th class="py-3 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">ID</th>
                                        <th class="py-3 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Aluno</th>
                                        <th class="py-3 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Turma</th>
                                        <th class="py-3 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Faixa</th>
                                        <th class="py-3 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider text-center">Avaliações</th>
                                        <th class="py-3 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Última Avaliação</th>
                                        <th class="py-3 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Status</th>
                                        <th class="py-3 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-200 dark:divide-slate-700" id="alunos-tbody">
                                    ${alunos.length === 0 ? `
                                        <tr><td colspan="8" class="py-8 text-center text-slate-500 dark:text-slate-400">Nenhum aluno cadastrado.</td></tr>
                                    ` : alunos.map(aluno => `
                                        <tr class="aluno-row hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors" data-aluno-id="${aluno.id}" data-nome="${(aluno.nome || '').toLowerCase()}" data-turma="${(aluno.turma || '').toLowerCase()}" data-status="${aluno.status}" data-id-short="${(aluno.id || '').toString().slice(0, 8).toLowerCase()}">
                                            <td class="py-4 px-6 text-sm font-mono text-slate-600 dark:text-slate-400">#${(aluno.id || '').toString().slice(0, 8)}</td>
                                            <td class="py-4 px-6">
                                                <div class="flex items-center gap-3">
                                                    <div class="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                                                        <span class="text-sm font-bold text-slate-600 dark:text-slate-300">${(aluno.nome || '?').split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                                                    </div>
                                                    <div class="flex flex-col min-w-0">
                                                        <span class="text-sm font-semibold text-slate-900 dark:text-white">${aluno.nome || '—'}</span>
                                                        <span class="text-xs text-slate-500">${aluno.faixa_etaria ? aluno.faixa_etaria : ''}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">${aluno.turma || '—'}</td>
                                            <td class="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">${aluno.faixa_etaria || '—'}</td>
                                            <td class="py-4 px-6 text-sm text-slate-900 dark:text-white text-center font-semibold">${aluno.avaliacoes ?? '—'}</td>
                                            <td class="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">${aluno.ultimaAvaliacao ? formatDate(aluno.ultimaAvaliacao) : '—'}</td>
                                            <td class="py-4 px-6">
                                                <span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${aluno.status === 'Avaliado' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : aluno.status === 'Pendente' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}">
                                                    ${aluno.status}
                                                </span>
                                            </td>
                                            <td class="py-4 px-6">
                                                <div class="flex items-center justify-end gap-1">
                                                    <button class="p-1.5 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors btn-ver-aluno" data-id="${aluno.id}" title="Ver"><span class="material-symbols-outlined text-[18px]">visibility</span></button>
                                                    <a href="#/avaliacoes/nova?aluno=${aluno.id}" class="p-1.5 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors inline-flex" title="Editar / Avaliar"><span class="material-symbols-outlined text-[18px]">edit</span></a>
                                                </div>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="flex items-center justify-between">
                        <p class="text-sm text-slate-500 dark:text-slate-400">Mostrando <strong>${alunos.length}</strong> de <strong>${totalAlunos}</strong> alunos</p>
                        <div class="flex items-center gap-2">
                            <button id="btn-prev-alunos" class="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50" ${alunosState.previous ? '' : 'disabled'}>Anterior</button>
                            <span class="px-3 py-2 text-sm text-slate-600 dark:text-slate-400">Página ${alunosState.page}</span>
                            <button id="btn-next-alunos" class="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50" ${alunosState.next ? '' : 'disabled'}>Próximo</button>
                        </div>
                    </div>`;
    }

    return `
        <div class="flex h-screen w-full flex-row">
            ${Sidebar(user, 'alunos')}
            <main class="flex-1 flex flex-col h-full overflow-y-auto scrollbar-hide bg-slate-50 dark:bg-background-dark">
                <div class="w-full max-w-[1400px] mx-auto p-6 md:p-8 flex flex-col gap-6">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 class="text-[#0d121b] dark:text-white tracking-tight text-2xl md:text-3xl font-bold leading-tight">Alunos</h1>
                            <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Gerencie os alunos da sua escola e identifique quem tem avaliação pendente.</p>
                        </div>
                        <button id="novo-aluno-btn" class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm flex items-center gap-2">
                            <span class="material-symbols-outlined text-[18px]">add</span> Novo Aluno
                        </button>
                    </div>
                    ${!alunosState.loading && !alunosState.error ? `
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                            <div class="flex items-center justify-between">
                                <div><p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total de Alunos</p><p class="text-2xl font-bold text-slate-900 dark:text-white mt-2">${totalAlunos}</p></div>
                                <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"><span class="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[24px]">groups</span></div>
                            </div>
                        </div>
                        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                            <div class="flex items-center justify-between">
                                <div><p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Com pendência</p><p class="text-2xl font-bold text-slate-900 dark:text-white mt-2">${comPendente}</p></div>
                                <div class="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg"><span class="material-symbols-outlined text-amber-600 dark:text-amber-400 text-[24px]">pending</span></div>
                            </div>
                        </div>
                        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                            <div class="flex items-center justify-between">
                                <div><p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Finalizados</p><p class="text-2xl font-bold text-slate-900 dark:text-white mt-2">${finalizados}</p></div>
                                <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"><span class="material-symbols-outlined text-green-600 dark:text-green-400 text-[24px]">check_circle</span></div>
                            </div>
                        </div>
                        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                            <div class="flex items-center justify-between">
                                <div><p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Avaliações (total)</p><p class="text-2xl font-bold text-slate-900 dark:text-white mt-2">${alunos.reduce((sum, a) => sum + (a.avaliacoes || 0), 0)}</p></div>
                                <div class="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg"><span class="material-symbols-outlined text-purple-600 dark:text-purple-400 text-[24px]">assignment</span></div>
                            </div>
                        </div>
                    </div>
                    ` : ''}
                    ${mainContent}
                </div>
            </main>
        </div>
    `;
}

/** Monta mapa alunoId -> { count, lastDate, hasPendente } a partir dos resultados da API. */
async function buildAssessmentsMapByAluno() {
    const map = {};
    try {
        let page = 1;
        let hasMore = true;
        while (hasMore && page <= 5) {
            const res = await api.getAssessments({ page });
            const list = res.data || [];
            list.forEach(r => {
                const alunoId = r.aluno && (typeof r.aluno === 'object' ? r.aluno.id : r.aluno);
                if (!alunoId) return;
                const key = String(alunoId);
                if (!map[key]) map[key] = { count: 0, lastDate: null, hasPendente: false, hasFinalizado: false };
                map[key].count += 1;
                const date = r.updated_at || r.created_at;
                if (date && (!map[key].lastDate || new Date(date) > new Date(map[key].lastDate)))
                    map[key].lastDate = date;
                if (r.status === 'nao_iniciado' || r.status === 'em_andamento') map[key].hasPendente = true;
                if (r.status === 'finalizado' || r.status === 'concluido') map[key].hasFinalizado = true;
            });
            hasMore = !!res.next;
            page += 1;
        }
    } catch (_) {}
    return map;
}

/** Monta um mapa classeId -> { nome } para os alunos que têm classe como ID. */
async function buildClassesMap(alunos) {
    const ids = [...new Set(alunos.map(a => {
        const c = a.classe;
        if (!c) return null;
        const id = typeof c === 'object' && c !== null && c.id != null ? c.id : c;
        return id != null ? String(id) : null;
    }).filter(Boolean))];
    if (ids.length === 0) return {};
    const map = {};
    await Promise.all(ids.map(async (id) => {
        try {
            const data = await api.getClasse(id);
            map[id] = { nome: data && data.nome ? data.nome : id };
        } catch (_) {
            map[id] = { nome: id };
        }
    }));
    return map;
}

/** Mapeia aluno da API para o formato da página (turma por nome; avaliações/última do mapa). */
function mapAlunoFromApi(row, classesMap = {}, assessmentsMap = {}) {
    let turma = '—';
    const c = row.classe;
    if (c != null) {
        if (typeof c === 'object' && c !== null && c.nome != null) {
            turma = c.nome;
        } else {
            const id = (typeof c === 'object' && c !== null && c.id != null ? c.id : c);
            const key = id != null ? String(id) : '';
            turma = classesMap[key]?.nome ?? (key ? key.slice(0, 8) : '—');
        }
    }
    const aid = row.id != null ? String(row.id) : '';
    const stats = assessmentsMap[aid] || {};
    const count = stats.count ?? 0;
    const hasPendente = stats.hasPendente === true;
    const hasFinalizado = stats.hasFinalizado === true;
    return {
        id: row.id,
        nome: row.nome || '—',
        turma,
        faixa_etaria: row.faixa_etaria || '—',
        status: hasPendente ? 'Pendente' : (hasFinalizado || count > 0 ? 'Avaliado' : 'Não avaliado'),
        avaliado: Boolean(row.avaliado),
        avaliacoes: count > 0 ? count : null,
        ultimaAvaliacao: stats.lastDate || null,
        temPendente: hasPendente,
        temFinalizado: hasFinalizado,
    };
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Initialize after component is mounted
window.addEventListener('route-changed', (e) => {
    if (e.detail.route === '/alunos') {
        setupLogoutButton();
        setTimeout(() => {
            setupAlunosFilters();
            setupNovoAlunoButton();
            setupRetryAlunos();
            setupAlunosPagination();
        }, 100);
    }
});

function setupRetryAlunos() {
    const btn = document.getElementById('retry-alunos');
    if (btn) btn.addEventListener('click', () => { alunosState.page = 1; window.router.navigate('/alunos'); });
}

function setupAlunosPagination() {
    const prev = document.getElementById('btn-prev-alunos');
    const next = document.getElementById('btn-next-alunos');
    if (prev && alunosState.previous) {
        prev.addEventListener('click', () => { alunosState.page = Math.max(1, alunosState.page - 1); window.router.navigate('/alunos'); });
    }
    if (next && alunosState.next) {
        next.addEventListener('click', () => { alunosState.page += 1; window.router.navigate('/alunos'); });
    }
}

function setupAlunosFilters() {
    const searchInput = document.getElementById('search-aluno');
    const filterTurma = document.getElementById('filter-turma');
    const filterStatus = document.getElementById('filter-status');
    const alunoRows = document.querySelectorAll('.aluno-row');

    function applyFilters() {
        const searchTerm = searchInput?.value.toLowerCase() || '';
        const turmaFilter = filterTurma?.value || '';
        const statusFilter = filterStatus?.value || '';

        alunoRows.forEach(row => {
            const nome = row.dataset.nome || '';
            const turma = row.dataset.turma || '';
            const status = row.dataset.status || '';
            const idShort = row.dataset.idShort || '';

            const matchesSearch = !searchTerm || nome.includes(searchTerm) || turma.includes(searchTerm) || idShort.includes(searchTerm);
            const matchesTurma = !turmaFilter || turma === turmaFilter.toLowerCase();
            const matchesStatus = !statusFilter || status === statusFilter;

            if (matchesSearch && matchesTurma && matchesStatus) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    searchInput?.addEventListener('input', applyFilters);
    filterTurma?.addEventListener('change', applyFilters);
    filterStatus?.addEventListener('change', applyFilters);
}

function setupNovoAlunoButton() {
    const novoAlunoBtn = document.getElementById('novo-aluno-btn');
    if (novoAlunoBtn) {
        novoAlunoBtn.addEventListener('click', () => {
            alert('Funcionalidade de cadastro de novo aluno em desenvolvimento!');
        });
    }
}

function setupVerAluno() {
    document.querySelectorAll('.btn-ver-aluno').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            if (id) window.router.navigate(`/avaliacoes/nova?aluno=${id}`);
        });
    });
}
