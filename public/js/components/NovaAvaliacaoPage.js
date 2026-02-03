// Nova Avaliação Page – Questionário sequencial, respostas Sim (1) / Não (0)

import { getCurrentUser, api } from '../utils/api.js';
import { Sidebar, setupLogoutButton } from './Sidebar.js';
import { toast } from '../utils/toast.js';

const STATUS_LABEL = {
    nao_iniciado: 'Não Iniciada',
    em_andamento: 'Em Andamento',
    concluido: 'Concluída',
    finalizado: 'Finalizada',
};

export async function NovaAvaliacaoPage() {
    const user = getCurrentUser();
    if (!user) {
        window.router.navigate('/login');
        return '<div></div>';
    }

    const hash = window.location.hash || '';
    const urlParams = new URLSearchParams(hash.split('?')[1] || '');
    const alunoId = urlParams.get('aluno');

    let aluno = null;
    let resultado = null;
    let questionario = null;
    let questoes = [];
    let respostasExistentes = [];
    let loading = true;
    let error = null;

    const alunoIdNorm = alunoId ? String(alunoId).trim() : '';
    if (alunoIdNorm) {
        try {
            aluno = await api.getAluno(alunoIdNorm);
            aluno._classeNome =
                aluno.classe && (typeof aluno.classe === 'object' ? aluno.classe.nome : aluno.classe);
            aluno._idShort = String(aluno.id).slice(0, 8);

            // Sempre buscar resultado DESTE aluno via endpoint por-aluno (evita confusão entre alunos)
            resultado = await api.getAssessmentByAluno(alunoIdNorm);
            if (!resultado) {
                try {
                    resultado = await api.createAssessment({ aluno_id: alunoIdNorm });
                } catch (createErr) {
                    // Já existe (ex.: criado por outra aba) — buscar de novo
                    resultado = await api.getAssessmentByAluno(alunoIdNorm);
                    if (!resultado) throw createErr;
                }
            }

            // Garantir que o resultado é do aluno da URL
            const resultadoAlunoId = resultado.aluno && (typeof resultado.aluno === 'object' ? resultado.aluno.id : resultado.aluno);
            if (String(resultadoAlunoId || '').trim() !== alunoIdNorm) {
                error = 'Avaliação não corresponde ao aluno selecionado. Recarregue a página.';
                loading = false;
            } else {
                const questionarioId =
                    resultado.questionario &&
                    (typeof resultado.questionario === 'object' ? resultado.questionario.id : resultado.questionario);
                if (questionarioId) {
                    questionario = await api.getQuestionario(questionarioId);
                    questoes = await api.getQuestoes(questionarioId);
                }
                if (resultado.id) {
                    const respostas = await api.getRespostas({ resultado: resultado.id });
                    respostasExistentes = Array.isArray(respostas) ? respostas : [];
                }
                loading = false;
            }
        } catch (err) {
            error = err.message || 'Erro ao carregar';
            loading = false;
        }
    } else {
        error = 'Selecione um aluno na página de avaliações.';
        loading = false;
    }

    const podeEditar = resultado && resultado.status !== 'finalizado';
    const isAdmin = user && user.role === 'admin';
    const respostasMap = {};
    respostasExistentes.forEach((r) => {
        const qId = r.question && (typeof r.question === 'object' ? r.question.id : r.question);
        if (qId) respostasMap[qId] = r.valor;
    });

    if (error) {
        return `
<div class="flex h-screen w-full flex-row">
    ${Sidebar(user, 'avaliacoes')}
    <main class="flex-1 flex flex-col h-full overflow-y-auto scrollbar-hide bg-white dark:bg-background-dark p-8">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-red-700 dark:text-red-300">${error}</div>
        <a href="#/avaliacoes/selecionar-aluno" class="mt-4 text-primary font-medium hover:underline">Voltar para seleção de aluno</a>
    </main>
</div>`;
    }

    if (loading || !aluno || !resultado) {
        return `
<div class="flex h-screen w-full flex-row">
    ${Sidebar(user, 'avaliacoes')}
    <main class="flex-1 flex flex-col h-full overflow-y-auto scrollbar-hide bg-white dark:bg-background-dark items-center justify-center p-8">
        <div class="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
        <p class="mt-4 text-slate-600 dark:text-slate-400">Carregando questionário...</p>
    </main>
</div>`;
    }

    const totalQuestoes = questoes.length;
    const respondidas = Object.keys(respostasMap).length;
    const progresso = totalQuestoes ? Math.round((respondidas / totalQuestoes) * 100) : 0;
    const podeFinalizar = isAdmin && podeEditar && totalQuestoes > 0 && respondidas === totalQuestoes;
    const questionarioNome = questionario && (questionario.nome || questionario.id)
        ? questionario.nome || 'Questionário'
        : 'Questionário';

    const tamanhoBloco = 10;
    const totalPartes = totalQuestoes ? Math.ceil(totalQuestoes / tamanhoBloco) : 0;
    const blocosHtml = totalQuestoes === 0
        ? '<div class="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-6 text-amber-800 dark:text-amber-200"><p>Nenhuma questão cadastrada neste questionário.</p></div>'
        : buildBlocosHtml(questoes, totalQuestoes, respostasMap, tamanhoBloco);

    window.__NOVA_AVALIACAO_RESULTADO_ID__ = resultado.id;
    window.__NOVA_AVALIACAO_ALUNO_ID__ = alunoIdNorm;
    window.__NOVA_AVALIACAO_TOTAL_QUESTOES__ = totalQuestoes;
    window.__NOVA_AVALIACAO_TOTAL_PARTES__ = totalPartes;
    window.__NOVA_AVALIACAO_PARTE_ATUAL__ = 1;

    const navPartesHtml = totalPartes > 0 ? `
<div class="flex items-center justify-between gap-4 py-4 border-b border-slate-200 dark:border-slate-700">
    <span class="text-sm font-medium text-slate-600 dark:text-slate-400">Parte <span id="parte-atual-num">1</span> de ${totalPartes}</span>
    <div class="flex gap-2">
        <button type="button" id="btn-parte-anterior" class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" ${totalPartes <= 1 ? 'disabled' : ''}>
            <span class="material-symbols-outlined align-middle text-[18px] mr-1">chevron_left</span> Anterior
        </button>
        <button type="button" id="btn-parte-proxima" class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" ${totalPartes <= 1 ? 'disabled' : ''}>
            Próxima <span class="material-symbols-outlined align-middle text-[18px] ml-1">chevron_right</span>
        </button>
    </div>
</div>` : '';

    const btnFinalizarAttrs = podeFinalizar
        ? 'bg-primary text-white hover:bg-blue-600'
        : 'bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed';
    const btnFinalizarTitle = podeFinalizar ? 'Finalizar avaliação' : 'Responda todas as questões para finalizar';
    const btnFinalizarDisabled = podeFinalizar ? '' : 'disabled';

    const footerHtml = podeEditar && totalQuestoes > 0
        ? `<div class="sticky bottom-0 py-4 bg-white dark:bg-background-dark border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
    <button type="button" id="btn-salvar-footer" class="px-5 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Salvar rascunho</button>
    ${isAdmin ? `<button type="button" id="btn-finalizar-footer" class="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm ${btnFinalizarAttrs}" title="${btnFinalizarTitle}" ${btnFinalizarDisabled}>Finalizar avaliação</button>` : ''}
</div>`
        : '';

    return `
<div class="flex h-screen w-full flex-row">
    ${Sidebar(user, 'avaliacoes')}
    <main class="flex-1 flex flex-col h-full overflow-y-auto scrollbar-hide bg-white dark:bg-background-dark">
        <div class="w-full max-w-[900px] mx-auto p-6 md:p-10 flex flex-col gap-6">
            <div class="flex flex-col gap-4 border-b border-slate-200 dark:border-slate-700 pb-6">
                <div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <a href="#/avaliacoes" class="hover:text-primary transition-colors">Avaliações</a>
                    <span class="material-symbols-outlined text-[14px]">chevron_right</span>
                    <span>Nova Avaliação</span>
                </div>
                <div class="flex flex-wrap items-center justify-between gap-4">
                    <div class="flex items-center gap-4">
                        <div class="h-14 w-14 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                            <span class="text-lg font-bold text-slate-600 dark:text-slate-300">${(aluno.nome || '?').split(' ').map((n) => n[0]).join('').slice(0, 2)}</span>
                        </div>
                        <div>
                            <h1 class="text-xl font-bold text-slate-900 dark:text-white">${aluno.nome || '—'}</h1>
                            <p class="text-sm text-slate-500 dark:text-slate-400">${questionarioNome} · ${aluno._classeNome || '—'} · ${aluno.faixa_etaria || '—'}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="px-3 py-1 rounded-full text-xs font-semibold ${resultado.status === 'finalizado' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'}">${STATUS_LABEL[resultado.status] || resultado.status}</span>
                        ${podeEditar ? '<button type="button" id="btn-salvar-rascunho" class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Salvar</button>' : ''}
                        ${podeEditar && isAdmin ? `<button type="button" id="btn-finalizar" class="px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm ${btnFinalizarAttrs}" title="${btnFinalizarTitle}" ${btnFinalizarDisabled}>Finalizar</button>` : ''}
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <div class="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div id="progress-bar-fill" class="h-full bg-primary rounded-full transition-all duration-300" style="width: ${progresso}%"></div>
                    </div>
                    <span id="progress-bar-count" class="text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">${respondidas}/${totalQuestoes}</span>
                </div>
            </div>
            ${navPartesHtml}
            <form id="form-avaliacao" class="flex flex-col gap-4">
                ${blocosHtml}
            </form>
            ${footerHtml}
        </div>
    </main>
</div>`;
}

