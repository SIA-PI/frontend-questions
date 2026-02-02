// Toast Notification System

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of toast (success, error, warning, info)
 * @param {number} duration - Duration in milliseconds
 */
export function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) {
        console.error('Toast container not found');
        return;
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type} animate-slide-in-right`;

    const icon = getToastIcon(type);

    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" aria-label="Fechar">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        </button>
    `;

    // Add close button functionality
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        removeToast(toast);
    });

    container.appendChild(toast);

    // Auto remove after duration
    setTimeout(() => {
        removeToast(toast);
    }, duration);
}

/**
 * Remove toast with animation
 */
function removeToast(toast) {
    toast.classList.remove('animate-slide-in-right');
    toast.classList.add('animate-fade-out');

    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

/**
 * Get icon for toast type
 */
function getToastIcon(type) {
    const icons = {
        success: `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="2"/>
                <path d="M6 10L9 13L14 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `,
        error: `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="2"/>
                <path d="M10 6V11M10 14V14.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        `,
        warning: `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L2 17H18L10 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M10 8V12M10 14.5V15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        `,
        info: `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="2"/>
                <path d="M10 10V14M10 7V7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        `
    };

    return icons[type] || icons.info;
}

// Convenience methods
export const toast = {
    success: (message, duration) => showToast(message, 'success', duration),
    error: (message, duration) => showToast(message, 'error', duration),
    warning: (message, duration) => showToast(message, 'warning', duration),
    info: (message, duration) => showToast(message, 'info', duration)
};
