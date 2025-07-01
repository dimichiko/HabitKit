// Tipos para el sistema de autenticación y usuarios

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  avatarUrl?: string;
  plan: 'free' | 'premium' | 'enterprise' | 'KitFull' | 'Flexible' | 'Individual';
  isEmailVerified: boolean;
  emailVerified?: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  phone?: string;
  level?: number;
  activeApps?: string[];
  lastLogin?: string;
  role?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  alert: { type: 'success' | 'error' | 'info'; message: string } | null;
}

export type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ALERT'; payload: { type: 'success' | 'error' | 'info'; message: string } | null }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string; refreshToken: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'SET_USER'; payload: User }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_TOKENS'; payload: { token: string; refreshToken: string } };

export interface UserContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  enableTwoFactor: () => Promise<void>;
  disableTwoFactor: (code: string) => Promise<void>;
  verifyTwoFactor: (code: string) => Promise<void>;
  refreshAuth: () => Promise<void>;
  clearError: () => void;
  setAlert: (alert: { type: 'success' | 'error' | 'info'; message: string } | null) => void;
  hasAppAccess: (appName: string) => boolean;
  getPlanFeatures: () => { [key: string]: any };
  canUpgradePlan: () => boolean;
  getAvailableApps: () => string[];
  refreshActivity: () => void;
  isLoading: boolean;
}

// Tipos para formularios
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordFormData {
  email: string;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Tipos para planes y acceso
export interface PlanFeatures {
  habitkit: boolean;
  caloriekit: boolean;
  invoicekit: boolean;
  trainingkit: boolean;
}

export interface PlanPricing {
  monthly: number;
  annual: number;
  features: PlanFeatures;
}

export type PlanType = 'free' | 'premium' | 'enterprise' | 'KitFull' | 'Flexible' | 'Individual';

// Tipos para alertas y notificaciones
export type AlertType = 'success' | 'error' | 'info' | 'warning';

export interface Alert {
  type: AlertType;
  message: string;
  duration?: number;
} 