// Modal Novo Avaliador - Funções

export function setupNovoAvaliadorModal() {
    const novoAvaliadorBtn = document.getElementById('novo-avaliador-btn');
    const modal = document.getElementById('modal-novo-avaliador');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const form = document.getElementById('form-novo-avaliador');

    if (!novoAvaliadorBtn || !modal) return;

    // Abrir modal
    novoAvaliadorBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    });

    // Fechar modal
    const closeModal = () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
        form?.reset();
    };

    closeModalBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);

    // Fechar ao clicar fora
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // Submit do formulário
    form?.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Validar senhas
        if (data.senha !== data.confirmarSenha) {
            alert('❌ As senhas não coincidem!');
            return;
        }

        if (data.senha.length < 8) {
            alert('❌ A senha deve ter no mínimo 8 caracteres!');
            return;
        }

        console.log('✅ Dados do novo avaliador:', data);

        // Simular sucesso
        alert(`✅ Avaliador cadastrado com sucesso!\n\nNome: ${data.nome}\nEmail: ${data.email}\nCidade: ${data.cidade}\nEscola: ${data.escola}\nNível: ${data.role === 'admin' ? 'Administrador' : 'Avaliador'}`);

        closeModal();

        // Aqui você faria a chamada para a API
        // await api.post('/avaliadores', data);
    });
}