function buildQuestaoHtml(q, idx, totalQuestoes, respostasMap) {
    const valorAtual = respostasMap[q.id];
    const valor = valorAtual === 0 || valorAtual === 1 ? valorAtual : null;
    const simClass = valor === 1 ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-green-400 hover:bg-green-50/50 dark:hover:bg-green-900/20';
    const naoClass = valor === 0 ? 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300' : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20';
    return `
<div class="questao-row flex items-center gap-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 py-3 px-4" data-question-id="${q.id}">
    <div class="flex-1 min-w-0">
        <p class="text-xs font-medium text-slate-500 dark:text-slate-400">Questão ${idx} de ${totalQuestoes}</p>
        <p class="text-slate-900 dark:text-white font-medium">${(q.enunciado || '—').replace(/</g, '&lt;')}</p>
    </div>
    <div class="flex gap-2 shrink-0">
        <button type="button" class="questao-btn-sim py-2 px-3 rounded-lg border-2 text-sm font-semibold transition-all ${simClass}" data-question-id="${q.id}" data-valor="1">
            <span class="material-symbols-outlined align-middle mr-1 text-[16px]">check_circle</span> Sim
        </button>
        <button type="button" class="questao-btn-nao py-2 px-3 rounded-lg border-2 text-sm font-semibold transition-all ${naoClass}" data-question-id="${q.id}" data-valor="0">
            <span class="material-symbols-outlined align-middle mr-1 text-[16px]">cancel</span> Não
        </button>
    </div>
    <input type="hidden" name="resposta_${q.id}" value="${valor !== null ? valor : ''}" data-question-id="${q.id}"/>
</div>`;
}

