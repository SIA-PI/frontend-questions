// Login Page Component - Baseado no design fornecido

import { api, saveAuthData } from '../utils/api.js';
import { toast } from '../utils/toast.js';

export async function LoginPage() {
    return `
        <div class="relative flex h-screen w-full overflow-hidden">
            <!-- Left Side: Login Form -->
            <div class="flex flex-col justify-center w-full lg:w-1/2 xl:w-[40%] px-6 py-12 lg:px-20 z-10 bg-white dark:bg-[#1a2235] shadow-xl lg:shadow-none">
                <div class="w-full max-w-[480px] mx-auto flex flex-col h-full justify-between">
                    <!-- Logo -->
                    <div class="flex items-center gap-3 mb-10">
                        <div class="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
                            <span class="material-symbols-outlined text-[28px]">psychology</span>
                        </div>
                        <h2 class="text-xl font-bold tracking-tight text-[#0d121b] dark:text-white">Avalia.Ed</h2>
                    </div>
                    
                    <!-- Main Content -->
                    <div class="flex flex-col gap-8">
                        <div class="flex flex-col gap-2">
                            <h1 class="text-3xl font-bold leading-tight tracking-tight text-[#0d121b] dark:text-white">Acesse sua conta</h1>
                            <p class="text-[#4c669a] dark:text-slate-400 text-base font-normal">Sistema de Avaliação Comportamental - Avalia.Ed</p>
                        </div>
                        
                        <form id="login-form" class="flex flex-col gap-5">
                            <!-- Email Field -->
                            <div class="flex flex-col gap-2">
                                <label class="text-[#0d121b] dark:text-slate-200 text-sm font-semibold" for="email">Usuário</label>
                                <div class="relative">
                                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#4c669a] dark:text-slate-500 material-symbols-outlined text-[20px]">person</span>
                                    <input 
                                        class="w-full h-12 rounded-lg border border-[#cfd7e7] dark:border-slate-600 bg-[#f8f9fc] dark:bg-[#131b2b] pl-11 pr-4 text-[#0d121b] dark:text-white placeholder:text-[#9aa6c0] dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                                        id="email" 
                                        placeholder="Digite seu usuário" 
                                        type="text"
                                        autocomplete="username"
                                    />
                                </div>
                            </div>
                            
                            <!-- Password Field -->
                            <div class="flex flex-col gap-2">
                                <div class="flex justify-between items-center">
                                    <label class="text-[#0d121b] dark:text-slate-200 text-sm font-semibold" for="password">Senha</label>
                                    <a class="text-primary hover:text-blue-700 dark:hover:text-blue-400 text-sm font-medium transition-colors" href="#">Esqueceu a senha?</a>
                                </div>
                                <div class="relative flex items-center">
                                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#4c669a] dark:text-slate-500 material-symbols-outlined text-[20px]">lock</span>
                                    <input 
                                        class="w-full h-12 rounded-lg border border-[#cfd7e7] dark:border-slate-600 bg-[#f8f9fc] dark:bg-[#131b2b] pl-11 pr-12 text-[#0d121b] dark:text-white placeholder:text-[#9aa6c0] dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                                        id="password" 
                                        placeholder="Digite sua senha" 
                                        type="password"
                                        autocomplete="current-password"
                                    />
                                    <button class="absolute right-4 text-[#4c669a] dark:text-slate-500 hover:text-primary dark:hover:text-primary transition-colors flex items-center justify-center" type="button">
                                        <span class="material-symbols-outlined text-[20px]">visibility</span>
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Submit Button -->
                            <button class="mt-2 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary hover:bg-blue-700 active:bg-blue-800 text-white text-base font-bold leading-normal tracking-[0.015em] transition-all shadow-md shadow-blue-500/20" type="submit">
                                <span class="truncate">Entrar</span>
                            </button>
                        </form>
                        
                        <div class="mt-8 text-center">
                            <p class="text-sm text-[#4c669a] dark:text-slate-400">
                                Usuários de teste: <strong>admin/admin123</strong> ou <strong>avaliador1/aval123</strong>
                            </p>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div class="mt-8 text-center">
                        <p class="text-xs text-[#4c669a] dark:text-slate-400">
                            © 2026 Secretaria de Segurança Pública
                        </p>
                    </div>
                </div>
            </div>
            
            <!-- Right Side: Illustration / Visuals -->
            <div class="hidden lg:flex w-1/2 xl:w-[60%] bg-cover bg-center relative items-center justify-center p-12" style="background: linear-gradient(135deg, #135bec 0%, #0e4bca 100%);">
                <!-- Dark Overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                
                <!-- Floating Content -->
                <div class="relative z-10 max-w-lg text-white">
                    <div class="mb-8 inline-flex items-center justify-center size-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30">
                        <span class="material-symbols-outlined text-[32px] text-white">analytics</span>
                    </div>
                    <h2 class="text-4xl xl:text-5xl font-bold leading-tight mb-6">
                        Sistema Integrado de Avaliação
                    </h2>
                    <p class="text-lg xl:text-xl text-blue-100 font-light leading-relaxed mb-8">
                        Gerencie avaliações comportamentais com eficiência e transparência. Dados em tempo real para decisões estratégicas.
                    </p>
                    
                    <!-- Stats/Feature Cards -->
                    <div class="flex gap-4">
                        <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex-1">
                            <div class="text-2xl font-bold mb-1">500+</div>
                            <div class="text-sm text-blue-100">Alunos Avaliados</div>
                        </div>
                        <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex-1">
                            <div class="text-2xl font-bold mb-1">95%</div>
                            <div class="text-sm text-blue-100">Taxa de Conclusão</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Material Symbols -->
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
    `;
}

// Initialize login form after component is mounted
window.addEventListener('route-changed', (e) => {
    if (e.detail.route === '/login' || e.detail.route === '/') {
        initLoginForm();
    }
});

function initLoginForm() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        console.log('🔐 Tentando fazer login...', { username });

        try {
            const response = await api.login(username, password);

            console.log('📥 Resposta do servidor:', response);

            if (response.success) {
                console.log('✅ Login bem-sucedido, salvando dados...', response.user);
                saveAuthData(response.token, response.user);

                // Verificar se foi salvo
                const savedUser = localStorage.getItem('currentUser');
                console.log('💾 Dados salvos no localStorage:', savedUser);

                toast.success('Login realizado com sucesso!');

                setTimeout(() => {
                    console.log('🚀 Navegando para dashboard...');
                    window.router.navigate('/dashboard');
                }, 500);
            } else {
                toast.error(response.message || 'Erro ao fazer login');
            }
        } catch (error) {
            toast.error('Erro ao conectar com o servidor');
            console.error('❌ Login error:', error);
        }
    });
}
