// Nova Avaliação Page - Baseado em evaluator_dashboard_2

import { getCurrentUser } from '../utils/api.js';
import { Sidebar, setupLogoutButton } from './Sidebar.js';

export async function NovaAvaliacaoPage() {
    const user = getCurrentUser();

    if (!user) {
        window.router.navigate('/login');
        return '<div></div>';
    }

    return `
        <div class="flex h-screen w-full flex-row">
            ${Sidebar(user, 'avaliacoes')}
            
            <main class="flex-1 flex flex-col h-full overflow-y-auto scrollbar-hide bg-white dark:bg-background-dark">
                <div class="w-full max-w-[1000px] mx-auto p-8 md:p-12 flex flex-col gap-8">
                    <div class="flex flex-col gap-6 border-b border-slate-200 dark:border-slate-700 pb-8">
                        <div class="flex justify-between items-start">
                            <div class="flex flex-col gap-2">
                                <div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                    <a class="hover:text-primary transition-colors cursor-pointer" onclick="window.router.navigate('/avaliacoes')">Avaliações</a>
                                    <span class="material-symbols-outlined text-[14px]">chevron_right</span>
                                    <span>Nova Avaliação</span>
                                </div>
                                <h1 class="text-[#0d121b] dark:text-white tracking-tight text-[32px] md:text-4xl font-bold leading-tight">
                                    Avaliação Comportamental
                                </h1>
                            </div>
                            <div class="flex gap-3">
                                <button onclick="window.router.navigate('/avaliacoes')" class="px-4 py-2 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                    Cancelar
                                </button>
                                <button id="save-btn" class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm shadow-blue-200 dark:shadow-none flex items-center gap-2">
                                    <span class="material-symbols-outlined text-[18px]">save</span>
                                    Salvar Avaliação
                                </button>
                            </div>
                        </div>
                        
                        <div class="flex items-center gap-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                            <div class="h-16 w-16 rounded-full bg-cover bg-center ring-4 ring-white dark:ring-slate-700 shadow-sm shrink-0" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAmYFcFKBvqSd0El0UOjQP_tWdls61SFBSED-g6ldBgHMOdIuMBvZTDI2P4vKrl5sRYT5y2WwwhvUtY2Yv8Tt5CgHRl6UFQYVDgyQhyWDeN2T0k7fuKZInEROXpnnzCOTl0UlU-ma-LPs57w6dGz49x_oBQg0dXgNCwM6rVeF1yVfe4xtmbJbeLeAtGnJvFymteLCi-5CEvqhmGLq1G0a5FsB0Nev7oJXrZaT3gXAZUr3DiVE0QzJ3tTgQRIf3TMahaO_RbdYKgIByH");'></div>
                            <div class="flex flex-col gap-1">
                                <h2 class="text-lg font-bold text-slate-900 dark:text-white">Ana Souza</h2>
                                <div class="flex gap-4 text-sm text-slate-500 dark:text-slate-400">
                                    <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">id_card</span> ID: #8832</span>
                                    <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">school</span> 3º Ano B</span>
                                    <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">calendar_today</span> 14 Anos</span>
                                </div>
                            </div>
                            <div class="ml-auto flex items-center gap-2">
                                <span class="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wide">Em Progresso</span>
                            </div>
                        </div>
                    </div>
                    
                    <form class="flex flex-col gap-8" id="avaliacao-form">
                        <section class="flex flex-col gap-4">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary font-bold text-sm">1</span>
                                <h3 class="text-xl font-semibold text-slate-900 dark:text-white">Observações Gerais</h3>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="col-span-1">
                                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" for="date">Data da Observação</label>
                                    <input class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm" id="date" type="date" value="2023-10-24"/>
                                </div>
                                <div class="col-span-1">
                                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" for="context">Contexto da Avaliação</label>
                                    <select class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm" id="context">
                                        <option>Sala de Aula - Aula Regular</option>
                                        <option>Atividade em Grupo</option>
                                        <option>Recreio / Intervalo</option>
                                        <option>Apresentação de Trabalho</option>
                                    </select>
                                </div>
                                <div class="col-span-2">
                                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" for="notes">Anotações Iniciais</label>
                                    <textarea class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm placeholder:text-slate-400" id="notes" placeholder="Descreva brevemente o estado inicial do aluno e o ambiente..." rows="3"></textarea>
                                </div>
                            </div>
                        </section>
                        
                        <hr class="border-slate-200 dark:border-slate-700"/>
                        
                        <section class="flex flex-col gap-4">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary font-bold text-sm">2</span>
                                <h3 class="text-xl font-semibold text-slate-900 dark:text-white">Traços Comportamentais</h3>
                            </div>
                            <div class="grid grid-cols-1 gap-6">
                                ${createTraitCard('Interação Social', 'Como o aluno interage com colegas e professores durante as atividades.', 3, 'Isolado', 'Neutro', 'Extremamente Sociável')}
                                ${createTraitCard('Foco e Atenção', 'Capacidade de manter a concentração nas tarefas propostas.', 4, 'Disperso', 'Focado', '')}
                                ${createTraitCard('Resolução de Conflitos', 'Habilidade em lidar com adversidades ou desentendimentos.', 2, 'Agressivo/Passivo', 'Assertivo', '')}
                            </div>
                        </section>
                        
                        <hr class="border-slate-200 dark:border-slate-700"/>
                        
                        <section class="flex flex-col gap-4 mb-8">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary font-bold text-sm">3</span>
                                <h3 class="text-xl font-semibold text-slate-900 dark:text-white">Parecer Final</h3>
                            </div>
                            <div>
                                <textarea class="w-full rounded-xl border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-4 placeholder:text-slate-400" placeholder="Escreva aqui suas considerações finais sobre o comportamento do aluno..." rows="5"></textarea>
                                <p class="text-xs text-slate-500 mt-2 text-right">Mínimo de 50 caracteres.</p>
                            </div>
                        </section>
                    </form>
                </div>
            </main>
        </div>
    `;
}

function createTraitCard(title, description, value, labelMin, labelMid, labelMax) {
    return `
        <div class="p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                    <h4 class="font-semibold text-slate-900 dark:text-white">${title}</h4>
                    <p class="text-sm text-slate-500 dark:text-slate-400">${description}</p>
                </div>
                <div class="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    <button class="h-8 w-8 flex items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-red-500 transition-colors" type="button">
                        <span class="material-symbols-outlined text-[20px]">thumb_down</span>
                    </button>
                    <div class="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                    <button class="h-8 w-8 flex items-center justify-center rounded bg-blue-50 dark:bg-blue-900/30 text-primary font-bold" type="button">${value}</button>
                    <div class="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                    <button class="h-8 w-8 flex items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-green-500 transition-colors" type="button">
                        <span class="material-symbols-outlined text-[20px]">thumb_up</span>
                    </button>
                </div>
            </div>
            <input class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-primary" max="5" min="1" type="range" value="${value}"/>
            <div class="flex justify-between mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span>${labelMin}</span>
                ${labelMid ? `<span>${labelMid}</span>` : ''}
                ${labelMax ? `<span>${labelMax}</span>` : ''}
            </div>
        </div>
    `;
}

// Initialize after component is mounted
window.addEventListener('route-changed', (e) => {
    if (e.detail.route === '/avaliacoes/nova') {
        setupLogoutButton();
        setupSaveButton();
    }
});

function setupSaveButton() {
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Avaliação salva com sucesso!');
            window.router.navigate('/avaliacoes');
        });
    }
}
