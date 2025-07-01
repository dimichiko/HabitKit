import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Tipos
interface User {
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

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  alert: { type: 'success' | 'error' | 'info'; message: string } | null;
}

// Estado inicial
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: false,
  loading: true,
  error: null,
  alert: null
};

// Tipos de acciones
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ALERT'; payload: { type: 'success' | 'error' | 'info'; message: string } | null }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string; refreshToken: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'SET_USER'; payload: User }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_TOKENS'; payload: { token: string; refreshToken: string } };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_ALERT':
      return { ...state, alert: action.payload };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case 'SET_TOKENS':
      return {
        ...state,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null
      };
    
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false
      };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
};

// Contexto
interface UserContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  silentLogin: (user: User, token: string, refreshToken: string) => void;
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

const UserContext = createContext<UserContextType | undefined>(undefined);

// Hook personalizado
export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext debe ser usado dentro de un UserProvider');
  }
  return context;
};

// Alias para compatibilidad
export const useUser = useUserContext;

// Provider
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Configurar axios interceptors
  useEffect(() => {
    // Configurar baseURL para axios (usar proxy configurado en package.json)
    axios.defaults.baseURL = '';
    
    // Interceptor para agregar token a todas las requests
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (state.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para manejar errores 401 y refresh token
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry && state.refreshToken) {
          originalRequest._retry = true;

          try {
            console.log('Token expirado, intentando refresh...');
            const response = await axios.post('/api/auth/refresh', {
              refreshToken: state.refreshToken
            });
            
            const { token, refreshToken } = response.data;
            
            // Actualizar tokens en localStorage y estado
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
            
            // Configurar headers de axios para requests posteriores
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            
            dispatch({ type: 'SET_TOKENS', payload: { token, refreshToken } });
            
            // Reintentar la request original
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          } catch (refreshError) {
            console.error('Error en refresh token:', refreshError);
            logout();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [state.token, state.refreshToken]);

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (token && refreshToken) {
        try {
          console.log('Verificando token al cargar...');
          
          // Configurar headers de axios para requests posteriores
          axios.defaults.headers.common.Authorization = `Bearer ${token}`;
          
          const response = await axios.get('/api/auth/profile');
          console.log('Token válido, cargando usuario:', response.data);
          
          dispatch({ type: 'SET_USER', payload: response.data });
        } catch (error) {
          console.error('Error verificando token al cargar:', error);
          
          // Intentar refresh si falla la verificación
          try {
            console.log('Intentando refresh token al cargar...');
            const refreshResponse = await axios.post('/api/auth/refresh', {
              refreshToken
            });
            
            const { token: newToken, refreshToken: newRefreshToken } = refreshResponse.data;
            
            localStorage.setItem('token', newToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            
            // Configurar headers de axios para requests posteriores
            axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;
            
            dispatch({ type: 'SET_TOKENS', payload: { token: newToken, refreshToken: newRefreshToken } });
            
            // Obtener perfil con el nuevo token
            const profileResponse = await axios.get('/api/auth/profile');
            dispatch({ type: 'SET_USER', payload: profileResponse.data });
          } catch (refreshError) {
            console.error('Error en refresh al cargar:', refreshError);
            logout();
          }
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await axios.post('/api/auth/login', { email, password });
      const { user, token, refreshToken } = response.data;

      // Verificar que token sea string, no objeto
      if (typeof token !== 'string') {
        throw new Error('Token inválido recibido del servidor');
      }

      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      // Configurar headers de axios para requests posteriores
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;

      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token, refreshToken } });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const silentLogin = (user: User, token: string, refreshToken: string): void => {
    // Guardar en localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));

    // Configurar headers de axios para requests posteriores
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;

    // Actualizar estado sin mostrar loading
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token, refreshToken } });
  };

  const register = async (userData: { name: string; email: string; password: string }): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      await axios.post('/api/auth/register', userData);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al registrarse';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = (): void => {
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Limpiar headers de axios
    delete axios.defaults.headers.common['Authorization'];
    
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await axios.put('/api/users/profile', userData);
      dispatch({ type: 'UPDATE_USER', payload: response.data });
      
      // Actualizar user en localStorage
      if (state.user) {
        const updatedUser = { ...state.user, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar usuario';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    return updateUser(userData);
  };

  const verifyEmail = async (token: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      await axios.post('/api/auth/verify-email', { token });
      if (state.user) {
        dispatch({ type: 'UPDATE_USER', payload: { isEmailVerified: true } });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al verificar email';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      await axios.post('/api/auth/reset-password', { email });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al enviar email de reset';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      await axios.put('/api/users/change-password', { currentPassword, newPassword });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cambiar contraseña';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const enableTwoFactor = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      await axios.post('/api/auth/enable-2fa');
      if (state.user) {
        dispatch({ type: 'UPDATE_USER', payload: { twoFactorEnabled: true } });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al habilitar 2FA';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const disableTwoFactor = async (code: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      await axios.post('/api/auth/disable-2fa', { code });
      if (state.user) {
        dispatch({ type: 'UPDATE_USER', payload: { twoFactorEnabled: false } });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al deshabilitar 2FA';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const verifyTwoFactor = async (code: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await axios.post('/api/auth/verify-2fa', { code });
      const { user, token, refreshToken } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      // Configurar headers de axios para requests posteriores
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;

      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token, refreshToken } });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Código 2FA inválido';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const refreshAuth = async (): Promise<void> => {
    try {
      const response = await axios.post('/api/auth/refresh', {
        refreshToken: state.refreshToken
      });
      
      const { token, refreshToken } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      
      // Configurar headers de axios para requests posteriores
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      
      dispatch({ type: 'SET_TOKENS', payload: { token, refreshToken } });
    } catch (error) {
      logout();
      throw error;
    }
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const setAlert = (alert: { type: 'success' | 'error' | 'info'; message: string } | null): void => {
    dispatch({ type: 'SET_ALERT', payload: alert });
  };

  // Funciones de plan y acceso
  const hasAppAccess = (appName: string): boolean => {
    if (!state.user) return false;
    
    // Si el usuario tiene activeApps, verificar si la app está incluida
    if (state.user.activeApps && state.user.activeApps.length > 0) {
      return state.user.activeApps.includes(appName);
    }
    
    // Si no tiene activeApps, usar la lógica de planes
    const planFeatures = getPlanFeatures();
    return planFeatures[appName] || false;
  };

  const getPlanFeatures = (): { [key: string]: any } => {
    if (!state.user) return {};
    
    const planFeatures = {
      free: {
        habitkit: true,
        caloriekit: false,
        invoicekit: false,
        trainingkit: false
      },
      premium: {
        habitkit: true,
        caloriekit: true,
        invoicekit: true,
        trainingkit: false
      },
      enterprise: {
        habitkit: true,
        caloriekit: true,
        invoicekit: true,
        trainingkit: true
      },
      KitFull: {
        habitkit: true,
        caloriekit: true,
        invoicekit: true,
        trainingkit: true
      },
      Flexible: {
        habitkit: true,
        caloriekit: true,
        invoicekit: true,
        trainingkit: true
      },
      Individual: {
        habitkit: true,
        caloriekit: false,
        invoicekit: false,
        trainingkit: false
      }
    };
    
    return planFeatures[state.user.plan] || planFeatures.free;
  };

  const canUpgradePlan = (): boolean => {
    if (!state.user) return false;
    return state.user.plan !== 'enterprise';
  };

  const getAvailableApps = (): string[] => {
    const features = getPlanFeatures();
    return Object.keys(features).filter(app => features[app]);
  };

  const refreshActivity = (): void => {
    // Función placeholder para compatibilidad
    console.log('Refreshing activity...');
  };

  const value: UserContextType = {
    // Estado
    ...state,
    
    // Funciones de autenticación
    login,
    silentLogin,
    register,
    logout,
    
    // Funciones de perfil
    updateUser,
    updateProfile,
    
    // Funciones de email
    verifyEmail,
    resetPassword,
    
    // Funciones de contraseña
    changePassword,
    
    // Funciones de 2FA
    enableTwoFactor,
    disableTwoFactor,
    verifyTwoFactor,
    
    // Funciones de utilidad
    refreshAuth,
    clearError,
    setAlert,
    
    // Funciones de plan y acceso
    hasAppAccess,
    getPlanFeatures,
    canUpgradePlan,
    getAvailableApps,
    refreshActivity,
    
    // Nueva propiedad isLoading
    isLoading: state.loading,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext; 