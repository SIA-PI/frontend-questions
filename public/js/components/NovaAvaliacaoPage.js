// Nova Avaliação Page - Baseado em evaluator_dashboard_2

import { getCurrentUser } from '../utils/api.js';
import { Sidebar, setupLogoutButton } from './Sidebar.js';

export async function NovaAvaliacaoPage() {
    const user = getCurrentUser();

    if (!user) {
        window.router.navigate('/login');
        return '<div></div>';
    }

    const hashStr = window.location.hash || '';
    const queryString = hashStr.includes('?') ? hashStr.split('?')[1] : '';
    const urlParams = new URLSearchParams(queryString);
    const tipo = urlParams.get('tipo') || 'teste1';

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
                        <hr class="border-slate-200 dark:border-slate-700"/>    
                        </section>
                        <section class="flex flex-col gap-4">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary font-bold text-sm">${tipo === 'teste1' ? '2' : '2'}</span>
                                <h3 class="text-xl font-semibold text-slate-900 dark:text-white">Traços Comportamentais</h3>
                            </div>
                            <div class="grid grid-cols-1 gap-6">
                                ${createTraitCard('Interação Social', 'Como o aluno interage com colegas e professores durante as atividades.', 3, 'Isolado', 'Neutro', 'Extremamente Sociável')}
                                ${createTraitCard('Foco e Atenção', 'Capacidade de manter a concentração nas tarefas propostas.', 4, 'Disperso', 'Focado', '')}
                                ${createTraitCard('Resolução de Conflitos', 'Habilidade em lidar com adversidades ou desentendimentos.', 2, 'Agressivo/Passivo', 'Assertivo', '')}
                            </div>
                        </section>
                        <hr class="border-slate-200 dark:border-slate-700"/>

                        ${tipo === 'teste1' ? `
                        <hr class="border-slate-200 dark:border-slate-700"/>
                        
                        <section class="flex flex-col gap-4">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary font-bold text-sm">3</span>
                                <h3 class="text-xl font-semibold text-slate-900 dark:text-white">INTERSECCIONALIDADE</h3>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                ${createYesNoQuestion('e_crianca', 'É criança?')}
                                ${createYesNoQuestion('sexo_feminino', 'É do sexo feminino?')}
                                ${createYesNoQuestion('preto_pardo', 'A família identifica a estudante como preto(a) ou pardo(a)?')}
                                ${createYesNoQuestion('religiao_africana', 'A família se identifica com religião da matriz africana?')}
                                ${createYesNoQuestion('deficiencia', 'O (a) estudante possui deficiência física, intelectual ou doença degenerativa?')}
                                ${createYesNoQuestion('beneficio', 'A família recebe algum benefício de transferência de renda do governo?')}
                                ${createYesNoQuestion('renda', 'A Renda familiar é menor do que 3 SM?')}
                            </div>
                        </section>

                        <hr class="border-slate-200 dark:border-slate-700"/>

                        <section class="flex flex-col gap-4">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary font-bold text-sm">4</span>
                                <h3 class="text-xl font-semibold text-slate-900 dark:text-white">REDE FAMILIAR</h3>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                ${createYesNoQuestion('fam_monoparental_mulher', 'O (a) estudante está em família monoparental chefiada por mulher?')}
                                ${createYesNoQuestion('orfao_feminicidio', 'O (a) estudante é órfão do Feminicídio?')}
                                ${createYesNoQuestion('irmao_deficiencia', 'O (a) estudante possui irmão com deficiência?')}
                                ${createYesNoQuestion('irmao_evasao', 'O (a) estudante possui irmão com histórico de evasão escolar?')}
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('composicao_familiar', 'Os pais são separados, convive com padrasto, os pais são falecidos, possui somente pai ou possui somente mãe?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('atividades_ilicitas', 'Há relatos de que familiares do aluno atuam em atividades ilícitas?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('fam_nao_participa', 'A família NÃO participa de forma assídua e frequente da vida escolar do aluno?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('troca_cuidador', 'Ocorre a troca de cuidador(a) do estudante de forma recorrente?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('violencia_intrafamiliar', 'O (a) estudante já presenciou alguma situação de violência intrafamiliar?')}
                                </div>
                            </div>
                        </section>

                        <hr class="border-slate-200 dark:border-slate-700"/>

                        <section class="flex flex-col gap-4">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary font-bold text-sm">5</span>
                                <h3 class="text-xl font-semibold text-slate-900 dark:text-white">SAÚDE</h3>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                ${createYesNoQuestion('saude_inseguranca_alimentar', 'Tem indícios de que o (a) estudante esteja em situação de insegurança alimentar?')}
                                ${createYesNoQuestion('saude_higiene_comprometida', 'A higiene pessoal do aluno está comprometida?')}
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('saude_comportamento', 'O estudante apresenta comportamento : agressivos, retraídos, irritação excessiva ou regressivos?')}
                                </div>
                                ${createYesNoQuestion('saude_carteira_desatualizada', 'A carteira de saúde do aluno não está atualizada?')}
                                ${createYesNoQuestion('saude_medicacao', 'Faz uso de alguma medicação?')}
                                ${createYesNoQuestion('saude_acompanhamento', 'O aluno faz algum acompanhamento multiprofissional?')}
                                ${createYesNoQuestion('saude_intolerancia', 'O estudante possui alguma intolerância alimentar?')}
                            </div>
                        </section>
                        <hr class="border-slate-200 dark:border-slate-700"/>

                        <section class="flex flex-col gap-4">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary font-bold text-sm">6</span>
                                <h3 class="text-xl font-semibold text-slate-900 dark:text-white">EDUCAÇÃO</h3>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('educacao_desenvolvimento', 'O estudante apresenta desenvolvimento cognitivo ou motor inadequados para idade?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('educacao_faltas', 'O (a) aluno (a) possui faltas recorrentes à escola?')}
                                </div>
                            </div>
                        </section>

                        <hr class="border-slate-200 dark:border-slate-700"/>

                        <section class="flex flex-col gap-4">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary font-bold text-sm">7</span>
                                <h3 class="text-xl font-semibold text-slate-900 dark:text-white">SÓCIO-TERRITORIAL</h3>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('socioterritorial_distancia', 'O (a) estudante NÃO mora próximo a escola?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('socioterritorial_vulnerabilidade_social', 'O (a) estudante reside em área de vulnerabilidade social (moradia precária)?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('socioterritorial_vulnerabilidade_criminal', 'Sabe informar se o (a) estudante reside em área de vulnerabilidade criminal (área violentada)?')}
                                </div>
                            </div>
                        </section>

                        <hr class="border-slate-200 dark:border-slate-700"/>

                        <section class="flex flex-col gap-4">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary font-bold text-sm">8</span>
                                <h3 class="text-xl font-semibold text-slate-900 dark:text-white">SEGURANÇA</h3>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('seguranca_lesoes', 'O (a) estudante possui lesões resultantes de alguma violência sofrida?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('seguranca_violencia_sexual', 'O (a) estudante foi vítima de violência sexual?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('seguranca_maus_tratos', 'O aluno apresenta sinais de maus tratos?')}
                                </div>
                            </div>
                        </section>
                        ` : ''}

                        ${tipo === 'teste2' ? `
                        <hr class="border-slate-200 dark:border-slate-700"/>
                        
                        <section class="flex flex-col gap-4">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary font-bold text-sm">3</span>
                                <h3 class="text-xl font-semibold text-slate-900 dark:text-white">INTERSECCIONALIDADE</h3>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                ${createYesNoQuestion('t2_crianca', 'É Criança ?')}
                                ${createYesNoQuestion('t2_sexo', 'É do sexo feminino?')}
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t2_raca', 'A família ou o (a) estudante se identifica como preto(a) ou pardo(a)?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t2_religiao', 'A família ou estudante se identifica com religião da matriz africana?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t2_deficiencia', 'O (a) estudante possui deficiência física, intelectual ou doença degenerativa?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t2_beneficio', 'A família recebe algum benefício de transferência de renda do governo?')}
                                </div>
                                ${createYesNoQuestion('t2_renda', 'A Renda familiar é menor do que 3 SM?')}
                            </div>
                        </section>

                        <hr class="border-slate-200 dark:border-slate-700"/>

                        <section class="flex flex-col gap-4">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary font-bold text-sm">4</span>
                                <h3 class="text-xl font-semibold text-slate-900 dark:text-white">REDE FAMILIAR</h3>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t2_monoparental', 'O (a) estudante está em família monoparental chefiada por mulher?')}
                                </div>
                                ${createYesNoQuestion('t2_orfao', 'O (a) estudante é órfão do Feminicídio?')}
                                ${createYesNoQuestion('t2_irmao_deficiencia', 'O (a) estudante possui irmão com deficiência?')}
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t2_irmao_evasao', 'O (a) estudante possui irmão com histórico de evasão escolar?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t2_pais_separados', 'Os pais são separados, convive com padrasto, os pais são falecidos, possui somente pai ou possui somente mãe?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t2_ilicitas', 'Há relatos de que familiares do aluno atuam em atividades ilícitas?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t2_participa_escola', 'A família não participa de forma assídua e frequente da vida escolar do aluno?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t2_violencia_intra', 'O (a) estudante já presenciou alguma situação de violência intrafamiliar?')}
                                </div>
                            </div>
                        </section>

                        <hr class="border-slate-200 dark:border-slate-700"/>

                        <section class="flex flex-col gap-4">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary font-bold text-sm">5</span>
                                <h3 class="text-xl font-semibold text-slate-900 dark:text-white">SAÚDE</h3>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t2_fragilidade', 'O (a) estudante possui alguma fragilidade emocional?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t2_inseguranca', 'Tem indícios de que o (a) estudante esteja em situação de insegurança alimentar?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t2_comportamento', 'O estudante apresenta comportamento : agressivos, retraídos, irritação excessiva ou regressivos?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t2_acompanhamento', 'O aluno faz algum acompanhamento multiprofissional?')}
                                </div>
                            </div>
                        </section>

                        <hr class="border-slate-200 dark:border-slate-700"/>

                        <section class="flex flex-col gap-4">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary font-bold text-sm">6</span>
                                <h3 class="text-xl font-semibold text-slate-900 dark:text-white">EDUCAÇÃO</h3>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                ${createYesNoQuestion('t2_repetiu', 'O (a) estudante já repetiu de ano?')}
                                ${createYesNoQuestion('t2_faltas', 'O (a) aluno (a) possui faltas recorrentes à escola?')}
                                ${createYesNoQuestion('t2_abandonou', 'O (a) estudante abandonou a escola alguma vez?')}
                            </div>
                        </section>

                        <hr class="border-slate-200 dark:border-slate-700"/>

                        <section class="flex flex-col gap-4">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary font-bold text-sm">7</span>
                                <h3 class="text-xl font-semibold text-slate-900 dark:text-white">SÓCIO-TERRITORIAL</h3>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t2_transporte', 'O (a) estudante tem dificuldade de acessar transporte público?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t2_vuln_social', 'O (a) estudante reside em área de vulnerabilidade social (moradia precária)?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t2_vuln_criminal', 'Sabe informar se o (a) estudante reside em área de vulnerabilidade criminal (área violentada)?')}
                                </div>
                            </div>
                        </section>

                        <hr class="border-slate-200 dark:border-slate-700"/>

                        <section class="flex flex-col gap-4">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary font-bold text-sm">8</span>
                                <h3 class="text-xl font-semibold text-slate-900 dark:text-white">SEGURANÇA</h3>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                ${createYesNoQuestion('t2_sofreu_bullying', 'O (a) estudante sofreu bullying?')}
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t2_lesoes', 'O (a) estudante possui lesões resultantes de alguma violência sofrida?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t2_vitima_sexual', 'O (a) estudante foi vítima de violência sexual?')}
                                </div>
                                ${createYesNoQuestion('t2_praticou_bullying', 'O (a) estudante praticou Bullying?')}
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t2_atritos_colegas', 'O (a) estudante já teve atritos com colegas?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t2_atritos_prof', 'O (a) estudante já teve atritos com professores e/ou colaboradores?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t2_viol_virtual', 'O (a) estudante se há suspeita de que o (a) aluno tenha sofrido violência em ambiente virtual?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t2_liderancas', 'Há relatos de lideranças negativas no território em que o (a) aluno(a) reside?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t2_maus_tratos', 'O aluno apresenta sinais de maus tratos?')}
                                </div>
                            </div>
                        </section>
                        ` : ''}

                        ${tipo === 'teste3' ? `
                        <hr class="border-slate-200 dark:border-slate-700"/>
                        
                        <section class="flex flex-col gap-4">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary font-bold text-sm">3</span>
                                <h3 class="text-xl font-semibold text-slate-900 dark:text-white">INTERSECCIONALIDADE</h3>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                ${createYesNoQuestion('t3_crianca_adol', 'É Criança ou adolescente?')}
                                ${createYesNoQuestion('t3_sexo', 'É do sexo feminino?')}
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_nao_hetero', 'O (a) estudante NÃO se identifica como heterossexual? (orientação sexual)')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_raca', 'A família ou o (a) estudante se identifica como preto(a) ou pardo(a)?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_religiao', 'A família ou estudante se identifica com religião da matriz africana?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_deficiencia', 'O (a) estudante possui deficiência física, intelectual ou doença degenerativa?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_beneficio', 'A família recebe algum benefício de transferência de renda do governo?')}
                                </div>
                                ${createYesNoQuestion('t3_renda', 'A Renda familiar é menor do que 3 SM?')}
                            </div>
                        </section>

                        <hr class="border-slate-200 dark:border-slate-700"/>

                        <section class="flex flex-col gap-4">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary font-bold text-sm">4</span>
                                <h3 class="text-xl font-semibold text-slate-900 dark:text-white">REDE FAMILIAR</h3>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_monoparental', 'O (a) estudante está em família monoparental chefiada por mulher?')}
                                </div>
                                ${createYesNoQuestion('t3_orfao', 'O (a) estudante é órfão do Feminicídio?')}
                                ${createYesNoQuestion('t3_irmao_deficiencia', 'O (a) estudante possui irmão com deficiência?')}
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_irmao_evasao', 'O (a) estudante possui irmão com histórico de evasão escolar?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_pais_separados', 'Os pais são separados, convive com padrasto, os pais são falecidos, possui somente pai ou possui somente mãe?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_ilicitas', 'Há relatos de que familiares do aluno atuam em atividades ilícitas?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_participa_escola', 'A família não participa de forma assídua e frequente da vida escolar do aluno?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_violencia_intra', 'O (a) estudante já presenciou alguma situação de violência intrafamiliar?')}
                                </div>
                            </div>
                        </section>

                        <hr class="border-slate-200 dark:border-slate-700"/>

                        <section class="flex flex-col gap-4">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary font-bold text-sm">5</span>
                                <h3 class="text-xl font-semibold text-slate-900 dark:text-white">SAÚDE</h3>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                ${createYesNoQuestion('t3_aborto', 'A estudante realizou aborto?')}
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_fragilidade', 'O (a) estudante possui alguma fragilidade emocional?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_drogas', 'O (a) estudante faz uso de drogas lícitas e/ou ilícitas?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_suicida', 'O (a) estudante apresentou comportamento ou fala de ideação suicida?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_autolesao', 'O (a) estudante apresenta sinais de autolesão?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_prostituicao', 'Tem indícios no (a) estudante de prostituição e/ou exploração sexual?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_maternidade', 'Há casos de maternidade ou paternidade na adolescência do (a) estudante?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_inseguranca', 'Tem indícios de que o (a) estudante esteja em situação de insegurança alimentar?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_acompanhamento', 'O aluno faz algum acompanhamento multiprofissional?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_higiene_menstrual', 'O (a) estudante possui meios para manter higiene menstrual?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_sentimentos', 'O (a) estudante esboça sentimentos de vaidade, vingança ou insatisfação?')}
                                </div>
                            </div>
                        </section>

                        <hr class="border-slate-200 dark:border-slate-700"/>

                        <section class="flex flex-col gap-4">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary font-bold text-sm">6</span>
                                <h3 class="text-xl font-semibold text-slate-900 dark:text-white">EDUCAÇÃO</h3>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                ${createYesNoQuestion('t3_repetiu', 'O (a) estudante já repetiu de ano?')}
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_faltas', 'O (a) aluno (a) possui faltas recorrentes à escola?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_abandonou', 'O (a) estudante abandonou a escola alguma vez?')}
                                </div>
                            </div>
                        </section>

                        <hr class="border-slate-200 dark:border-slate-700"/>

                        <section class="flex flex-col gap-4">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary font-bold text-sm">7</span>
                                <h3 class="text-xl font-semibold text-slate-900 dark:text-white">SÓCIO-TERRITORIAL</h3>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_transporte', 'O (a) estudante tem dificuldade de acessar transporte público?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_vuln_social', 'O (a) estudante reside em área de vulnerabilidade social (moradia precária)?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_vuln_criminal', 'Sabe informar se o (a) estudante reside em área de vulnerabilidade criminal (área violentada)?')}
                                </div>
                            </div>
                        </section>

                        <hr class="border-slate-200 dark:border-slate-700"/>

                        <section class="flex flex-col gap-4">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary font-bold text-sm">8</span>
                                <h3 class="text-xl font-semibold text-slate-900 dark:text-white">SEGURANÇA</h3>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                ${createYesNoQuestion('t3_sofreu_bullying', 'O (a) estudante sofreu bullying?')}
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_lesoes', 'O (a) estudante possui lesões resultantes de alguma violência sofrida?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_vitima_sexual', 'O (a) estudante foi vítima de violência sexual?')}
                                </div>
                                ${createYesNoQuestion('t3_praticou_bullying', 'O (a) estudante praticou Bullying?')}
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_atritos_colegas', 'O (a) estudante já teve atritos com colegas?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_atritos_prof', 'O (a) estudante já teve atritos com professores e/ou colaboradores?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_viol_virtual', 'O (a) estudante se há suspeita de que o (a) aluno tenha sofrido violência em ambiente virtual?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_usado_ilicitas', 'Há suspeita de que o (a) estudante tenha sido usado para atuar em atividades ilícitas?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_arma_fogo', 'Há suspeita de que o (a) estudante já tenha portado arma de fogo na escola?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_arma_branca', 'Há suspeita de que o (a) estudante já tenha portado arma branca na escola?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_drogas_escola', 'Há suspeita de que o (a) estudante tenha portado drogas na escola?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_liderancas', 'Há relatos de lideranças negativas no território em que o (a) aluno(a) reside?')}
                                </div>
                                <div class="col-span-1 md:col-span-2">
                                    ${createYesNoQuestion('t3_maus_tratos', 'O aluno apresenta sinais de maus tratos?')}
                                </div>
                            </div>
                        </section>
                        ` : ''}

                        <hr class="border-slate-200 dark:border-slate-700"/>
                        
                        <section class="flex flex-col gap-4 mb-8">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary font-bold text-sm">${(tipo === 'teste1' || tipo === 'teste2' || tipo === 'teste3') ? '9' : '3'}</span>
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

function createYesNoQuestion(name, label) {
    return `
        <div class="flex flex-col gap-3 p-4 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-xl">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 leading-tight">${label}</label>
            <div class="flex gap-6 mt-1">
                <label class="flex items-center gap-2 cursor-pointer group">
                    <div class="relative flex items-center justify-center">
                        <input type="radio" name="${name}" value="Sim" class="peer w-5 h-5 appearance-none border-2 border-slate-300 dark:border-slate-600 rounded-full checked:border-primary transition-all">
                        <div class="absolute w-2.5 h-2.5 bg-primary rounded-full scale-0 peer-checked:scale-100 transition-transform"></div>
                    </div>
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">Sim</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer group">
                    <div class="relative flex items-center justify-center">
                        <input type="radio" name="${name}" value="Não" class="peer w-5 h-5 appearance-none border-2 border-slate-300 dark:border-slate-600 rounded-full checked:border-primary transition-all">
                        <div class="absolute w-2.5 h-2.5 bg-primary rounded-full scale-0 peer-checked:scale-100 transition-transform"></div>
                    </div>
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">Não</span>
                </label>
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
