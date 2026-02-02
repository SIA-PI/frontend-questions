// Avaliações Page - Escolha de tipo de teste

import { getCurrentUser } from '../utils/api.js';
import { Sidebar, setupLogoutButton } from './Sidebar.js';

export async function AvaliacoesPage() {
    const user = getCurrentUser();

    if (!user) {
        window.router.navigate('/login');
        return '<div></div>';
    }

    const tiposTeste = [
        {
            id: 'teste1',
            nome: 'Teste 1',
            descricao: 'Avaliação de comportamento social e interação com colegas.',
            icon: 'psychology',
            tempo: '15-20 min',
            questoes: 25,
            cor: 'blue'
        },
        {
            id: 'teste2',
            nome: 'Teste 2',
            descricao: 'Avaliação de inteligência emocional e autocontrole.',
            icon: 'favorite',
            tempo: '10-15 min',
            questoes: 18,
            cor: 'pink'
        },
        {
            id: 'teste3',
            nome: 'Teste 3',
            descricao: 'Avaliação de desempenho acadêmico e foco nas atividades.',
            icon: 'school',
            tempo: '20-25 min',
            questoes: 30,
            cor: 'green'
        }
    ];

    return `
        <div class="flex h-screen w-full flex-row">
            ${Sidebar(user, 'avaliacoes')}
            
            <main class="flex-1 flex flex-col h-full overflow-y-auto scrollbar-hide bg-white dark:bg-background-dark">
                <div class="w-full max-w-[1200px] mx-auto p-8 md:p-12 flex flex-col gap-10">
                    <div class="flex flex-col gap-4">
                        <h1 class="text-[#0d121b] dark:text-white tracking-tight text-[32px] md:text-4xl font-bold leading-tight">
                            Escolha o Tipo de Teste
                        </h1>
                        <p class="text-slate-500 dark:text-slate-400">Selecione o teste que deseja aplicar aos alunos.</p>
                    </div>
                    
                    <!-- Cards de Tipos de Teste -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${tiposTeste.map(tipo => `
                            <div class="tipo-card group bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-8 hover:border-primary hover:shadow-2xl hover:shadow-blue-100 dark:hover:shadow-none transition-all duration-300 cursor-pointer relative overflow-hidden" data-tipo="${tipo.id}">
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
                                        <span>Selecionar Aluno</span>
                                        <span class="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- Histórico de Avaliações -->
                    <div class="flex flex-col gap-6 mt-8">
                        <div class="flex items-center justify-between">
                            <h2 class="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-tight">Avaliações Recentes</h2>
                            <button class="text-primary text-sm font-semibold hover:underline">Ver Todas</button>
                        </div>
                        
                        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                            <div class="overflow-x-auto">
                                <table class="w-full text-left border-collapse">
                                    <thead>
                                        <tr class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                            <th class="py-4 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Aluno</th>
                                            <th class="py-4 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Teste</th>
                                            <th class="py-4 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Data</th>
                                            <th class="py-4 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                                        ${getAvaliacoesRecentes().map(av => `
                                            <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                                <td class="py-4 px-6">
                                                    <div class="flex items-center gap-3">
                                                        <div class="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                                            <span class="text-sm font-bold text-slate-600 dark:text-slate-300">${av.aluno.split(' ').map(n => n[0]).join('')}</span>
                                                        </div>
                                                        <div class="flex flex-col">
                                                            <span class="text-sm font-semibold text-slate-900 dark:text-white">${av.aluno}</span>
                                                            <span class="text-xs text-slate-500">${av.turma}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">${av.teste}</td>
                                                <td class="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">${formatDate(av.data)}</td>
                                                <td class="py-4 px-6 text-right">
                                                    <span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(av.status)}">
                                                        ${av.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `;
}

function getAvaliacoesRecentes() {
    return [
        { aluno: 'Ana Souza', turma: '3º Ano B', teste: 'Teste 1', data: '2024-02-01', status: 'Concluída' },
        { aluno: 'Carlos Lima', turma: '2º Ano A', teste: 'Teste 2', data: '2024-02-02', status: 'Em Andamento' },
        { aluno: 'Julia Martins', turma: '3º Ano B', teste: 'Teste 3', data: '2024-02-03', status: 'Pendente' }
    ];
}

function getStatusClass(status) {
    const classes = {
        'Concluída': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
        'Em Andamento': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
        'Pendente': 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400'
    };
    return classes[status] || 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400';
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
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
            console.log('Tipo selecionado:', tipo);
            // Navegar para seleção de aluno
            window.router.navigate(`/avaliacoes/selecionar-aluno?tipo=${tipo}`);
        });
    });
}
