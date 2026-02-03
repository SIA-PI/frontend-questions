// Shared Sidebar Component - Sistema de Avaliação Escolar (Retrátil e Responsivo)

export function Sidebar(user, activePage = 'dashboard') {
    return `
        <!-- Mobile Menu Button -->
        <button id="mobile-menu-btn" class="fixed top-4 left-4 z-50 lg:hidden h-12 w-12 bg-primary hover:bg-blue-600 rounded-lg shadow-lg flex items-center justify-center text-white transition-all">
            <span class="material-symbols-outlined text-[24px]">menu</span>
        </button>
        
        <!-- Overlay for mobile -->
        <div id="sidebar-overlay" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 hidden lg:hidden transition-opacity"></div>
        
        <!-- Sidebar -->
        <aside id="sidebar" class="fixed lg:relative lg:flex w-72 bg-primary flex-col justify-between shrink-0 shadow-xl z-40 h-full border-r border-white/10 transition-all duration-300 -translate-x-full lg:translate-x-0">
            <div class="absolute inset-y-0 right-0 w-px shadow-[0_0_20px_rgba(0,0,0,0.1)]"></div>
            
            <!-- Close Button (Mobile Only) -->
            <button id="mobile-close-btn" class="absolute right-4 top-4 lg:hidden h-10 w-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-all">
                <span class="material-symbols-outlined text-[24px]">close</span>
            </button>
            
            <!-- Toggle Button (Desktop Only) - Visível -->
            <button id="sidebar-toggle" class="absolute -right-3.5 top-6 h-7 w-7 bg-white dark:bg-slate-800 border-2 border-primary hover:bg-primary hover:border-primary rounded-full shadow-lg flex max-lg:hidden items-center justify-center text-primary hover:text-white transition-all duration-300 z-50 group">
                <span class="material-symbols-outlined text-[18px] sidebar-toggle-icon">chevron_left</span>
            </button>
            
            <div class="flex flex-col p-6 gap-8 overflow-y-auto">
                <div class="flex items-center gap-3 px-2 mt-8 lg:mt-0">
                    <div class="bg-white/20 p-2 rounded-lg flex-shrink-0">
                        <span class="material-symbols-outlined text-white">psychology</span>
                    </div>
                    <span class="sidebar-text text-white text-xl font-bold tracking-tight whitespace-nowrap overflow-hidden transition-all duration-300">Avalia.Ed</span>
                </div>
                <nav class="flex flex-col gap-2">
                    <a class="flex items-center gap-3 px-4 py-3 rounded-lg ${activePage === 'dashboard' ? 'bg-white/15 text-white shadow-sm ring-1 ring-white/10' : 'text-white/80 hover:bg-white/10 hover:text-white'} transition-all duration-200" href="#/dashboard">
                        <span class="material-symbols-outlined text-[24px] flex-shrink-0">dashboard</span>
                        <span class="sidebar-text text-sm ${activePage === 'dashboard' ? 'font-semibold' : 'font-medium'} whitespace-nowrap overflow-hidden transition-all duration-300">Dashboard</span>
                    </a>
                    <a class="flex items-center gap-3 px-4 py-3 rounded-lg ${activePage === 'alunos' ? 'bg-white/15 text-white shadow-sm ring-1 ring-white/10' : 'text-white/80 hover:bg-white/10 hover:text-white'} transition-all duration-200" href="#/alunos">
                        <span class="material-symbols-outlined text-[24px] flex-shrink-0">groups</span>
                        <span class="sidebar-text text-sm ${activePage === 'alunos' ? 'font-semibold' : 'font-medium'} whitespace-nowrap overflow-hidden transition-all duration-300">Alunos</span>
                    </a>
                    <a class="flex items-center gap-3 px-4 py-3 rounded-lg ${activePage === 'avaliacoes' ? 'bg-white/15 text-white shadow-sm ring-1 ring-white/10' : 'text-white/80 hover:bg-white/10 hover:text-white'} transition-all duration-200" href="#/avaliacoes">
                        <span class="material-symbols-outlined text-[24px] flex-shrink-0">assignment</span>
                        <span class="sidebar-text text-sm ${activePage === 'avaliacoes' ? 'font-semibold' : 'font-medium'} whitespace-nowrap overflow-hidden transition-all duration-300">Avaliações</span>
                    </a>
                    <a class="flex items-center gap-3 px-4 py-3 rounded-lg ${activePage === 'avaliadores' ? 'bg-white/15 text-white shadow-sm ring-1 ring-white/10' : 'text-white/80 hover:bg-white/10 hover:text-white'} transition-all duration-200" href="#/avaliadores">
                        <span class="material-symbols-outlined text-[24px] flex-shrink-0">badge</span>
                        <span class="sidebar-text text-sm ${activePage === 'avaliadores' ? 'font-semibold' : 'font-medium'} whitespace-nowrap overflow-hidden transition-all duration-300">Avaliadores</span>
                    </a>
                    ${user.role === 'admin' ? `<a class="flex items-center gap-3 px-4 py-3 rounded-lg ${activePage === 'relatorios' ? 'bg-white/15 text-white shadow-sm ring-1 ring-white/10' : 'text-white/80 hover:bg-white/10 hover:text-white'} transition-all duration-200" href="#/relatorios">
                        <span class="material-symbols-outlined text-[24px] flex-shrink-0">bar_chart</span>
                        <span class="sidebar-text text-sm ${activePage === 'relatorios' ? 'font-semibold' : 'font-medium'} whitespace-nowrap overflow-hidden transition-all duration-300">Relatórios</span>
                    </a>` : ''}
                    <div class="h-px bg-white/10 my-2 mx-4"></div>
                    <a class="flex items-center gap-3 px-4 py-3 rounded-lg ${activePage === 'configuracoes' ? 'bg-white/15 text-white shadow-sm ring-1 ring-white/10' : 'text-white/80 hover:bg-white/10 hover:text-white'} transition-all duration-200" href="#/configuracoes">
                        <span class="material-symbols-outlined text-[24px] flex-shrink-0">settings</span>
                        <span class="sidebar-text text-sm ${activePage === 'configuracoes' ? 'font-semibold' : 'font-medium'} whitespace-nowrap overflow-hidden transition-all duration-300">Configurações</span>
                    </a>
                </nav>
            </div>
            <div class="p-6 border-t border-white/10">
                <div class="flex items-center gap-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/5 hover:bg-white/15 transition-colors cursor-pointer group">
                    <div class="bg-white/20 rounded-full h-10 w-10 flex items-center justify-center border-2 border-white/30 group-hover:border-white/50 transition-colors flex-shrink-0">
                        <span class="material-symbols-outlined text-white text-[20px]">person</span>
                    </div>
                    <div class="sidebar-text flex flex-col overflow-hidden flex-1 transition-all duration-300">
                        <h3 class="text-white text-sm font-semibold truncate">${user.name}</h3>
                        <p class="text-blue-100 text-xs truncate">${user.role === 'admin' ? 'Administrador' : 'Avaliador Chefe'}</p>
                    </div>
                    <button id="logout-btn" class="ml-auto text-white/70 hover:text-white flex-shrink-0">
                        <span class="material-symbols-outlined text-[20px]">logout</span>
                    </button>
                </div>
            </div>
        </aside>
    `;
}

