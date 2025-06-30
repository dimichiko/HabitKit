import React from 'react';
import { useUser } from '../shared/context/UserContext';

interface AppAccessGuardProps {
  appName: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
}

interface AppNames {
  [key: string]: string;
}

const AppAccessGuard = ({ 
  appName, 
  children, 
  fallback = null,
  showUpgradePrompt = true 
}: AppAccessGuardProps): React.ReactNode => {
  const { user, hasAppAccess, getPlanFeatures, canUpgradePlan } = useUser();

  // Si no hay usuario, mostrar fallback
  if (!user) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }

  // Verificar acceso a la app
  if (!hasAppAccess(appName)) {
    if (!showUpgradePrompt) {
      return fallback || null;
    }

    const planFeatures = getPlanFeatures();
    const currentPlan = user.plan;
    const appNames: AppNames = {
      habitkit: 'HabitKit',
      invoicekit: 'InvoiceKit', 
      trainingkit: 'TrainingKit',
      caloriekit: 'CalorieKit'
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icono de la app */}
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl text-white font-bold">
              {appName === 'habitkit' && '📝'}
              {appName === 'invoicekit' && '📄'}
              {appName === 'trainingkit' && '💪'}
              {appName === 'caloriekit' && '🍎'}
            </span>
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {appNames[appName] || appName}
          </h1>
          
          <p className="text-gray-600 mb-6">
            Esta aplicación no está disponible en tu plan actual
          </p>

          {/* Plan actual */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-500 mb-1">Plan actual</div>
            <div className="text-lg font-semibold text-gray-800 capitalize">
              {currentPlan}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {planFeatures?.maxApps} app{planFeatures?.maxApps !== 1 ? 's' : ''} disponible{planFeatures?.maxApps !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Apps disponibles */}
          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-3">Apps disponibles en tu plan:</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {user.activeApps?.map((app: string) => (
                <span 
                  key={app}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    app === appName 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {appNames[app] || app}
                </span>
              ))}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3">
            {canUpgradePlan() && (
              <button
                onClick={() => window.location.href = '/pricing'}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
              >
                🚀 Actualizar Plan
              </button>
            )}
            
            <button
              onClick={() => window.location.href = '/apps'}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              ← Volver a Apps
            </button>
          </div>

          {/* Información adicional */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <p className="mb-1">
                <strong>Plan {currentPlan}:</strong> {planFeatures?.maxApps} app{planFeatures?.maxApps !== 1 ? 's' : ''} • 
                {planFeatures?.hasFullHistory ? ' Historial completo' : ' Historial limitado'} • 
                {planFeatures?.hasBackups ? ' Respaldo' : ' Sin respaldo'}
              </p>
              <p>
                Soporte: {planFeatures?.supportLevel === 'priority' ? 'Prioritario' : 
                         planFeatures?.supportLevel === 'email' ? 'Email' : 'Limitado'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si tiene acceso, mostrar el contenido
  return <>{children}</>;
};

export default AppAccessGuard; 