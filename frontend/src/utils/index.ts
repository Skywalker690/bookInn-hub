// Authentication utilities
export const AuthUtils = {
  // Store auth data in localStorage
  setAuthData: (token: string, user: any, role: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('role', role);
  },

  // Get auth data from localStorage
  getAuthData: () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    
    let user = null;
    if (userStr && userStr !== 'undefined' && userStr !== 'null') {
      try {
        user = JSON.parse(userStr);
      } catch (error) {
        console.warn('Invalid JSON in localStorage for user data, clearing it:', error);
        localStorage.removeItem('user');
      }
    }
    
    return {
      token,
      user,
      role,
    };
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Check if user is admin
  isAdmin: (): boolean => {
    const role = localStorage.getItem('role');
    return role === 'ADMIN';
  },

  // Clear auth data (logout)
  clearAuthData: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr || userStr === 'undefined' || userStr === 'null') {
      return null;
    }
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.warn('Invalid JSON in localStorage for user data, clearing it:', error);
      localStorage.removeItem('user');
      return null;
    }
  },
};

// Date utilities
export const DateUtils = {
  // Format date to YYYY-MM-DD
  formatDate: (date: Date): string => {
    return date.toISOString().split('T')[0];
  },

  // Parse date string to Date object
  parseDate: (dateStr: string): Date => {
    return new Date(dateStr);
  },

  // Get today's date as YYYY-MM-DD
  getTodayString: (): string => {
    return DateUtils.formatDate(new Date());
  },

  // Get tomorrow's date as YYYY-MM-DD
  getTomorrowString: (): string => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return DateUtils.formatDate(tomorrow);
  },

  // Check if date is valid
  isValidDate: (dateStr: string): boolean => {
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date.getTime());
  },

  // Calculate number of days between two dates
  daysBetween: (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },
};

// Form validation utilities
export const ValidationUtils = {
  // Validate email
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate phone number
  isValidPhoneNumber: (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-()]+$/;
    return phoneRegex.test(phone) && phone.length >= 10;
  },

  // Validate password strength
  isValidPassword: (password: string): boolean => {
    return password.length >= 6;
  },

  // Validate required field
  isRequired: (value: string): boolean => {
    return value.trim().length > 0;
  },
};

// Utility for formatting currency
export const CurrencyUtils = {
  formatPrice: (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  },
};

// General utilities
export const Utils = {
  // Capitalize first letter
  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  // Generate random ID (for temporary use)
  generateId: (): string => {
    return Math.random().toString(36).substr(2, 9);
  },

  // Debounce function
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(null, args), wait);
    };
  },
};