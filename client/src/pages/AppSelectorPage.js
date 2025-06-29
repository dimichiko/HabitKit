import React, { useState, useEffect } from 'react';
import { useUser } from '../shared/context/UserContext';
import PlanStatusBadge from '../components/PlanStatusBadge';
import { AVAILABLE_APPS } from '../shared/context/UserContext';

const AppSelectorPage = () => {
  const { user, hasAppAccess, getPlanFeatures, canUpgradePlan, getAvailableApps } = useUser();
  const [availableAppsData, setAvailableAppsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppsData = async () => {
      if (user) {
        try {
          const appsData = await getAvailableApps();
          setAvailableAppsData(appsData.availableApps || []);
        } catch (error) {
          console.error('Error cargando apps:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadAppsData();
  }, [user, getAvailableApps]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  const planFeatures = getPlanFeatures();
  const appConfigs = {
    habitkit: {
      name: 'HabitKit',
      description: 'Construye hábitos saludables y productivos',
      icon: '📝',
      color: 'from-green-500 to-emerald-600',
      features: ['Seguimiento de hábitos', 'Estadísticas detalladas', 'Recordatorios', 'Metas personalizadas']
    },
    invoicekit: {
      name: 'InvoiceKit',
      description: 'Gestiona facturas y clientes de forma profesional',
      icon: '📄',
      color: 'from-blue-500 to-cyan-600',
      features: ['Crear facturas', 'Gestionar clientes', 'Reportes financieros', 'Envío automático']
    },
    trainingkit: {
      name: 'TrainingKit',
      description: 'Planifica y registra tus entrenamientos',
      icon: '💪',
      color: 'from-orange-500 to-red-600',
      features: ['Rutinas personalizadas', 'Seguimiento de progreso', 'Calendario de entrenamientos', 'Estadísticas de rendimiento']
    },
    caloriekit: {
      name: 'CalorieKit',
      description: 'Controla tu nutrición y alcanza tus objetivos',
      icon: '🍎',
      color: 'from-purple-500 to-pink-600',
      features: ['Registro de comidas', 'Cálculo de calorías', 'Objetivos nutricionales', 'Análisis de macronutrientes']
    }
  };

  const handleAppClick = (appName) => {
    if (hasAppAccess(appName)) {
      window.location.href = `/apps/${appName}`;
    } else {
      // Mostrar modal de actualización o redirigir a pricing
      window.location.href = '/pricing';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mis Aplicaciones</h1>
              <p className="text-gray-600 mt-1">Accede a todas tus herramientas en un solo lugar</p>
            </div>
            <div className="flex items-center gap-4">
              <PlanStatusBadge variant="detailed" />
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Información del plan */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Plan {user.plan}</h2>
              <p className="text-gray-600">
                {planFeatures?.maxApps} app{planFeatures?.maxApps !== 1 ? 's' : ''} disponible{planFeatures?.maxApps !== 1 ? 's' : ''} • 
                {planFeatures?.hasFullHistory ? ' Historial completo' : ' Historial limitado'} • 
                {planFeatures?.hasBackups ? ' Con respaldo' : ' Sin respaldo'}
              </p>
            </div>
            {canUpgradePlan() && (
              <button
                onClick={() => window.location.href = '/pricing'}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200 transform hover:scale-105"
              >
                🚀 Actualizar Plan
              </button>
            )}
          </div>

          {/* Apps activas */}
          <div className="flex flex-wrap gap-2">
            {user.activeApps?.map(app => (
              <span
                key={app}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
              >
                {appConfigs[app]?.name || app}
              </span>
            ))}
          </div>
        </div>

        {/* Grid de aplicaciones */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando aplicaciones...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(appConfigs).map(([appKey, config]) => {
              const hasAccess = hasAppAccess(appKey);
              const isActive = user.activeApps?.includes(appKey);
              
              return (
                <div
                  key={appKey}
                  className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-200 cursor-pointer group ${
                    hasAccess 
                      ? 'border-transparent hover:border-indigo-200 hover:shadow-md' 
                      : 'border-gray-200 opacity-75'
                  } ${!hasAccess ? 'hover:opacity-100' : ''}`}
                  onClick={() => handleAppClick(appKey)}
                >
                  {/* Header de la app */}
                  <div className={`bg-gradient-to-br ${config.color} p-6 rounded-t-xl relative`}>
                    <div className="text-4xl mb-2">{config.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-1">{config.name}</h3>
                    <p className="text-white/90 text-sm">{config.description}</p>
                    
                    {/* Badge de estado */}
                    <div className="absolute top-4 right-4">
                      {isActive ? (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          Activa
                        </span>
                      ) : hasAccess ? (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          Disponible
                        </span>
                      ) : (
                        <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                          Bloqueada
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Contenido de la app */}
                  <div className="p-6">
                    <div className="space-y-3">
                      {config.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className={`text-sm ${hasAccess ? 'text-green-600' : 'text-gray-400'}`}>
                            {hasAccess ? '✓' : '○'}
                          </span>
                          <span className={`text-sm ${hasAccess ? 'text-gray-700' : 'text-gray-500'}`}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Botón de acción */}
                    <div className="mt-6">
                      {hasAccess ? (
                        <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 transform group-hover:scale-105">
                          Abrir {config.name}
                        </button>
                      ) : (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = '/pricing';
                          }}
                          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg transition duration-200"
                        >
                          Actualizar Plan
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Información adicional */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">¿Necesitas más aplicaciones?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">📈</div>
              <h4 className="font-semibold text-gray-900 mb-2">Plan Individual</h4>
              <p className="text-gray-600 text-sm">1 aplicación especializada con todas las funciones</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🔄</div>
              <h4 className="font-semibold text-gray-900 mb-2">Plan Flexible</h4>
              <p className="text-gray-600 text-sm">2 aplicaciones de tu elección con funciones premium</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">👑</div>
              <h4 className="font-semibold text-gray-900 mb-2">Kit Full</h4>
              <p className="text-gray-600 text-sm">Acceso completo a todas las aplicaciones</p>
            </div>
          </div>
          <div className="text-center mt-6">
            <button
              onClick={() => window.location.href = '/pricing'}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition duration-200"
            >
              Ver Planes y Precios
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppSelectorPage; 