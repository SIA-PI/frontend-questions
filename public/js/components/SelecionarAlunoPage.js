// Seleção de Aluno Page - Lista Minimalista sem fotos

import { getCurrentUser } from '../utils/api.js';
import { Sidebar, setupLogoutButton } from './Sidebar.js';

export async function SelecionarAlunoPage() {
    const user = getCurrentUser();

    if (!user) {
        window.router.navigate('/login');
        return '<div></div>';
    }

    // Pegar tipo do teste da URL
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    const tipo = urlParams.get('tipo') || 'teste1';

    const tipoNomes = {
        'teste1': 'Teste 1',
        'teste2': 'Teste 2',
        'teste3': 'Teste 3'
    };

    const alunos = [
        { id: 1, nome: 'Ana Souza', turma: '3º Ano B', idade: 14 },
        { id: 2, nome: 'Carlos Lima', turma: '2º Ano A', idade: 13 },
        { id: 3, nome: 'Julia Martins', turma: '3º Ano B', idade: 14 },
        { id: 4, nome: 'Marcos Dias', turma: '1º Ano C', idade: 12 },
        { id: 5, nome: 'Beatriz Santos', turma: '2º Ano B', idade: 13 },
        { id: 6, nome: 'Pedro Oliveira', turma: '3º Ano A', idade: 15 },
        { id: 7, nome: 'Fernanda Costa', turma: '1º Ano A', idade: 12 },
        { id: 8, nome: 'Rafael Alves', turma: '3º Ano C', idade: 15 },
        { id: 9, nome: 'Camila Rocha', turma: '2º Ano C', idade: 13 },
        { id: 10, nome: 'Lucas Ferreira', turma: '1º Ano B', idade: 12 }
    ];

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
                            <span>${tipoNomes[tipo]}</span>
                            <span class="material-symbols-outlined text-[14px]">chevron_right</span>
                            <span>Selecionar Aluno</span>
                        </div>
                        
                        <div class="flex items-center justify-between gap-4">
                            <div>
                                <h1 class="text-[#0d121b] dark:text-white tracking-tight text-2xl md:text-3xl font-bold leading-tight">
                                    Selecione o Aluno
                                </h1>
                                <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Escolha o aluno para aplicar: <strong>${tipoNomes[tipo]}</strong></p>
                            </div>
                            <button onclick="window.router.navigate('/avaliacoes')" class="px-3 py-2 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                Voltar
                            </button>
                        </div>
                    </div>
                    
                    <!-- Busca -->
                    <div class="relative">
                        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
                        <input type="text" id="search-aluno" placeholder="Buscar aluno por nome ou turma..." class="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"/>
                    </div>
                    
                    <!-- Lista Compacta de Alunos -->
                    <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                        <div class="divide-y divide-slate-100 dark:divide-slate-700">
                            ${alunos.map(aluno => `
                                <div class="aluno-item flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer group" data-aluno-id="${aluno.id}" data-tipo="${tipo}">
                                    <!-- Info -->
                                    <div class="flex-1 min-w-0">
                                        <h3 class="text-sm font-semibold text-slate-900 dark:text-white truncate">${aluno.nome}</h3>
                                        <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                            <span class="flex items-center gap-1">
                                                <span class="material-symbols-outlined text-[14px]">tag</span>
                                                #${String(aluno.id).padStart(4, '0')}
                                            </span>
                                            <span class="flex items-center gap-1">
                                                <span class="material-symbols-outlined text-[14px]">school</span>
                                                ${aluno.turma}
                                            </span>
                                            <span class="flex items-center gap-1">
                                                <span class="material-symbols-outlined text-[14px]">cake</span>
                                                ${aluno.idade} anos
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <!-- Botão -->
                                    <button class="px-4 py-2 bg-primary/10 text-primary rounded-lg text-xs font-semibold group-hover:bg-primary group-hover:text-white transition-all flex items-center gap-1 flex-shrink-0">
                                        <span>Selecionar</span>
                                        <span class="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Info Footer -->
                    <p class="text-xs text-slate-400 dark:text-slate-500 text-center">
                        ${alunos.length} alunos disponíveis
                    </p>
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
    const alunoItems = document.querySelectorAll('.aluno-item');

    alunoItems.forEach(item => {
        item.addEventListener('click', () => {
            const alunoId = item.dataset.alunoId;
            const tipo = item.dataset.tipo;
            console.log('Aluno selecionado:', alunoId, 'Tipo:', tipo);
            // Navegar para formulário de avaliação
            window.router.navigate(`/avaliacoes/nova?tipo=${tipo}&aluno=${alunoId}`);
        });
    });
}

function setupSearch() {
    const searchInput = document.getElementById('search-aluno');
    const alunoItems = document.querySelectorAll('.aluno-item');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();

            alunoItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
}
