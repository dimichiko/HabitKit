// src/components/PrivateRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

// Hook personalizado para manejar navegación con refresh de actividad
export const useNavigationWithActivity = () => {
  const { refreshActivity } = useUser();
  const location = useLocation();
  
  React.useEffect(() => {
    refreshActivity();
  }, [location.pathname, refreshActivity]);
};

// Componente para proteger rutas que requieren autenticación
const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useUser();
  
  // Refrescar actividad cuando se accede a rutas protegidas
  useNavigationWithActivity();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Componente para proteger rutas de apps específicas según el plan
const ProtectedAppRoute = ({ children, appName, fallbackComponent }) => {
  const { user, isLoading, hasAppAccess } = useUser();
  
  // Refrescar actividad cuando se accede a rutas de apps
  useNavigationWithActivity();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasAppAccess(appName)) {
    if (fallbackComponent) {
      return fallbackComponent;
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Acceso Restringido</h2>
          <p className="text-gray-600 mb-6">
            Esta aplicación requiere un plan superior. Tu plan actual es <span className="font-semibold text-purple-600">{user.plan}</span>.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/pricing'}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Ver Planes Disponibles
            </button>
            <button
              onClick={() => window.location.href = '/apps'}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Ver Apps Disponibles
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

// Componente para rutas públicas (login/register)
const PublicRoute = ({ children }) => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/apps" replace />;
  }

  return children;
};

export { PrivateRoute, ProtectedAppRoute, PublicRoute };
export default PrivateRoute;