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

interface PrivateRouteProps {
  children: React.ReactNode;
}

interface ProtectedAppRouteProps {
  children: React.ReactNode;
  appName: string;
  fallbackComponent?: React.ReactNode;
}

interface PublicRouteProps {
  children: React.ReactNode;
}

// Componente para proteger rutas que requieren autenticación
const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, isLoading } = useUser();
  
  // Refrescar actividad cuando se accede a rutas protegidas
  useNavigationWithActivity();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Componente para proteger rutas de apps específicas según el plan
const ProtectedAppRoute = ({ children, appName, fallbackComponent }: ProtectedAppRouteProps) => {
  const { user, isLoading, hasAppAccess } = useUser();
  
  // Refrescar actividad cuando se accede a rutas de apps
  useNavigationWithActivity();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasAppAccess(appName)) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Acceso Restringido</h1>
          <p className="text-gray-600 mb-6">
            No tienes acceso a esta aplicación con tu plan actual. 
            Actualiza tu plan para desbloquear todas las funcionalidades.
          </p>
          <button 
            onClick={() => window.location.href = '/pricing'}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Ver Planes
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Componente para rutas públicas (login/register)
const PublicRoute = ({ children }: PublicRouteProps) => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export { PrivateRoute, ProtectedAppRoute, PublicRoute };
export default PrivateRoute;