function buildBlocosHtml(questoes, totalQuestoes, respostasMap, tamanhoBloco) {
    const parts = [];
    for (let i = 0; i < questoes.length; i += tamanhoBloco) {
        const bloco = questoes.slice(i, i + tamanhoBloco);
        const bi = Math.floor(i / tamanhoBloco) + 1;
        const blocQuestions = bloco
            .map((q, qi) => buildQuestaoHtml(q, i + qi + 1, totalQuestoes, respostasMap))
            .join('');
        const isFirst = bi === 1;
        parts.push(
            `<section class="parte-bloco flex flex-col gap-3" data-bloco="${bi}" data-part-num="${bi}" style="display: ${isFirst ? 'flex' : 'none'};">
    <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Parte ${bi}</h2>
    <div class="flex flex-col gap-2">${blocQuestions}</div>
</section>`
        );
    }
    return parts.join('');
}

function getRespostasFromForm() {
    const inputs = document.querySelectorAll('#form-avaliacao [data-question-id] input[type="hidden"]');
    const respostas = [];
    inputs.forEach((input) => {
        const questionId = input.dataset.questionId;
        const valor = input.value;
        if (questionId && (valor === '0' || valor === '1')) {
            respostas.push({ question: questionId, valor: parseInt(valor, 10) });
        }
    });
    return respostas;
}

