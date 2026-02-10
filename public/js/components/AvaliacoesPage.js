// Avaliações Page - Questionários e avaliações recentes da API

import { getCurrentUser, api } from '../utils/api.js';
import { Sidebar, setupLogoutButton } from './Sidebar.js';

const statusLabel = { nao_iniciado: 'Pendente', em_andamento: 'Em Andamento', concluido: 'Concluída', finalizado: 'Finalizada' };
const statusClass = {
    nao_iniciado: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400',
    em_andamento: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    concluido: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
    finalizado: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
};

export async function AvaliacoesPage() {
    const user = getCurrentUser();

    if (!user) {
        window.router.navigate('/login');
        return '<div></div>';
    }

    let questionarios = [];
    let avaliacoesRecentes = [];
    let loading = true;
    let error = null;
    try {
        const [qRes, aRes] = await Promise.all([
            api.getQuestionarios({}),
            api.getAssessments({ page: 1 }),
        ]);
        questionarios = (qRes.data || []).map(q => ({
            id: q.id,
            nome: q.nome || 'Questionário',
            faixa_etaria: q.faixa_etaria,
            descricao: `Faixa etária: ${q.faixa_etaria || '—'}. Aplicado conforme a faixa do aluno.`,
            icon: 'psychology',
            tempo: '15-20 min',
            questoes: Array.isArray(q.questions) ? q.questions.length : 0,
        }));
        avaliacoesRecentes = (aRes.data || []).slice(0, 8).map(r => {
            const dateRaw = r.created_at || r.updated_at || r.data_criacao || r.data || '';
            return {
                id: r.id,
                alunoId: r.aluno,
                aluno: r.aluno_nome || ('Avaliação #' + (r.id || '').toString().slice(0, 8)),
                turma: '—',
                questionario: r.questionario_nome || 'Questionário',
                data: dateRaw,
                status: r.status,
                statusLabel: statusLabel[r.status] || r.status,
                statusClass: statusClass[r.status] || 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400',
            };
        });
        loading = false;
    } catch (err) {
        error = err.message || 'Erro ao carregar dados';
        loading = false;
    }

    const tiposTeste = questionarios.length ? questionarios : [
        { id: 'placeholder', nome: 'Nenhum questionário', descricao: 'Cadastre questionários no sistema.', faixa_etaria: '—', icon: 'psychology', tempo: '—', questoes: 0 },
    ];

    return `
        <div class="flex h-screen w-full flex-row">
            ${Sidebar(user, 'avaliacoes')}
            
            <main class="flex-1 flex flex-col h-full overflow-y-auto scrollbar-hide bg-white dark:bg-background-dark">
                <div class="w-full max-w-[1200px] mx-auto p-8 md:p-12 flex flex-col gap-10">
                    <div class="flex flex-col gap-1">
                        <h1 class="text-[#0d121b] dark:text-white tracking-tight text-[32px] md:text-4xl font-bold leading-tight">
                            Avaliações
                        </h1>
                        <p class="text-slate-500 dark:text-slate-400 text-sm">Escolha o questionário por faixa etária e inicie ou acompanhe as avaliações dos alunos.</p>
                    </div>
                    
                    ${loading ? `
                    <div class="flex items-center justify-center py-12"><div class="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div></div>
                    ` : error ? `
                    <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-red-700 dark:text-red-300">${error}</div>
                    ` : `
                    <!-- Cards de Tipos de Teste (Questionários da API) -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${tiposTeste.map(tipo => `
                            <div class="tipo-card group bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-8 hover:border-primary hover:shadow-2xl hover:shadow-blue-100 dark:hover:shadow-none transition-all duration-300 cursor-pointer relative overflow-hidden" data-tipo="${tipo.id}" data-faixa="${tipo.faixa_etaria || ''}">
                                <!-- Background Gradient -->
                                <div class="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                <!-- Content -->
                                <div class="relative z-10 flex flex-col gap-6">
                                    <!-- Icon -->
                                    <div class="flex items-center justify-between">
                                        <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400 group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:scale-110">
                                            <span class="material-symbols-outlined text-[36px]">${tipo.icon}</span>
                                        </div>
                                        <div class="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                                            <span class="material-symbols-outlined text-[14px]">schedule</span>
                                            <span>${tipo.tempo}</span>
                                        </div>
                                    </div>
                                    
                                    <!-- Title & Description -->
                                    <div class="flex flex-col gap-2">
                                        <h3 class="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                                            ${tipo.nome}
                                        </h3>
                                        <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            ${tipo.descricao}
                                        </p>
                                    </div>
                                    
                                    <!-- Stats -->
                                    <div class="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                                        <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                            <span class="material-symbols-outlined text-[18px]">quiz</span>
                                            <span>${tipo.questoes} questões</span>
                                        </div>
                                    </div>
                                    
                                    <!-- Button -->
                                    <button class="w-full mt-2 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold group-hover:bg-primary group-hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                                        <span>Verificar alunos</span>
                                        <span class="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- Histórico de Avaliações (API) -->
                    <div class="flex flex-col gap-6 mt-8">
                        <div class="flex items-center justify-between">
                            <h2 class="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-tight">Avaliações Recentes</h2>
                            <a href="#/avaliacoes/selecionar-aluno" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20">
                                <span>Ver todas</span>
                                <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
                            </a>
                        </div>
                        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                            <div class="overflow-x-auto">
                                <table class="w-full text-left border-collapse table-fixed">
                                    <thead>
                                        <tr class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                            <th class="py-3 px-4 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider w-[26%]">Aluno</th>
                                            <th class="py-3 px-3 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider w-[14%]">Turma</th>
                                            <th class="py-3 px-3 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider w-[22%]">Questionário</th>
                                            <th class="py-3 px-3 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider w-[14%]">Data</th>
                                            <th class="py-3 px-3 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider w-[14%] text-right">Status</th>
                                            <th class="py-3 px-3 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider w-[10%] text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                                        ${avaliacoesRecentes.length === 0 ? '<tr><td colspan="6" class="py-6 text-center text-slate-500 dark:text-slate-400 text-sm">Nenhuma avaliação recente.</td></tr>' : avaliacoesRecentes.map(av => `
                                            <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                                <td class="py-3 px-4">
                                                    <div class="flex items-center gap-2.5 min-w-0">
                                                        <div class="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 flex-shrink-0">
                                                            <span class="text-xs font-bold text-slate-600 dark:text-slate-300">${(av.aluno || '?').toString().split(' ').map(w => w[0]).join('').slice(0, 2)}</span>
                                                        </div>
                                                        <div class="flex flex-col min-w-0">
                                                            <span class="text-sm font-semibold text-slate-900 dark:text-white truncate">${av.aluno}</span>
                                                            <span class="text-[11px] text-slate-400">${av.alunoId ? '#' + String(av.alunoId).slice(0, 8) : ''}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="py-3 px-3 text-xs text-slate-600 dark:text-slate-300 truncate" title="${(av.turma || '').replace(/"/g, '&quot;')}">${av.turma}</td>
                                                <td class="py-3 px-3 text-sm text-slate-600 dark:text-slate-300 truncate">${av.questionario}</td>
                                                <td class="py-3 px-3 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">${formatDate(av.data)}</td>
                                                <td class="py-3 px-3 text-right">
                                                    <span class="inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium ${av.statusClass}">${av.statusLabel}</span>
                                                </td>
                                                <td class="py-3 px-3 text-right">
                                                    ${av.alunoId ? (av.status === 'concluido' || av.status === 'finalizado' ? '<a href="#/avaliacoes/nova?aluno=' + av.alunoId + '" class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"><span class="material-symbols-outlined text-[14px]">edit</span> Editar</a>' : '<a href="#/avaliacoes/nova?aluno=' + av.alunoId + '" class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"><span class="material-symbols-outlined text-[14px]">open_in_new</span> Acessar</a>') : ''}
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

function formatDate(dateStr) {
    if (dateStr == null || dateStr === '') return '—';
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Initialize after component is mounted
window.addEventListener('route-changed', (e) => {
    if (e.detail.route === '/avaliacoes') {
        setupLogoutButton();
        setTimeout(() => setupTipoSelection(), 100);
    }
});

function setupTipoSelection() {
    const tipoCards = document.querySelectorAll('.tipo-card');

    tipoCards.forEach(card => {
        card.addEventListener('click', () => {
            const tipo = card.dataset.tipo;
            const faixa = card.dataset.faixa || '';
            if (tipo === 'placeholder') return;
            window.router.navigate(`/avaliacoes/selecionar-aluno?questionario=${tipo}&faixa=${encodeURIComponent(faixa)}`);
        });
    });
}
