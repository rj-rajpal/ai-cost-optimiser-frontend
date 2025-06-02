// Configuration Constants
// Centralized location for all configuration values, API settings, and environment variables

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// OpenAI Configuration
export const OPENAI_CONFIG = {
  API_KEY: import.meta.env.OPENAI_API_KEY,
  BASE_URL: 'https://api.openai.com/v1',
  DEFAULT_MODEL: 'gpt-3.5-turbo',
  MODELS: {
    GPT_4: 'gpt-4',
    GPT_4_TURBO: 'gpt-4-turbo',
    GPT_4O: 'gpt-4o',
    GPT_4O_MINI: 'gpt-4o-mini',
    GPT_3_5_TURBO: 'gpt-3.5-turbo',
  },
  PRICING: {
    'gpt-4': { input: 0.03, output: 0.06 },
    'gpt-4-turbo': { input: 0.01, output: 0.03 },
    'gpt-3.5-turbo': { input: 0.001, output: 0.002 },
    'gpt-4o': { input: 0.005, output: 0.015 },
    'gpt-4o-mini': { input: 0.00015, output: 0.0006 }
  },
  DEFAULT_PARAMS: {
    temperature: 0.7,
    max_tokens: 1000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  },
  LIMITS: {
    MAX_TOKENS_GPT_4: 8192,
    MAX_TOKENS_GPT_3_5: 4096,
    MAX_CONTEXT_LENGTH: 16385,
  }
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

// Application Configuration
export const APP_CONFIG = {
  NAME: "AI Cost Optimizer",
  VERSION: "0.1.0",
  ENVIRONMENT: import.meta.env.MODE || 'development',
  DEBUG: import.meta.env.DEV || false,
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
};

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/project/:projectId',
  PROJECT_DASHBOARD: '/project/:projectId/dashboard',
  PROJECT_DATA_UPLOAD: '/project/:projectId/data-upload',
  PROJECT_ANALYSIS: '/project/:projectId/analysis',
  PROJECT_ROI_CALCULATOR: '/project/:projectId/roi-calculator',
  PROJECT_SCENARIOS: '/project/:projectId/scenarios',
  ONBOARDING: '/onboarding',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  SIDEBAR_STATE: 'sidebar_state',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// UI Configuration
export const UI_CONFIG = {
  SIDEBAR_WIDTH: 320, // 320px (w-80)
  HEADER_HEIGHT: 64, // 64px (h-16)
  ANIMATION_DURATION: 300, // 300ms
  DEBOUNCE_DELAY: 500, // 500ms for search inputs
  PAGINATION_SIZE: 10,
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB in bytes
};

// Theme Configuration
export const THEME_CONFIG = {
  COLORS: {
    PRIMARY: 'muted-indigo',
    SECONDARY: 'mist-teal',
    BACKGROUND: 'cloud-white',
    SURFACE: 'white',
    TEXT_PRIMARY: 'soft-navy',
    TEXT_SECONDARY: 'slate-gray',
    TEXT_BODY: 'charcoal-black',
    BORDER: 'sky-gray',
    ERROR: 'red-600',
    SUCCESS: 'green-600',
    WARNING: 'yellow-600',
    INFO: 'blue-600',
  },
  SHADOWS: {
    MIST: 'shadow-mist',
    ELEVATION: 'shadow-elevation',
  },
  BORDERS: {
    RADIUS: 'rounded-lg',
    RADIUS_FULL: 'rounded-full',
    RADIUS_2XL: 'rounded-2xl',
  },
};

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
  MAX_TEXT_LENGTH: 1000,
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
};

// File Upload Configuration
export const UPLOAD_CONFIG = {
  ALLOWED_TYPES: {
    CSV: 'text/csv',
    EXCEL: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    JSON: 'application/json',
    PDF: 'application/pdf',
    IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_FILES: 10,
  CHUNK_SIZE: 1024 * 1024, // 1MB chunks for large file uploads
};

// Animation and Transition Configuration
export const ANIMATIONS = {
  DURATION: {
    FAST: 150,
    NORMAL: 200,
    SLOW: 300,
    SLOWER: 500,
  },
  EASING: {
    DEFAULT: 'ease-in-out',
    IN: 'ease-in',
    OUT: 'ease-out',
    BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};

// Chat Configuration
export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 2000,
  MAX_HISTORY_ITEMS: 50,
  TYPING_INDICATOR_DELAY: 1000,
  AUTO_SCROLL_THRESHOLD: 100,
  MESSAGE_BATCH_SIZE: 20,
};

// Error Messages Configuration
export const ERROR_CONFIG = {
  NETWORK: 'Network error. Please check your connection.',
  TIMEOUT: 'Request timed out. Please try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Internal server error. Please try again later.',
  VALIDATION: 'Please check your input and try again.',
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed limit.',
  FILE_TYPE_NOT_ALLOWED: 'File type not supported.',
};

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: true,
  ENABLE_EXPORT: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_DARK_MODE: false,
  ENABLE_REALTIME_CHAT: true,
  ENABLE_FILE_PREVIEW: true,
  ENABLE_ADVANCED_FILTERING: true,
};

// Default Values
export const DEFAULTS = {
  LANGUAGE: 'en',
  TIMEZONE: 'UTC',
  DATE_FORMAT: 'YYYY-MM-DD',
  TIME_FORMAT: '24h',
  CURRENCY: 'USD',
  PAGINATION_PAGE_SIZE: 10,
  CHART_COLORS: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
}; 