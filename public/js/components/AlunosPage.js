// Alunos Page - Gerenciamento de Alunos

import { getCurrentUser } from '../utils/api.js';
import { Sidebar, setupLogoutButton } from './Sidebar.js';

export async function AlunosPage() {
    const user = getCurrentUser();

    if (!user) {
        window.router.navigate('/login');
        return '<div></div>';
    }

    const alunos = [
        { id: 1, nome: 'Ana Souza', turma: '3º Ano B', idade: 14, status: 'Ativo', avaliacoes: 12, ultimaAvaliacao: '2024-02-01' },
        { id: 2, nome: 'Carlos Lima', turma: '2º Ano A', idade: 13, status: 'Ativo', avaliacoes: 8, ultimaAvaliacao: '2024-02-02' },
        { id: 3, nome: 'Julia Martins', turma: '3º Ano B', idade: 14, status: 'Ativo', avaliacoes: 15, ultimaAvaliacao: '2024-02-03' },
        { id: 4, nome: 'Marcos Dias', turma: '1º Ano C', idade: 12, status: 'Inativo', avaliacoes: 3, ultimaAvaliacao: '2024-01-15' },
        { id: 5, nome: 'Beatriz Santos', turma: '2º Ano B', idade: 13, status: 'Ativo', avaliacoes: 10, ultimaAvaliacao: '2024-02-04' },
        { id: 6, nome: 'Pedro Oliveira', turma: '3º Ano A', idade: 15, status: 'Ativo', avaliacoes: 14, ultimaAvaliacao: '2024-02-05' },
        { id: 7, nome: 'Fernanda Costa', turma: '1º Ano A', idade: 12, status: 'Ativo', avaliacoes: 6, ultimaAvaliacao: '2024-02-01' },
        { id: 8, nome: 'Rafael Alves', turma: '3º Ano C', idade: 15, status: 'Ativo', avaliacoes: 11, ultimaAvaliacao: '2024-02-03' },
        { id: 9, nome: 'Camila Rocha', turma: '2º Ano C', idade: 13, status: 'Ativo', avaliacoes: 9, ultimaAvaliacao: '2024-02-02' },
        { id: 10, nome: 'Lucas Ferreira', turma: '1º Ano B', idade: 12, status: 'Ativo', avaliacoes: 7, ultimaAvaliacao: '2024-02-04' }
    ];

    return `
        <div class="flex h-screen w-full flex-row">
            ${Sidebar(user, 'alunos')}
            
            <main class="flex-1 flex flex-col h-full overflow-y-auto scrollbar-hide bg-slate-50 dark:bg-background-dark">
                <div class="w-full max-w-[1400px] mx-auto p-6 md:p-8 flex flex-col gap-6">
                    <!-- Header -->
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 class="text-[#0d121b] dark:text-white tracking-tight text-2xl md:text-3xl font-bold leading-tight">
                                Alunos
                            </h1>
                            <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Gerencie todos os alunos cadastrados no sistema</p>
                        </div>
                        <button id="novo-aluno-btn" class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm flex items-center gap-2">
                            <span class="material-symbols-outlined text-[18px]">add</span>
                            Novo Aluno
                        </button>
                    </div>

                    <!-- Stats Cards -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total de Alunos</p>
                                    <p class="text-2xl font-bold text-slate-900 dark:text-white mt-2">${alunos.length}</p>
                                </div>
                                <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <span class="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[24px]">groups</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Alunos Ativos</p>
                                    <p class="text-2xl font-bold text-slate-900 dark:text-white mt-2">${alunos.filter(a => a.status === 'Ativo').length}</p>
                                </div>
                                <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <span class="material-symbols-outlined text-green-600 dark:text-green-400 text-[24px]">check_circle</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Avaliações Totais</p>
                                    <p class="text-2xl font-bold text-slate-900 dark:text-white mt-2">${alunos.reduce((sum, a) => sum + a.avaliacoes, 0)}</p>
                                </div>
                                <div class="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                    <span class="material-symbols-outlined text-purple-600 dark:text-purple-400 text-[24px]">assignment</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Média por Aluno</p>
                                    <p class="text-2xl font-bold text-slate-900 dark:text-white mt-2">${(alunos.reduce((sum, a) => sum + a.avaliacoes, 0) / alunos.length).toFixed(1)}</p>
                                </div>
                                <div class="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                    <span class="material-symbols-outlined text-orange-600 dark:text-orange-400 text-[24px]">trending_up</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Filtros e Busca -->
                    <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div class="relative md:col-span-2">
                                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
                                <input type="text" id="search-aluno" placeholder="Buscar por nome, ID ou turma..." class="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"/>
                            </div>
                            
                            <select id="filter-turma" class="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                                <option value="">Todas as Turmas</option>
                                <option>1º Ano A</option>
                                <option>1º Ano B</option>
                                <option>1º Ano C</option>
                                <option>2º Ano A</option>
                                <option>2º Ano B</option>
                                <option>2º Ano C</option>
                                <option>3º Ano A</option>
                                <option>3º Ano B</option>
                                <option>3º Ano C</option>
                            </select>
                            
                            <select id="filter-status" class="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                                <option value="">Todos os Status</option>
                                <option>Ativo</option>
                                <option>Inativo</option>
                            </select>
                        </div>
                    </div>

                    <!-- Tabela de Alunos -->
                    <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                        <th class="py-3 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">ID</th>
                                        <th class="py-3 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Aluno</th>
                                        <th class="py-3 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Turma</th>
                                        <th class="py-3 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Idade</th>
                                        <th class="py-3 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider text-center">Avaliações</th>
                                        <th class="py-3 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Última Avaliação</th>
                                        <th class="py-3 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Status</th>
                                        <th class="py-3 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-200 dark:divide-slate-700" id="alunos-tbody">
                                    ${alunos.map(aluno => `
                                        <tr class="aluno-row hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors" data-nome="${aluno.nome.toLowerCase()}" data-turma="${aluno.turma}" data-status="${aluno.status}">
                                            <td class="py-4 px-6 text-sm font-mono text-slate-600 dark:text-slate-400">#${String(aluno.id).padStart(4, '0')}</td>
                                            <td class="py-4 px-6">
                                                <div class="flex items-center gap-3">
                                                    <div class="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                                                        <span class="text-sm font-bold text-slate-600 dark:text-slate-300">${aluno.nome.split(' ').map(n => n[0]).join('')}</span>
                                                    </div>
                                                    <span class="text-sm font-semibold text-slate-900 dark:text-white">${aluno.nome}</span>
                                                </div>
                                            </td>
                                            <td class="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">${aluno.turma}</td>
                                            <td class="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">${aluno.idade} anos</td>
                                            <td class="py-4 px-6 text-sm text-slate-900 dark:text-white text-center font-semibold">${aluno.avaliacoes}</td>
                                            <td class="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">${formatDate(aluno.ultimaAvaliacao)}</td>
                                            <td class="py-4 px-6">
                                                <span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${aluno.status === 'Ativo' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400'}">
                                                    ${aluno.status}
                                                </span>
                                            </td>
                                            <td class="py-4 px-6">
                                                <div class="flex items-center justify-end gap-2">
                                                    <button class="p-1.5 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors" title="Ver Detalhes">
                                                        <span class="material-symbols-outlined text-[18px]">visibility</span>
                                                    </button>
                                                    <button class="p-1.5 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors" title="Editar">
                                                        <span class="material-symbols-outlined text-[18px]">edit</span>
                                                    </button>
                                                    <button class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors" title="Excluir">
                                                        <span class="material-symbols-outlined text-[18px]">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Paginação -->
                    <div class="flex items-center justify-between">
                        <p class="text-sm text-slate-500 dark:text-slate-400">
                            Mostrando <strong>${alunos.length}</strong> alunos
                        </p>
                        <div class="flex items-center gap-2">
                            <button class="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50" disabled>
                                Anterior
                            </button>
                            <button class="px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium">1</button>
                            <button class="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">2</button>
                            <button class="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">3</button>
                            <button class="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                Próximo
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `;
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
        }, 100);
    }
});

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

            const matchesSearch = nome.includes(searchTerm) || turma.toLowerCase().includes(searchTerm);
            const matchesTurma = !turmaFilter || turma === turmaFilter;
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