// Setup logout button handler
export function setupLogoutButton() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.clear();
            window.router.navigate('/login');
        });
    }

    // Setup sidebar toggle (desktop)
    setupSidebarToggle();

    // Setup mobile menu
    setupMobileMenu();
}

// Setup sidebar toggle functionality (Desktop)
function setupSidebarToggle() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    const toggleIcon = document.querySelector('.sidebar-toggle-icon');

    if (!sidebar || !toggleBtn) {
        console.log('⚠️ Sidebar toggle: elementos não encontrados');
        return;
    }

    console.log('✅ Sidebar toggle: inicializado');

    // Check localStorage for saved state (only on desktop)
    if (window.innerWidth >= 1024) {
        const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (isCollapsed) {
            collapseSidebar();
        }
    }

    toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const hasW72 = sidebar.classList.contains('w-72');
        console.log('🔘 Toggle clicked! w-72:', hasW72);

        if (hasW72) {
            collapseSidebar();
            localStorage.setItem('sidebarCollapsed', 'true');
        } else {
            expandSidebar();
            localStorage.setItem('sidebarCollapsed', 'false');
        }
    });

    function collapseSidebar() {
        console.log('◀️ Colapsando sidebar...');
        sidebar.classList.remove('w-72');
        sidebar.classList.add('w-20');
        if (toggleIcon) toggleIcon.textContent = 'chevron_right';

        // Hide text elements
        document.querySelectorAll('.sidebar-text').forEach(el => {
            el.style.opacity = '0';
            el.style.width = '0';
            el.style.overflow = 'hidden';
        });
    }

    function expandSidebar() {
        console.log('▶️ Expandindo sidebar...');
        sidebar.classList.remove('w-20');
        sidebar.classList.add('w-72');
        if (toggleIcon) toggleIcon.textContent = 'chevron_left';

        // Show text elements
        setTimeout(() => {
            document.querySelectorAll('.sidebar-text').forEach(el => {
                el.style.opacity = '1';
                el.style.width = 'auto';
                el.style.overflow = 'visible';
            });
        }, 150);
    }
}

// Setup mobile menu functionality
function setupMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileCloseBtn = document.getElementById('mobile-close-btn');
    const menuLinks = sidebar?.querySelectorAll('nav a');

    if (!sidebar || !overlay || !mobileMenuBtn) return;

    // Open mobile menu
    mobileMenuBtn.addEventListener('click', () => {
        openMobileMenu();
    });

    // Close mobile menu
    mobileCloseBtn?.addEventListener('click', () => {
        closeMobileMenu();
    });

    // Close on overlay click
    overlay.addEventListener('click', () => {
        closeMobileMenu();
    });

    // Close on link click
    menuLinks?.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !sidebar.classList.contains('-translate-x-full')) {
            closeMobileMenu();
        }
    });

    function openMobileMenu() {
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
        overlay.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
        overlay.classList.remove('flex');
        document.body.style.overflow = '';
    }
}
