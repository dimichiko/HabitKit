// CalorieKit Configuration
// USDA API Configuration

// IMPORTANTE: Para usar la base de datos completa de USDA, necesitas obtener una API key gratuita:
// 1. Ve a: https://fdc.nal.usda.gov/api-key-signup.html
// 2. Regístrate para obtener tu API key gratuita
// 3. Reemplaza 'DEMO_KEY' con tu API key real
// 4. La API key gratuita permite 3,600 requests por día

export const USDA_CONFIG = {
  API_KEY: process.env.REACT_APP_USDA_API_KEY,
  BASE_URL: 'https://api.nal.usda.gov/fdc/v1',
  RATE_LIMIT: 3600, // Requests por día (gratuito)
  SEARCH_DELAY: 500, // Debounce en ms
  CACHE_SIZE: 100, // Número máximo de búsquedas en caché
};

// Configuración de la aplicación
export const APP_CONFIG = {
  DEFAULT_DAILY_GOAL: 2000,
  MAX_SEARCH_RESULTS: 25,
  MIN_SEARCH_LENGTH: 2,
  DEFAULT_SERVING_SIZE: '100g',
};

// Mensajes de error
export const ERROR_MESSAGES = {
  API_ERROR: 'Error al conectar con la base de datos de USDA. Usando base de datos local.',
  NO_RESULTS: 'No se encontraron alimentos. Intenta con otro término.',
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
  RATE_LIMIT: 'Límite de búsquedas alcanzado. Intenta más tarde.',
};

// Nutrientes USDA
export const USDA_NUTRIENTS = {
  CALORIES: {
    names: ['Energy', 'Energy (kcal)'],
    id: 1008
  },
  PROTEIN: {
    names: ['Protein'],
    id: 1003
  },
  CARBS: {
    names: ['Carbohydrate, by difference', 'Carbohydrate'],
    id: 1005
  },
  FAT: {
    names: ['Total lipid (fat)', 'Fat'],
    id: 1004
  }
};

// Tipos de datos USDA
export const DATA_TYPES = {
  FOUNDATION: 'Foundation', // Datos más precisos
  SR_LEGACY: 'SR Legacy',   // Base de datos estándar
  LOCAL: 'Local'            // Base de datos local
};

const config = {
  // API Configuration
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
  
  // App Configuration
  APP_NAME: 'LifeHub',
  APP_VERSION: '1.0.0',
  
  // Features
  FEATURES: {
    CALORIEKIT: true,
    HABITKIT: true,
    INVOICEKIT: true,
    AUTH: true,
    ANALYTICS: true
  },
  
  // UI Configuration
  UI: {
    THEME: 'light',
    PRIMARY_COLOR: '#3B82F6',
    SECONDARY_COLOR: '#10B981',
    ACCENT_COLOR: '#F59E0B'
  },
  
  // Local Storage Keys
  STORAGE_KEYS: {
    USER_TOKEN: 'lifehub_user_token',
    USER_PROFILE: 'lifehub_user_profile',
    THEME: 'lifehub_theme',
    CALORIEKIT_DATA: 'caloriekit_data',
    HABITKIT_DATA: 'habitkit_data',
    INVOICEKIT_DATA: 'invoicekit_data'
  },
  
  // Default Values
  DEFAULTS: {
    DAILY_CALORIE_GOAL: 2000,
    DAILY_PROTEIN_GOAL: 150,
    DAILY_CARBS_GOAL: 250,
    DAILY_FAT_GOAL: 65
  },
  
  // Validation Rules
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 6,
    MAX_NAME_LENGTH: 50,
    MAX_DESCRIPTION_LENGTH: 500
  }
};

export default config; 