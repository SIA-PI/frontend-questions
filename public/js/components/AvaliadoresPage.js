// Avaliadores Page - Gerenciamento de Avaliadores

import { getCurrentUser } from '../utils/api.js';
import { Sidebar, setupLogoutButton } from './Sidebar.js';
import { setupNovoAvaliadorModal } from '../utils/modalAvaliador.js';

export async function AvaliadoresPage() {
    const user = getCurrentUser();

    if (!user) {
        window.router.navigate('/login');
        return '<div></div>';
    }

    // Verificar se é admin
    const isAdmin = user.role === 'admin';

    const avaliadores = [
        { id: 1, nome: 'Maria Silva', email: 'maria@escola.com', cidade: 'São Paulo - SP', escola: 'Escola Central', status: 'Ativo', avaliacoes: 45, ultimoAcesso: '2024-02-05 14:30', dataCadastro: '2023-01-15' },
        { id: 2, nome: 'João Santos', email: 'joao@escola.com', cidade: 'São Paulo - SP', escola: 'Escola Norte', status: 'Ativo', avaliacoes: 38, ultimoAcesso: '2024-02-05 10:15', dataCadastro: '2023-02-20' },
        { id: 3, nome: 'Ana Costa', email: 'ana@escola.com', cidade: 'Rio de Janeiro - RJ', escola: 'Escola Sul', status: 'Ativo', avaliacoes: 52, ultimoAcesso: '2024-02-04 16:45', dataCadastro: '2023-03-10' },
        { id: 4, nome: 'Pedro Oliveira', email: 'pedro@escola.com', cidade: 'Belo Horizonte - MG', escola: 'Escola Leste', status: 'Inativo', avaliacoes: 41, ultimoAcesso: '2024-01-28 09:20', dataCadastro: '2023-04-05' },
        { id: 5, nome: 'Carla Mendes', email: 'carla@escola.com', cidade: 'São Paulo - SP', escola: 'Escola Oeste', status: 'Ativo', avaliacoes: 29, ultimoAcesso: '2024-02-05 11:00', dataCadastro: '2023-05-12' }
    ];

    return `
        <div class="flex h-screen w-full flex-row">
            ${Sidebar(user, 'avaliadores')}
            
            <main class="flex-1 flex flex-col h-full overflow-y-auto scrollbar-hide bg-slate-50 dark:bg-background-dark">
                <div class="w-full max-w-[1400px] mx-auto p-6 md:p-8 flex flex-col gap-6">
                    <!-- Header -->
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 class="text-[#0d121b] dark:text-white tracking-tight text-2xl md:text-3xl font-bold leading-tight">
                                Avaliadores
                            </h1>
                            <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Gerencie todos os avaliadores do sistema</p>
                        </div>
                        ${isAdmin ? `
                            <button id="novo-avaliador-btn" class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm flex items-center gap-2">
                                <span class="material-symbols-outlined text-[18px]">person_add</span>
                                Novo Avaliador
                            </button>
                        ` : ''}
                    </div>

                    <!-- Stats Cards -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total</p>
                                    <p class="text-2xl font-bold text-slate-900 dark:text-white mt-2">${avaliadores.length}</p>
                                </div>
                                <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <span class="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[24px]">people</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ativos</p>
                                    <p class="text-2xl font-bold text-slate-900 dark:text-white mt-2">${avaliadores.filter(a => a.status === 'Ativo').length}</p>
                                </div>
                                <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <span class="material-symbols-outlined text-green-600 dark:text-green-400 text-[24px]">check_circle</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Avaliações Hoje</p>
                                    <p class="text-2xl font-bold text-slate-900 dark:text-white mt-2">23</p>
                                </div>
                                <div class="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                    <span class="material-symbols-outlined text-purple-600 dark:text-purple-400 text-[24px]">assignment</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Online Agora</p>
                                    <p class="text-2xl font-bold text-slate-900 dark:text-white mt-2">3</p>
                                </div>
                                <div class="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                    <span class="material-symbols-outlined text-orange-600 dark:text-orange-400 text-[24px]">wifi</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Filtros e Busca -->
                    <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div class="relative md:col-span-2">
                                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
                                <input type="text" id="search-avaliador" placeholder="Buscar por nome, email ou escola..." class="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"/>
                            </div>
                            
                            <select id="filter-cidade" class="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                                <option value="">Todas as Cidades</option>
                                <option>São Paulo - SP</option>
                                <option>Rio de Janeiro - RJ</option>
                                <option>Belo Horizonte - MG</option>
                            </select>
                            
                            <select id="filter-status" class="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                                <option value="">Todos os Status</option>
                                <option>Ativo</option>
                                <option>Inativo</option>
                            </select>
                        </div>
                    </div>

                    <!-- Tabela de Avaliadores -->
                    <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                        <th class="py-3 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Avaliador</th>
                                        <th class="py-3 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Cidade</th>
                                        <th class="py-3 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Escola</th>
                                        <th class="py-3 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider text-center">Avaliações</th>
                                        <th class="py-3 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Último Acesso</th>
                                        <th class="py-3 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Status</th>
                                        <th class="py-3 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-200 dark:divide-slate-700" id="avaliadores-tbody">
                                    ${avaliadores.map(av => `
                                        <tr class="avaliador-row hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors" data-nome="${av.nome.toLowerCase()}" data-email="${av.email.toLowerCase()}" data-cidade="${av.cidade}" data-status="${av.status}">
                                            <td class="py-4 px-6">
                                                <div class="flex items-center gap-3">
                                                    <div class="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                                                        <span class="text-sm font-bold text-slate-600 dark:text-slate-300">${av.nome.split(' ').map(n => n[0]).join('')}</span>
                                                    </div>
                                                    <div>
                                                        <p class="text-sm font-semibold text-slate-900 dark:text-white">${av.nome}</p>
                                                        <p class="text-xs text-slate-500 dark:text-slate-400">${av.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">${av.cidade}</td>
                                            <td class="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">${av.escola}</td>
                                            <td class="py-4 px-6 text-sm text-slate-900 dark:text-white text-center font-semibold">${av.avaliacoes}</td>
                                            <td class="py-4 px-6">
                                                <div class="flex flex-col">
                                                    <span class="text-sm text-slate-900 dark:text-white">${formatDateTime(av.ultimoAcesso).date}</span>
                                                    <span class="text-xs text-slate-500 dark:text-slate-400">${formatDateTime(av.ultimoAcesso).time}</span>
                                                </div>
                                            </td>
                                            <td class="py-4 px-6">
                                                <span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${av.status === 'Ativo' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400'}">
                                                    <span class="w-1.5 h-1.5 rounded-full ${av.status === 'Ativo' ? 'bg-green-600' : 'bg-gray-600'}"></span>
                                                    ${av.status}
                                                </span>
                                            </td>
                                            <td class="py-4 px-6">
                                                <div class="flex items-center justify-end gap-2">
                                                    <button class="p-1.5 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors" title="Ver Detalhes">
                                                        <span class="material-symbols-outlined text-[18px]">visibility</span>
                                                    </button>
                                                    ${isAdmin ? `
                                                        <button class="p-1.5 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors" title="Editar">
                                                            <span class="material-symbols-outlined text-[18px]">edit</span>
                                                        </button>
                                                        <button class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors" title="Desativar">
                                                            <span class="material-symbols-outlined text-[18px]">block</span>
                                                        </button>
                                                    ` : ''}
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
                            Mostrando <strong>${avaliadores.length}</strong> avaliadores
                        </p>
                        <div class="flex items-center gap-2">
                            <button class="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50" disabled>
                                Anterior
                            </button>
                            <button class="px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium">1</button>
                            <button class="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                Próximo
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            
            <!-- Modal Novo Avaliador -->
            <div id="modal-novo-avaliador" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
                <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <!-- Header -->
                    <div class="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between z-10">
                        <div>
                            <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Novo Avaliador</h2>
                            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Preencha os dados para cadastrar um novo avaliador</p>
                        </div>
                        <button id="close-modal-btn" class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                            <span class="material-symbols-outlined text-slate-400">close</span>
                        </button>
                    </div>
                    
                    <!-- Form -->
                    <form id="form-novo-avaliador" class="p-6 space-y-6">
                        <!-- Informações Pessoais -->
                        <div class="space-y-4">
                            <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Informações Pessoais</h3>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Nome Completo <span class="text-red-500">*</span>
                                    </label>
                                    <input type="text" name="nome" required class="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="Ex: Maria Silva"/>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Email <span class="text-red-500">*</span>
                                    </label>
                                    <input type="email" name="email" required class="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="Ex: maria@escola.com"/>
                                </div>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Telefone
                                    </label>
                                    <input type="tel" name="telefone" class="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="(11) 99999-9999"/>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        CPF
                                    </label>
                                    <input type="text" name="cpf" class="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="000.000.000-00"/>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Localização -->
                        <div class="space-y-4">
                            <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Localização</h3>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Cidade <span class="text-red-500">*</span>
                                    </label>
                                    <select name="cidade" required class="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                                        <option value="">Selecione...</option>
                                        <option>São Paulo - SP</option>
                                        <option>Rio de Janeiro - RJ</option>
                                        <option>Belo Horizonte - MG</option>
                                        <option>Curitiba - PR</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Escola <span class="text-red-500">*</span>
                                    </label>
                                    <select name="escola" required class="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                                        <option value="">Selecione...</option>
                                        <option>Escola Central</option>
                                        <option>Escola Norte</option>
                                        <option>Escola Sul</option>
                                        <option>Escola Leste</option>
                                        <option>Escola Oeste</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Acesso -->
                        <div class="space-y-4">
                            <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Acesso ao Sistema</h3>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Senha <span class="text-red-500">*</span>
                                    </label>
                                    <input type="password" name="senha" required class="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="Mínimo 8 caracteres"/>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Confirmar Senha <span class="text-red-500">*</span>
                                    </label>
                                    <input type="password" name="confirmarSenha" required class="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="Repita a senha"/>
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Nível de Acesso <span class="text-red-500">*</span>
                                </label>
                                <select name="role" required class="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option value="">Selecione...</option>
                                    <option value="avaliador">Avaliador</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Status -->
                        <div class="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                            <input type="checkbox" id="status-ativo" name="status" checked class="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary"/>
                            <label for="status-ativo" class="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                                Ativar avaliador imediatamente
                            </label>
                        </div>
                        
                        <!-- Buttons -->
                        <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <button type="button" id="cancel-btn" class="px-6 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                Cancelar
                            </button>
                            <button type="submit" class="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm flex items-center gap-2">
                                <span class="material-symbols-outlined text-[18px]">person_add</span>
                                Cadastrar Avaliador
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}

function formatDateTime(dateTimeStr) {
    const [datePart, timePart] = dateTimeStr.split(' ');
    const [year, month, day] = datePart.split('-');
    return {
        date: `${day}/${month}/${year}`,
        time: timePart
    };
}

// Initialize after component is mounted
window.addEventListener('route-changed', (e) => {
    if (e.detail.route === '/avaliadores') {
        setupLogoutButton();
        setTimeout(() => {
            setupAvaliadoresFilters();
            setupNovoAvaliadorModal();
        }, 100);
    }
});

function setupAvaliadoresFilters() {
    const searchInput = document.getElementById('search-avaliador');
    const filterCidade = document.getElementById('filter-cidade');
    const filterStatus = document.getElementById('filter-status');
    const avaliadorRows = document.querySelectorAll('.avaliador-row');

    function applyFilters() {
        const searchTerm = searchInput?.value.toLowerCase() || '';
        const cidadeFilter = filterCidade?.value || '';
        const statusFilter = filterStatus?.value || '';

        avaliadorRows.forEach(row => {
            const nome = row.dataset.nome || '';
            const email = row.dataset.email || '';
            const cidade = row.dataset.cidade || '';
            const status = row.dataset.status || '';

            const matchesSearch = nome.includes(searchTerm) || email.includes(searchTerm);
            const matchesCidade = !cidadeFilter || cidade === cidadeFilter;
            const matchesStatus = !statusFilter || status === statusFilter;

            if (matchesSearch && matchesCidade && matchesStatus) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    searchInput?.addEventListener('input', applyFilters);
    filterCidade?.addEventListener('change', applyFilters);
    filterStatus?.addEventListener('change', applyFilters);
}

function setupNovoAvaliadorButton() {
    const novoAvaliadorBtn = document.getElementById('novo-avaliador-btn');

    if (novoAvaliadorBtn) {
        novoAvaliadorBtn.addEventListener('click', () => {
            alert('Funcionalidade de cadastro de novo avaliador em desenvolvimento!\n\nCampos do formulário:\n- Nome completo\n- Email\n- Cidade\n- Escola\n- Senha\n- Permissões');
        });
    }
}