function updateProgressBar() {
    const total = window.__NOVA_AVALIACAO_TOTAL_QUESTOES__;
    if (total == null || total === 0) return;
    const respostas = getRespostasFromForm();
    const respondidas = respostas.length;
    const progresso = Math.round((respondidas / total) * 100);
    const fillEl = document.getElementById('progress-bar-fill');
    const countEl = document.getElementById('progress-bar-count');
    if (fillEl) fillEl.style.width = `${progresso}%`;
    if (countEl) countEl.textContent = `${respondidas}/${total}`;
    const podeFinalizar = respondidas === total && total > 0;
    [document.getElementById('btn-finalizar'), document.getElementById('btn-finalizar-footer')].forEach((btn) => {
        if (!btn) return;
        btn.disabled = !podeFinalizar;
        btn.classList.toggle('bg-primary', podeFinalizar);
        btn.classList.toggle('text-white', podeFinalizar);
        btn.classList.toggle('hover:bg-blue-600', podeFinalizar);
        btn.classList.toggle('bg-slate-200', !podeFinalizar);
        btn.classList.toggle('dark:bg-slate-600', !podeFinalizar);
        btn.classList.toggle('text-slate-500', !podeFinalizar);
        btn.classList.toggle('dark:text-slate-400', !podeFinalizar);
        btn.classList.toggle('cursor-not-allowed', !podeFinalizar);
        btn.title = podeFinalizar ? 'Finalizar avaliação' : 'Responda todas as questões para finalizar';
    });
}

function getCurrentAlunoIdFromUrl() {
    const hash = window.location.hash || '';
    const urlParams = new URLSearchParams(hash.split('?')[1] || '');
    return String(urlParams.get('aluno') || '').trim();
}

async function salvarRascunho(resultadoId) {
    const urlAlunoId = getCurrentAlunoIdFromUrl();
    const pageAlunoId = window.__NOVA_AVALIACAO_ALUNO_ID__;
    if (urlAlunoId && pageAlunoId && urlAlunoId !== pageAlunoId) {
        toast.error('Aluno da página não confere com a URL. Recarregue e tente novamente.');
        return;
    }
    const respostas = getRespostasFromForm();
    if (respostas.length === 0) {
        toast.info('Nenhuma resposta para salvar.');
        return;
    }
    await api.salvarRespostas(resultadoId, respostas);
    toast.success('Respostas salvas.');
}

async function finalizarAvaliacao(resultadoId) {
    const urlAlunoId = getCurrentAlunoIdFromUrl();
    const pageAlunoId = window.__NOVA_AVALIACAO_ALUNO_ID__;
    if (urlAlunoId && pageAlunoId && urlAlunoId !== pageAlunoId) {
        toast.error('Aluno da página não confere com a URL. Recarregue e tente novamente.');
        return;
    }
    const respostas = getRespostasFromForm();
    await api.salvarRespostas(resultadoId, respostas);
    await api.finalizarAvaliacao(resultadoId);
    toast.success('Avaliação finalizada.');
    window.router.navigate('/avaliacoes');
}

window.addEventListener('route-changed', (e) => {
    if (e.detail.route === '/avaliacoes/nova') {
        setupLogoutButton();
        setTimeout(setupNovaAvaliacaoHandlers, 100);
    }
});

function showParte(parteNum) {
    const totalPartes = window.__NOVA_AVALIACAO_TOTAL_PARTES__ || 0;
    if (parteNum < 1 || parteNum > totalPartes) return;
    window.__NOVA_AVALIACAO_PARTE_ATUAL__ = parteNum;

    document.querySelectorAll('.parte-bloco').forEach((section) => {
        const num = parseInt(section.dataset.partNum, 10);
        section.style.display = num === parteNum ? 'flex' : 'none';
    });

    const numEl = document.getElementById('parte-atual-num');
    if (numEl) numEl.textContent = String(parteNum);

    const btnAnterior = document.getElementById('btn-parte-anterior');
    const btnProxima = document.getElementById('btn-parte-proxima');
    if (btnAnterior) {
        btnAnterior.disabled = parteNum <= 1;
    }
    if (btnProxima) {
        btnProxima.disabled = parteNum >= totalPartes;
    }
}

