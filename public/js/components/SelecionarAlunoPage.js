// Seleção de Aluno Page - Lista de alunos da API

import { getCurrentUser, api } from '../utils/api.js';
import { Sidebar, setupLogoutButton } from './Sidebar.js';

function mapAluno(row) {
    return {
        id: row.id,
        nome: row.nome || '—',
        turma: row.classe_nome || '—',
        faixa_etaria: row.faixa_etaria || '—',
    };
}

export async function SelecionarAlunoPage() {
    const user = getCurrentUser();

    if (!user) {
        window.router.navigate('/login');
        return '<div></div>';
    }

    const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
    const questionarioId = urlParams.get('questionario') || urlParams.get('tipo') || '';
    const faixaFiltro = urlParams.get('faixa') || '';

    let alunos = [];
    let questionarioNome = 'Questionário';
    let loading = true;
    let error = null;
    try {
        if (user.role === 'admin') {
            const res = await api.getAlunos({ page: 1 });
            alunos = (res.data || []).map(mapAluno);
        } else {
            const data = await api.getAlunosPorAvaliador(user.id);
            alunos = (data.data || []).map(mapAluno);
        }
        if (questionarioId) {
            try {
                const q = await api.getQuestionario(questionarioId);
                questionarioNome = q.nome || questionarioNome;
            } catch (_) { }
        }
        loading = false;
    } catch (err) {
        error = err.message || 'Erro ao carregar alunos';
        loading = false;
    }

    const alunosFiltrados = faixaFiltro ? alunos.filter(a => a.faixa_etaria === faixaFiltro) : alunos;

    return `
        <div class="flex h-screen w-full flex-row">
            ${Sidebar(user, 'avaliacoes')}
            
            <main class="flex-1 flex flex-col h-full overflow-y-auto scrollbar-hide bg-white dark:bg-background-dark">
                <div class="w-full max-w-[900px] mx-auto p-6 md:p-8 flex flex-col gap-6">
                    <!-- Header -->
                    <div class="flex flex-col gap-3">
                        <div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <a class="hover:text-primary transition-colors cursor-pointer" onclick="window.router.navigate('/avaliacoes')">Avaliações</a>
                            <span class="material-symbols-outlined text-[14px]">chevron_right</span>
                            <span>${questionarioNome}</span>
                            <span class="material-symbols-outlined text-[14px]">chevron_right</span>
                            <span>Selecionar Aluno</span>
                        </div>
                        
                        <div class="flex items-center justify-between gap-4">
                            <div>
                                <h1 class="text-[#0d121b] dark:text-white tracking-tight text-2xl md:text-3xl font-bold leading-tight">Selecione o Aluno</h1>
                                <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Escolha o aluno para aplicar: <strong>${questionarioNome}</strong></p>
                            </div>
                            <button onclick="window.router.navigate('/avaliacoes')" class="px-3 py-2 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Voltar</button>
                        </div>
                    </div>
                    
                    ${loading ? `
                    <div class="flex items-center justify-center py-12"><div class="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div></div>
                    ` : error ? `
                    <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-red-700 dark:text-red-300">${error}</div>
                    ` : `
                    <div class="relative">
                        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
                        <input type="text" id="search-aluno" placeholder="Buscar aluno por nome ou turma..." class="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"/>
                    </div>
                    
                    <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                        <div class="divide-y divide-slate-100 dark:divide-slate-700" id="alunos-list">
                            ${alunosFiltrados.length === 0 ? '<div class="py-8 text-center text-slate-500 dark:text-slate-400">Nenhum aluno disponível.</div>' : alunosFiltrados.map(aluno => `
                                <div class="aluno-item flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer group" data-aluno-id="${aluno.id}" data-aluno-nome="${(aluno.nome || '').toLowerCase()}" data-turma="${(aluno.turma || '').toLowerCase()}" data-questionario="${questionarioId}">
                                    <div class="flex-1 min-w-0">
                                        <h3 class="text-sm font-semibold text-slate-900 dark:text-white truncate">${aluno.nome}</h3>
                                        <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                            <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">tag</span>#${String(aluno.id).slice(0, 8)}</span>
                                            <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">school</span>${aluno.turma}</span>
                                            <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">cake</span>${aluno.faixa_etaria}</span>
                                        </div>
                                    </div>
                                    <button type="button" class="px-4 py-2 bg-primary/10 text-primary rounded-lg text-xs font-semibold group-hover:bg-primary group-hover:text-white transition-all flex items-center gap-1 flex-shrink-0">
                                        <span>Selecionar</span>
                                        <span class="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <p class="text-xs text-slate-400 dark:text-slate-500 text-center">${alunosFiltrados.length} alunos disponíveis</p>
                    `}
                </div>
            </main>
        </div>
    `;
}

// Initialize after component is mounted
window.addEventListener('route-changed', (e) => {
    if (e.detail.route.startsWith('/avaliacoes/selecionar-aluno')) {
        setupLogoutButton();
        setTimeout(() => {
            setupAlunoSelection();
            setupSearch();
        }, 100);
    }
});

function setupAlunoSelection() {
    document.querySelectorAll('.aluno-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.closest('button')) return;
            const alunoId = item.dataset.alunoId;
            const questionarioId = item.dataset.questionario;
            window.router.navigate(`/avaliacoes/nova?aluno=${alunoId}&questionario=${questionarioId || ''}`);
        });
        const btn = item.querySelector('button');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const alunoId = item.dataset.alunoId;
                const questionarioId = item.dataset.questionario;
                window.router.navigate(`/avaliacoes/nova?aluno=${alunoId}&questionario=${questionarioId || ''}`);
            });
        }
    });
}

function setupSearch() {
    const searchInput = document.getElementById('search-aluno');
    const alunoItems = document.querySelectorAll('.aluno-item');

    if (searchInput && alunoItems.length) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = (e.target.value || '').toLowerCase();
            alunoItems.forEach(item => {
                const nome = item.dataset.alunoNome || '';
                const turma = item.dataset.turma || '';
                const show = !searchTerm || nome.includes(searchTerm) || turma.includes(searchTerm);
                item.style.display = show ? 'flex' : 'none';
            });
        });
    }
}
