// Utility Functions

// Toast notification system
class Toast {
    static show(message, type = 'success', duration = 3000) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        container.appendChild(toast);

        // Auto remove after duration
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => {
                    container.removeChild(toast);
                }, 300);
            }
        }, duration);
    }

    static success(message, duration) {
        this.show(message, 'success', duration);
    }

    static error(message, duration) {
        this.show(message, 'error', duration);
    }
}

// Date formatting utilities
const DateUtils = {
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    timeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
        return this.formatDate(dateString);
    }
};

// String utilities
const StringUtils = {
    truncate(str, length = 100) {
        if (!str || str.length <= length) return str;
        return str.substring(0, length) + '...';
    },

    capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    kebabCase(str) {
        return str
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .replace(/\s+/g, '-')
            .toLowerCase();
    },

    camelCase(str) {
        return str
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
                return index === 0 ? word.toLowerCase() : word.toUpperCase();
            })
            .replace(/\s+/g, '');
    }
};

// Array utilities
const ArrayUtils = {
    unique(array) {
        return [...new Set(array)];
    },

    groupBy(array, key) {
        return array.reduce((groups, item) => {
            const group = item[key];
            groups[group] = groups[group] || [];
            groups[group].push(item);
            return groups;
        }, {});
    },

    sortBy(array, key, direction = 'asc') {
        return [...array].sort((a, b) => {
            const aVal = a[key];
            const bVal = b[key];
            
            if (direction === 'desc') {
                return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
            }
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        });
    }
};

// DOM utilities
const DOMUtils = {
    createElement(tag, className, content) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (content) element.innerHTML = content;
        return element;
    },

    show(element) {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }
        if (element) element.style.display = 'block';
    },

    hide(element) {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }
        if (element) element.style.display = 'none';
    },

    toggle(element) {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }
        if (element) {
            element.style.display = element.style.display === 'none' ? 'block' : 'none';
        }
    },

    addClass(element, className) {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }
        if (element) element.classList.add(className);
    },

    removeClass(element, className) {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }
        if (element) element.classList.remove(className);
    },

    toggleClass(element, className) {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }
        if (element) element.classList.toggle(className);
    }
};

// Validation utilities
const ValidationUtils = {
    isEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    isURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },

    isEmpty(value) {
        return value === null || value === undefined || value === '' || 
               (Array.isArray(value) && value.length === 0) ||
               (typeof value === 'object' && Object.keys(value).length === 0);
    },

    isValidJSON(str) {
        try {
            JSON.parse(str);
            return true;
        } catch {
            return false;
        }
    }
};

// API utilities
const APIUtils = {
    async request(url, options = {}) {
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const finalOptions = { ...defaultOptions, ...options };
        
        if (finalOptions.body && typeof finalOptions.body === 'object') {
            finalOptions.body = JSON.stringify(finalOptions.body);
        }

        try {
            const response = await fetch(url, finalOptions);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }
            
            return data;
        } catch (error) {
            console.error('API request error:', error);
            throw error;
        }
    },

    get(url, options = {}) {
        return this.request(url, { ...options, method: 'GET' });
    },

    post(url, data, options = {}) {
        return this.request(url, { ...options, method: 'POST', body: data });
    },

    put(url, data, options = {}) {
        return this.request(url, { ...options, method: 'PUT', body: data });
    },

    delete(url, options = {}) {
        return this.request(url, { ...options, method: 'DELETE' });
    }
};

// Color utilities for flow builder
const ColorUtils = {
    colors: [
        '#3b82f6', // blue
        '#8b5cf6', // purple
        '#10b981', // green
        '#f59e0b', // yellow
        '#ef4444', // red
        '#06b6d4', // cyan
        '#f97316', // orange
        '#84cc16', // lime
        '#ec4899', // pink
        '#6366f1'  // indigo
    ],

    getColorByIndex(index) {
        return this.colors[index % this.colors.length];
    },

    hexToRgba(hex, alpha = 1) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },

    darken(hex, amount = 0.2) {
        const r = Math.max(0, parseInt(hex.slice(1, 3), 16) * (1 - amount));
        const g = Math.max(0, parseInt(hex.slice(3, 5), 16) * (1 - amount));
        const b = Math.max(0, parseInt(hex.slice(5, 7), 16) * (1 - amount));
        return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
    }
};

// Make utilities globally available
window.Toast = Toast;
window.DateUtils = DateUtils;
window.StringUtils = StringUtils;
window.ArrayUtils = ArrayUtils;
window.DOMUtils = DOMUtils;
window.ValidationUtils = ValidationUtils;
window.APIUtils = APIUtils;
window.ColorUtils = ColorUtils;