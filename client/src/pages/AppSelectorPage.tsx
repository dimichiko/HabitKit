import React, { useState, useEffect } from 'react';
import { useUser } from '../shared/context/UserContext';
import PlanStatusBadge from '../components/PlanStatusBadge';
import Header from '../shared/components/Header';

const AppSelectorPage = () => {
  const { user, hasAppAccess, canUpgradePlan, getAvailableApps } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApps = async () => {
      setLoading(true);
      try {
        await getAvailableApps();
      } catch (error) {
        console.error('Error cargando apps:', error);
      } finally {
        setLoading(false);
      }
    };

    loadApps();
  }, [getAvailableApps]);

  // Configuración de apps
  const appConfigs = {
    habitkit: {
      name: 'HabitKit',
      description: 'Gestiona tus hábitos y rutinas diarias',
      icon: '📊',
      color: 'bg-blue-500',
      features: ['Seguimiento de hábitos', 'Estadísticas', 'Recordatorios']
    },
    invoicekit: {
      name: 'InvoiceKit',
      description: 'Crea y gestiona facturas profesionales',
      icon: '📄',
      color: 'bg-green-500',
      features: ['Facturas personalizadas', 'Gestión de clientes', 'Reportes']
    },
    trainingkit: {
      name: 'TrainingKit',
      description: 'Planifica y registra tus entrenamientos',
      icon: '💪',
      color: 'bg-purple-500',
      features: ['Rutinas de ejercicio', 'Seguimiento de progreso', 'Calendario']
    },
    caloriekit: {
      name: 'CalorieKit',
      description: 'Controla tu nutrición y calorías',
      icon: '🍎',
      color: 'bg-orange-500',
      features: ['Registro de comidas', 'Análisis nutricional', 'Objetivos']
    }
  };

  const handleAppClick = (appName: string) => {
    if (hasAppAccess(appName)) {
      window.location.href = `/apps/${appName}`;
    } else {
      // Redirigir a página de upgrade
      window.location.href = `/pricing?apps=${appName}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando aplicaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header appName="Lifehub" />

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tus Aplicaciones
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Accede a todas las herramientas que necesitas para organizar tu vida
          </p>
        </div>

        {/* Plan Status */}
        {user && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Tu Plan Actual</h2>
              <PlanStatusBadge plan={user.plan} />
            </div>
            
            {/* Apps activas */}
            <div className="flex flex-wrap gap-2">
              {user.activeApps?.map((app: string) => (
                <span
                  key={app}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                >
                  {appConfigs[app as keyof typeof appConfigs]?.name || app}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(appConfigs).map(([appKey, config]) => {
            const hasAccess = hasAppAccess(appKey);
            const isActive = user?.activeApps?.includes(appKey);
            
            return (
              <div
                key={appKey}
                className={`bg-white rounded-lg shadow-sm border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                  hasAccess 
                    ? 'border-green-200 hover:border-green-300' 
                    : 'border-gray-200 hover:border-gray-300'
                } ${isActive ? 'ring-2 ring-green-500' : ''}`}
                onClick={() => handleAppClick(appKey)}
              >
                <div className="p-6">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4 ${config.color} text-white`}>
                    {config.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {config.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4">
                    {config.description}
                  </p>
                  
                  {/* Features */}
                  <ul className="space-y-1 mb-4">
                    {config.features.map((feature, index) => (
                      <li key={index} className="text-xs text-gray-500 flex items-center">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    {hasAccess ? (
                      <span className="text-green-600 text-sm font-medium flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Disponible
                      </span>
                    ) : (
                      <span className="text-gray-500 text-sm font-medium flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                        Requiere upgrade
                      </span>
                    )}
                    
                    <button
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        hasAccess
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {hasAccess ? 'Abrir' : 'Upgrade'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Upgrade CTA */}
        {canUpgradePlan() && (
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                ¿Necesitas más aplicaciones?
              </h3>
              <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
                Actualiza tu plan para acceder a todas las aplicaciones y funcionalidades premium
              </p>
              <button
                onClick={() => window.location.href = '/pricing'}
                className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Ver Planes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppSelectorPage; 