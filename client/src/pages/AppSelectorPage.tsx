import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../shared/context/UserContext';
import PlanStatusBadge from '../components/PlanStatusBadge';
import Header from '../shared/components/Header';

interface App {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  path: string;
  available: boolean;
}

const AppSelectorPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, hasAppAccess, canUpgradePlan, getAvailableApps } = useUserContext();
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  const apps: App[] = [
    {
      id: 'habitkit',
      name: 'HabitKit',
      description: 'Construye hábitos positivos y rastrea tu progreso diario',
      icon: '✅',
      color: 'bg-blue-500',
      path: '/apps/habitkit',
      available: true
    },
    {
      id: 'invoicekit',
      name: 'InvoiceKit',
      description: 'Gestiona facturas y clientes de forma profesional',
      icon: '📄',
      color: 'bg-yellow-500',
      path: '/apps/invoicekit',
      available: true
    },
    {
      id: 'trainingkit',
      name: 'TrainingKit',
      description: 'Planifica y registra tus entrenamientos físicos',
      icon: '💪',
      color: 'bg-green-500',
      path: '/apps/trainingkit',
      available: true
    },
    {
      id: 'caloriekit',
      description: 'Controla tu nutrición y alcanza tus objetivos de peso',
      name: 'CalorieKit',
      icon: '🍎',
      color: 'bg-red-500',
      path: '/apps/caloriekit',
      available: true
    }
  ];

  const handleAppSelect = (app: App): void => {
    if (app.available && hasAppAccess(app.id)) {
      setSelectedApp(app.id);
      navigate(app.path);
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
          <p className="mt-4 text-gray-600">Cargando...</p>
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
                  {app}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {apps.map((app) => (
            <div
              key={app.id}
              onClick={() => handleAppSelect(app)}
              className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 ${
                !app.available || !hasAppAccess(app.id) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className={`w-16 h-16 ${app.color} rounded-lg flex items-center justify-center text-2xl text-white mb-4 mx-auto`}>
                {app.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">{app.name}</h3>
              <p className="text-gray-600 text-center text-sm">{app.description}</p>
              
              {!app.available && (
                <div className="mt-4 text-center">
                  <span className="text-sm text-gray-500">Próximamente</span>
                </div>
              )}
              
              {app.available && !hasAppAccess(app.id) && (
                <div className="mt-4 text-center">
                  <span className="text-sm text-red-500">Actualiza tu plan</span>
                </div>
              )}
            </div>
          ))}
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