function setupNovaAvaliacaoHandlers() {
    const resultadoIdFinal = window.__NOVA_AVALIACAO_RESULTADO_ID__;
    const form = document.getElementById('form-avaliacao');

    // Delegação: Sim/Não no form (funciona para todas as partes visíveis ou não)
    if (form) {
        form.addEventListener('click', (e) => {
            const btn = e.target.closest('.questao-btn-sim, .questao-btn-nao');
            if (!btn) return;
            e.preventDefault();
            const questionId = btn.dataset.questionId;
            const valor = parseInt(btn.dataset.valor, 10);
            const card = btn.closest('.questao-row');
            if (!card) return;
            const hidden = card.querySelector('input[type="hidden"][data-question-id="' + questionId + '"]');
            if (hidden) hidden.value = String(valor);

            const simBtn = card.querySelector('.questao-btn-sim');
            const naoBtn = card.querySelector('.questao-btn-nao');
            if (simBtn) {
                simBtn.classList.remove('border-green-500', 'bg-green-50', 'dark:bg-green-900/30', 'text-green-800', 'dark:text-green-300');
                simBtn.classList.add('border-slate-200', 'dark:border-slate-600', 'text-slate-600', 'dark:text-slate-400');
                if (valor === 1) {
                    simBtn.classList.add('border-green-500', 'bg-green-50', 'dark:bg-green-900/30', 'text-green-800', 'dark:text-green-300');
                    simBtn.classList.remove('border-slate-200', 'dark:border-slate-600');
                }
            }
            if (naoBtn) {
                naoBtn.classList.remove('border-red-500', 'bg-red-50', 'dark:bg-red-900/30', 'text-red-800', 'dark:text-red-300');
                naoBtn.classList.add('border-slate-200', 'dark:border-slate-600', 'text-slate-600', 'dark:text-slate-400');
                if (valor === 0) {
                    naoBtn.classList.add('border-red-500', 'bg-red-50', 'dark:bg-red-900/30', 'text-red-800', 'dark:text-red-300');
                    naoBtn.classList.remove('border-slate-200', 'dark:border-slate-600');
                }
            }
            updateProgressBar();
        });
    }

    // Navegação Anterior / Próxima
    const btnAnterior = document.getElementById('btn-parte-anterior');
    const btnProxima = document.getElementById('btn-parte-proxima');
    if (btnAnterior) {
        btnAnterior.addEventListener('click', () => {
            const atual = window.__NOVA_AVALIACAO_PARTE_ATUAL__ || 1;
            showParte(Math.max(1, atual - 1));
        });
    }
    if (btnProxima) {
        btnProxima.addEventListener('click', () => {
            const atual = window.__NOVA_AVALIACAO_PARTE_ATUAL__ || 1;
            const total = window.__NOVA_AVALIACAO_TOTAL_PARTES__ || 1;
            showParte(Math.min(total, atual + 1));
        });
    }

    const salvarBtns = ['btn-salvar-rascunho', 'btn-salvar-footer'];
    const finalizarBtns = ['btn-finalizar', 'btn-finalizar-footer'];

    salvarBtns.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('click', async () => {
                if (!resultadoIdFinal) {
                    toast.error('ID do resultado não encontrado.');
                    return;
                }
                try {
                    await salvarRascunho(resultadoIdFinal);
                } catch (err) {
                    toast.error(err.message || 'Erro ao salvar.');
                }
            });
        }
    });

    finalizarBtns.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('click', async () => {
                if (!resultadoIdFinal) {
                    toast.error('ID do resultado não encontrado.');
                    return;
                }
                try {
                    await finalizarAvaliacao(resultadoIdFinal);
                } catch (err) {
                    toast.error(err.message || 'Erro ao finalizar.');
                }
            });
        }
    });

    // Garantir estado inicial da parte e barra
    showParte(window.__NOVA_AVALIACAO_PARTE_ATUAL__ || 1);
    updateProgressBar();
}
