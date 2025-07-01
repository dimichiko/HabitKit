import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

interface ProtectedAppRouteProps {
  children: React.ReactNode;
  appName: string;
  fallbackComponent?: React.ReactNode;
}

const ProtectedAppRoute: React.FC<ProtectedAppRouteProps> = ({ 
  children, 
  appName, 
  fallbackComponent 
}) => {
  const { user, isLoading, hasAppAccess, isAuthenticated } = useUser();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-pink-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si no tiene acceso a la app, mostrar fallback o página de upgrade
  if (!hasAppAccess(appName)) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-pink-100">
        <div className="max-w-md mx-auto p-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔒</span>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Restringido</h1>
            
            <p className="text-gray-600 mb-6">
              No tienes acceso a <strong>{appName}</strong> con tu plan actual ({user.plan}).
            </p>
            
            <div className="space-y-4">
              <button 
                onClick={() => window.location.href = '/pricing'}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
              >
                Actualizar Plan
              </button>
              
              <button 
                onClick={() => window.location.href = '/apps'}
                className="w-full bg-white text-indigo-600 px-6 py-3 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors font-medium"
              >
                Ver Apps Disponibles
              </button>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Plan actual: <span className="font-medium">{user.plan}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedAppRoute; 