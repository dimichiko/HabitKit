import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../../apps/habitkit/utils/api';

const UserContext = createContext();

// Configuración
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutos

// Enums para consistencia
const SUBSCRIPTION_PLANS = {
  FREE: 'Free',
  INDIVIDUAL: 'Individual',
  FLEXIBLE: 'Flexible',
  KITFULL: 'KitFull'
};

const AVAILABLE_APPS = {
  HABITKIT: 'habitkit',
  INVOICEKIT: 'invoicekit',
  TRAININGKIT: 'trainingkit',
  CALORIEKIT: 'caloriekit'
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState(null);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Verificar si el token es válido
  const isTokenValid = useCallback((token) => {
    if (!token) {
      console.log('isTokenValid: No hay token');
      return false;
    }
    
    try {
      // Verificar si es un token de prueba (no JWT real)
      if (token.startsWith('demo-token-')) {
        console.log('isTokenValid: Token de prueba detectado');
        const tokenParts = token.split('-');
        if (tokenParts.length >= 4) {
          const timestamp = parseInt(tokenParts[tokenParts.length - 1]);
          const currentTime = Date.now();
          const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 días
          
          if (currentTime - timestamp > maxAge) {
            console.log('isTokenValid: Token de prueba muy antiguo');
            return false;
          }
          
          console.log('isTokenValid: Token de prueba válido');
          return true;
        }
        return false;
      }
      
      // Para tokens JWT reales - validación más permisiva
      if (token.includes('.')) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        // Solo verificar expiración básica
        if (payload.exp && payload.exp < currentTime) {
          console.log('isTokenValid: Token expirado');
          return false;
        }
        
        console.log('isTokenValid: Token JWT válido');
        return true;
      }
      
      // Si no es JWT, asumir que es válido
      console.log('isTokenValid: Token no JWT, asumiendo válido');
      return true;
    } catch (error) {
      console.error('Error validando token:', error);
      // Si hay error al decodificar, asumir que es válido
      console.log('isTokenValid: Error decodificando, asumiendo válido');
      return true;
    }
  }, []);

  // Verificar permisos de acceso a apps
  const hasAppAccess = useCallback((appName) => {
    if (!user) return false;
    
    // Verificar si la app está en las apps disponibles
    if (!Object.values(AVAILABLE_APPS).includes(appName)) {
      return false;
    }
    
    // Verificar acceso según el plan
    switch (user.plan) {
      case SUBSCRIPTION_PLANS.KITFULL:
        return true; // Acceso total
      case SUBSCRIPTION_PLANS.FLEXIBLE:
        return user.activeApps && user.activeApps.includes(appName);
      case SUBSCRIPTION_PLANS.INDIVIDUAL:
        return user.activeApps && user.activeApps.length === 1 && user.activeApps[0] === appName;
      case SUBSCRIPTION_PLANS.FREE:
        return user.activeApps && user.activeApps.length === 1 && user.activeApps[0] === appName;
      default:
        return false;
    }
  }, [user]);

  // Obtener características del plan
  const getPlanFeatures = useCallback(() => {
    if (!user) return null;
    
    const features = {
      [SUBSCRIPTION_PLANS.FREE]: {
        maxApps: 1,
        hasFullHistory: false,
        hasBackups: false,
        adsEnabled: true,
        supportLevel: 'limited'
      },
      [SUBSCRIPTION_PLANS.INDIVIDUAL]: {
        maxApps: 1,
        hasFullHistory: true,
        hasBackups: true,
        adsEnabled: false,
        supportLevel: 'email'
      },
      [SUBSCRIPTION_PLANS.FLEXIBLE]: {
        maxApps: 2,
        hasFullHistory: true,
        hasBackups: true,
        adsEnabled: false,
        supportLevel: 'email'
      },
      [SUBSCRIPTION_PLANS.KITFULL]: {
        maxApps: 4,
        hasFullHistory: true,
        hasBackups: true,
        adsEnabled: false,
        supportLevel: 'priority'
      }
    };
    
    return features[user.plan] || features[SUBSCRIPTION_PLANS.FREE];
  }, [user]);

  // Refrescar token si expira
  const refreshToken = useCallback(async () => {
    try {
      const { data } = await apiClient.post('/auth/refresh');
      if (data && data.success && data.data.token) {
        localStorage.setItem('token', data.data.token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.data.token}`;
        return data.data.token;
      }
    } catch (err) {
      console.error('Error al refrescar token:', err);
    }
    return null;
  }, []);

  // Cargar perfil completo del usuario
  const loadUserProfile = useCallback(async (token) => {
    try {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const { data } = await apiClient.get('/auth/profile');
      
      if (data && data.success && data.data) {
        const userData = {
          id: data.data.id,
          name: data.data.name,
          email: data.data.email,
          phone: data.data.phone,
          plan: data.data.plan,
          role: data.data.role,
          activeApps: data.data.activeApps || [],
          isPremium: data.data.isPremium,
          isInTrial: data.data.isInTrial,
          subscriptionExpired: data.data.subscriptionExpired,
          settings: data.data.settings,
          subscription: data.data.subscription,
          points: data.data.points,
          level: data.data.level,
          planFeatures: data.data.planFeatures,
          calorieProfile: data.data.calorieProfile,
          createdAt: data.data.createdAt,
          updatedAt: data.data.updatedAt,
          lastLogin: data.data.lastLogin,
          token,
          sessionId: Date.now().toString()
        };
        
        // Sincronizar localStorage
        localStorage.setItem('user_id', userData.id);
        localStorage.setItem('user_name', userData.name);
        localStorage.setItem('user_email', userData.email);
        localStorage.setItem('user_plan', userData.plan);
        localStorage.setItem('session_id', userData.sessionId);
        
        setUser(userData);
        return userData;
      }
    } catch (err) {
      console.error('Error cargando perfil:', err);
      throw err;
    }
  }, []);

  // Inicializar usuario desde localStorage
  useEffect(() => {
    const initializeUser = async () => {
      console.log('Inicializando usuario...');
      const token = localStorage.getItem('token');
      
      if (token && isTokenValid(token)) {
        console.log('Token válido, cargando usuario...');
        try {
          await loadUserProfile(token);
          setIsLoading(false);
          setIsInitialized(true);
          return;
        } catch (err) {
          // Si es 401, intenta refresh
          if (err.response && err.response.status === 401) {
            const newToken = await refreshToken();
            if (newToken) {
              try {
                await loadUserProfile(newToken);
                setIsLoading(false);
                setIsInitialized(true);
                return;
              } catch (e) {
                logout('Tu sesión ha expirado. Inicia sesión de nuevo.');
                setIsLoading(false);
                setIsInitialized(true);
                return;
              }
            } else {
              logout('Tu sesión ha expirado. Inicia sesión de nuevo.');
              setIsLoading(false);
              setIsInitialized(true);
              return;
            }
          }
        }
      } else {
        console.log('Token inválido o no encontrado, limpiando datos...');
        // Token inválido, limpiar datos
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_plan');
        localStorage.removeItem('session_id');
        localStorage.removeItem('last_activity');
        setUser(null);
        setLastActivity(Date.now());
        setAlert(null);
      }
      
      setIsLoading(false);
      setIsInitialized(true);
    };

    initializeUser();
  }, [isTokenValid, loadUserProfile, refreshToken]);

  // Guardar actividad y controlar expiración
  useEffect(() => {
    const handleActivity = () => {
      if (user) {
        setLastActivity(Date.now());
        localStorage.setItem('last_activity', Date.now().toString());
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);
    
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [user]);

  // Control de expiración de sesión - menos agresivo
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceActivity = now - lastActivity;
      
      if (timeSinceActivity > SESSION_TIMEOUT) {
        logout('Tu sesión ha expirado por inactividad.');
      }
    }, 60000); // Verificar cada minuto en lugar de cada 10 segundos
    
    return () => clearInterval(interval);
  }, [user, lastActivity]);

  const login = useCallback(async (profile) => {
    try {
      // Generar ID de sesión único
      const sessionId = Date.now().toString();
      
      // Guardar token
      localStorage.setItem('token', profile.token);
      localStorage.setItem('session_id', sessionId);
      localStorage.setItem('last_activity', Date.now().toString());
      
      // Cargar perfil completo
      const userData = await loadUserProfile(profile.token);
      
      // Actualizar estado
      setUser(userData);
      setAlert(null);
      setLastActivity(Date.now());
      
      return userData;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }, [loadUserProfile]);

  const logout = useCallback((msg) => {
    console.log('Cerrando sesión:', msg || 'Sesión cerrada correctamente.');
    
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_plan');
    localStorage.removeItem('session_id');
    localStorage.removeItem('last_activity');
    
    // Limpiar headers de API
    delete apiClient.defaults.headers.common['Authorization'];
    
    // Limpiar estado
    setUser(null);
    setAlert(msg || 'Sesión cerrada correctamente.');
    setLastActivity(Date.now());
  }, []);

  const updateUser = useCallback(async (updates) => {
    if (!user) return;
    
    try {
      // Actualizar en el servidor
      const { data } = await apiClient.put('/auth/profile', updates);
      
      if (data && data.success && data.data) {
        const updatedUserData = {
          ...user,
          ...data.data,
          token: user.token,
          sessionId: user.sessionId
        };
        
        // Actualizar localStorage
        if (data.data.name) localStorage.setItem('user_name', data.data.name);
        if (data.data.email) localStorage.setItem('user_email', data.data.email);
        if (data.data.plan) localStorage.setItem('user_plan', data.data.plan);
        
        setUser(updatedUserData);
        return updatedUserData;
      }
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw error;
    }
  }, [user]);

  // Función para refrescar la actividad del usuario
  const refreshActivity = useCallback(() => {
    if (user) {
      setLastActivity(Date.now());
      localStorage.setItem('last_activity', Date.now().toString());
    }
  }, [user]);

  // Función para obtener apps disponibles
  const getAvailableApps = useCallback(async () => {
    if (!user) return [];
    
    try {
      const { data } = await apiClient.get('/auth/apps');
      if (data && data.success) {
        return data.data;
      }
    } catch (error) {
      console.error('Error obteniendo apps:', error);
    }
    
    return [];
  }, [user]);

  // Función para verificar si puede actualizar plan
  const canUpgradePlan = useCallback(() => {
    if (!user) return false;
    return user.plan !== SUBSCRIPTION_PLANS.KITFULL;
  }, [user]);

  return (
    <UserContext.Provider value={{ 
      user, 
      login, 
      logout, 
      updateUser,
      refreshActivity,
      hasAppAccess,
      getPlanFeatures,
      getAvailableApps,
      canUpgradePlan,
      alert, 
      setAlert,
      isLoading,
      isInitialized,
      isTokenValid
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe ser usado dentro de un UserProvider');
  }
  return context;
};

// Exportar enums para uso en otros archivos
export { SUBSCRIPTION_PLANS, AVAILABLE_APPS }; 