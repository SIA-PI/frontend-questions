// Dashboard Page - Exatamente como evaluator_dashboard_1

import { getCurrentUser } from '../utils/api.js';
import { Sidebar, setupLogoutButton } from './Sidebar.js';

export async function DashboardPage() {
    console.log('📊 Carregando Dashboard...');

    const user = getCurrentUser();
    console.log('👤 Usuário atual:', user);

    // Validação: se não houver usuário, redirecionar para login
    if (!user) {
        console.warn('⚠️ Nenhum usuário encontrado, redirecionando para login...');
        window.router.navigate('/login');
        return '<div></div>';
    }

    console.log('✅ Usuário autenticado:', user.name);

    return `
        <div class="flex h-screen w-full flex-row">
            ${Sidebar(user, 'dashboard')}
            
            <main class="flex-1 flex flex-col h-full overflow-y-auto scrollbar-hide bg-white dark:bg-background-dark">
                <div class="w-full max-w-[1200px] mx-auto p-8 md:p-12 flex flex-col gap-10">
                    <div class="flex flex-col gap-4">
                        <h1 class="text-[#0d121b] dark:text-white tracking-tight text-[32px] md:text-4xl font-bold leading-tight">
                            Olá, Avaliador ${user.name.split(' ')[0]}
                        </h1>
                        <div class="flex gap-3 flex-wrap">
                            <div class="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-slate-100 dark:bg-slate-800 px-4 border border-slate-200 dark:border-slate-700">
                                <span class="material-symbols-outlined text-primary text-[20px]">location_on</span>
                                <p class="text-slate-700 dark:text-slate-300 text-sm font-medium">São Paulo - SP</p>
                            </div>
                            <div class="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-slate-100 dark:bg-slate-800 px-4 border border-slate-200 dark:border-slate-700">
                                <span class="material-symbols-outlined text-primary text-[20px]">school</span>
                                <p class="text-slate-700 dark:text-slate-300 text-sm font-medium">Unidade Central</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                            <div class="flex items-center justify-between">
                                <div class="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300">
                                    <span class="material-symbols-outlined text-[28px]">person_off</span>
                                </div>
                                <span class="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold">-5%</span>
                            </div>
                            <div>
                                <p class="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Alunos Faltantes</p>
                                <p class="text-slate-900 dark:text-white text-3xl font-bold">12</p>
                            </div>
                        </div>
                        
                        <div class="flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                            <div class="flex items-center justify-between">
                                <div class="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-primary">
                                    <span class="material-symbols-outlined text-[28px]">check_circle</span>
                                </div>
                                <span class="px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold">+12%</span>
                            </div>
                            <div>
                                <p class="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Alunos Feitos</p>
                                <p class="text-slate-900 dark:text-white text-3xl font-bold">45</p>
                            </div>
                        </div>
                        
                        <div class="flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-slate-800 border border-red-100 dark:border-red-900/50 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                            <div class="absolute right-0 top-0 h-full w-1 bg-red-500"></div>
                            <div class="flex items-center justify-between">
                                <div class="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
                                    <span class="material-symbols-outlined text-[28px]">priority_high</span>
                                </div>
                                <span class="px-2 py-1 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold">Atenção</span>
                            </div>
                            <div>
                                <p class="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Pendências Críticas</p>
                                <p class="text-slate-900 dark:text-white text-3xl font-bold">3</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex flex-col gap-6">
                        <div class="flex items-center justify-between">
                            <h2 class="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-tight">Progresso Comportamental</h2>
                            <button class="text-primary text-sm font-semibold hover:underline">Ver Todos</button>
                        </div>
                        
                        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                            <div class="overflow-x-auto">
                                <table class="w-full text-left border-collapse">
                                    <thead>
                                        <tr class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                            <th class="py-4 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Aluno</th>
                                            <th class="py-4 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Turma</th>
                                            <th class="py-4 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider w-1/3">Perfil Comportamental</th>
                                            <th class="py-4 px-6 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                            <td class="py-4 px-6">
                                                <div class="flex items-center gap-3">
                                                    <div class="h-10 w-10 rounded-full bg-cover bg-center" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAmYFcFKBvqSd0El0UOjQP_tWdls61SFBSED-g6ldBgHMOdIuMBvZTDI2P4vKrl5sRYT5y2WwwhvUtY2Yv8Tt5CgHRl6UFQYVDgyQhyWDeN2T0k7fuKZInEROXpnnzCOTl0UlU-ma-LPs57w6dGz49x_oBQg0dXgNCwM6rVeF1yVfe4xtmbJbeLeAtGnJvFymteLCi-5CEvqhmGLq1G0a5FsB0Nev7oJXrZaT3gXAZUr3DiVE0QzJ3tTgQRIf3TMahaO_RbdYKgIByH");'></div>
                                                    <div class="flex flex-col">
                                                        <span class="text-sm font-semibold text-slate-900 dark:text-white">Ana Souza</span>
                                                        <span class="text-xs text-slate-500">ID: #8832</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">3º Ano B</td>
                                            <td class="py-4 px-6">
                                                <div class="flex flex-col gap-1">
                                                    <div class="flex justify-between text-xs mb-1">
                                                        <span class="text-slate-600 dark:text-slate-400">Analítico</span>
                                                        <span class="font-bold text-primary">85%</span>
                                                    </div>
                                                    <div class="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                                                        <div class="h-full bg-primary rounded-full" style="width: 85%"></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="py-4 px-6 text-right">
                                                <span class="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-400">
                                                    <span class="material-symbols-outlined text-[14px]">check</span>
                                                    Concluído
                                                </span>
                                            </td>
                                        </tr>
                                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                            <td class="py-4 px-6">
                                                <div class="flex items-center gap-3">
                                                    <div class="h-10 w-10 rounded-full bg-cover bg-center" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuB-ydJY2jCy1XDxzBWvS_zMlMnRx2CWoH0lAPE98mrBLElGDZ9BthvXFhk9AL3P3fWTdk8ITFzncz4E90CMT9Yae5K69DnwA5Xp2W6Gd_dGl_uBN7y0PhDobXAjs-TB1xZgpn5fv1vEjVp9-sqbz9o0iJHfiW79ElZqMxCkTQs83mI1lgSw5hlAkCenQMxhCwdczUXKZOBHVE5w0h0n24HgaJa06Ia-W8pKF7Ct7f4ANSbh0Ncof6bOHsvFJH6Ic8GYNuc4Ibyg_GAg");'></div>
                                                    <div class="flex flex-col">
                                                        <span class="text-sm font-semibold text-slate-900 dark:text-white">Carlos Lima</span>
                                                        <span class="text-xs text-slate-500">ID: #9941</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">2º Ano A</td>
                                            <td class="py-4 px-6">
                                                <div class="flex flex-col gap-1">
                                                    <div class="flex justify-between text-xs mb-1">
                                                        <span class="text-slate-600 dark:text-slate-400">Comunicador</span>
                                                        <span class="font-bold text-blue-400">45%</span>
                                                    </div>
                                                    <div class="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                                                        <div class="h-full bg-blue-400 rounded-full" style="width: 45%"></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="py-4 px-6 text-right">
                                                <span class="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-300">
                                                    <span class="material-symbols-outlined text-[14px]">timelapse</span>
                                                    Em Andamento
                                                </span>
                                            </td>
                                        </tr>
                                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                            <td class="py-4 px-6">
                                                <div class="flex items-center gap-3">
                                                    <div class="h-10 w-10 rounded-full bg-cover bg-center" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBdsNQH9TfjN9bs_ZtIYZoJ5tv48cbdTseguajoKqYHCf5zAWMvpjmSqaXCcTtMYxWZ0zfzfPLDsWvDjY7JNBzCuI57T607XRJSJWeFvJDUx8ynt7hHM-YigqFhZVwJcJIC5fN70rmt9Z6XmIIIEMALyYyacOLu9KlNGEFxy7h6ZIyVD6IHBwQelHYQDioSF6kLKjHIs1LBjX9SyibYNpcl9EUjeGl_neTHjJdvw4mqvStQZ2bVQI-zzH-BHemcI3gv-949LkGDccH2");'></div>
                                                    <div class="flex flex-col">
                                                        <span class="text-sm font-semibold text-slate-900 dark:text-white">Julia Martins</span>
                                                        <span class="text-xs text-slate-500">ID: #1209</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">3º Ano B</td>
                                            <td class="py-4 px-6">
                                                <div class="flex flex-col gap-1">
                                                    <div class="flex justify-between text-xs mb-1">
                                                        <span class="text-slate-600 dark:text-slate-400">Executor</span>
                                                        <span class="font-bold text-orange-400">12%</span>
                                                    </div>
                                                    <div class="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                                                        <div class="h-full bg-orange-400 rounded-full" style="width: 12%"></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="py-4 px-6 text-right">
                                                <span class="inline-flex items-center gap-1 rounded-full bg-orange-100 dark:bg-orange-900/30 px-2.5 py-0.5 text-xs font-medium text-orange-800 dark:text-orange-400">
                                                    <span class="material-symbols-outlined text-[14px]">pending</span>
                                                    Pendente
                                                </span>
                                            </td>
                                        </tr>
                                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                            <td class="py-4 px-6">
                                                <div class="flex items-center gap-3">
                                                    <div class="h-10 w-10 rounded-full bg-cover bg-center" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAYYbPDC_hrIppUsLBS7mAxwdqTnF0DhhINr2U2qL8ceB4W-JyGJSLqGuq8yR9paNAPpziTyPx8QyP72KplbLJ_KwWWeK_YZZ1AG0hGIo_P4K51mnBCKKoALjEYbcNNN0OybdqjfZaMzzQD0kzPN_tY5vDe6cjLg2DOJO_ocbv_VDqt7tK8ktpnOJETqsKz7FN4IuK9x62ukLcX0pv9_0gCx2mzRG1J2SY4ynTTK66foCXcFgp4C5EPi9Vhzzl5UJBj3ln4JyVz2jvP");'></div>
                                                    <div class="flex flex-col">
                                                        <span class="text-sm font-semibold text-slate-900 dark:text-white">Marcos Dias</span>
                                                        <span class="text-xs text-slate-500">ID: #5632</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">1º Ano C</td>
                                            <td class="py-4 px-6">
                                                <div class="flex flex-col gap-1">
                                                    <div class="flex justify-between text-xs mb-1">
                                                        <span class="text-slate-600 dark:text-slate-400">Planejador</span>
                                                        <span class="font-bold text-red-500">0%</span>
                                                    </div>
                                                    <div class="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                                                        <div class="h-full bg-red-500 rounded-full" style="width: 2%"></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="py-4 px-6 text-right">
                                                <span class="inline-flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-900/30 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:text-red-400">
                                                    <span class="material-symbols-outlined text-[14px]">error</span>
                                                    Crítico
                                                </span>
                                            </td>
                                        </tr>
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

// Initialize dashboard after component is mounted
window.addEventListener('route-changed', (e) => {
    if (e.detail.route === '/dashboard') {
        setupLogoutButton();
    }
});
