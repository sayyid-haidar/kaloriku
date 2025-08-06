// Theme constants for kaloriKu
export const theme = {
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    slate: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
};

export const variants = {
  button: {
    primary: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
    secondary: 'bg-white border border-green-300 hover:border-green-400 text-green-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
    ghost: 'text-green-600 hover:text-green-800 hover:bg-green-50 font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
    warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2',
  },
  card: {
    default: 'bg-white rounded-xl border border-green-200 shadow-sm',
    elevated: 'bg-white rounded-xl border border-green-200 shadow-lg hover:shadow-xl transition-shadow duration-200',
    bordered: 'bg-white rounded-xl border-2 border-green-300',
    glass: 'bg-white/80 backdrop-blur-sm rounded-xl border border-green-200 shadow-lg',
  },
  input: {
    default: 'w-full px-4 py-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 bg-white',
    error: 'w-full px-4 py-3 border border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 bg-red-50',
    success: 'w-full px-4 py-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 bg-green-50',
  },
  alert: {
    success: 'bg-green-50 border border-green-200 text-green-800 rounded-xl p-4',
    warning: 'bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-4',
    error: 'bg-red-50 border border-red-200 text-red-800 rounded-xl p-4',
    info: 'bg-blue-50 border border-blue-200 text-blue-800 rounded-xl p-4',
  },
  badge: {
    default: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800',
    success: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800',
    warning: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800',
    error: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800',
    info: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800',
  },
};

// Meal type styles
export const mealStyles = {
  breakfast: {
    gradient: 'from-green-400 via-emerald-400 to-teal-400',
    bgLight: 'bg-green-50',
    textLight: 'text-green-700',
    icon: '🌅'
  },
  lunch: {
    gradient: 'from-emerald-400 via-green-400 to-emerald-500',
    bgLight: 'bg-emerald-50',
    textLight: 'text-emerald-700',
    icon: '☀️'
  },
  dinner: {
    gradient: 'from-teal-400 via-emerald-400 to-green-500',
    bgLight: 'bg-teal-50',
    textLight: 'text-teal-700',
    icon: '🌙'
  },
  snack: {
    gradient: 'from-green-400 via-emerald-400 to-teal-400',
    bgLight: 'bg-green-50',
    textLight: 'text-green-700',
    icon: '🍪'
  }
};

export default theme;
