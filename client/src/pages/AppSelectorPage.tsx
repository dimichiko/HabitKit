import React from 'react';
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
  comingSoon: string;
}

const AppSelectorPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useUserContext();

  const apps: App[] = [
    {
      id: 'habitkit',
      name: 'HabitKit',
      description: 'Construye hábitos positivos y rastrea tu progreso diario',
      icon: '✅',
      color: 'bg-blue-500',
      comingSoon: 'Próximamente en móvil'
    },
    {
      id: 'invoicekit',
      name: 'InvoiceKit',
      description: 'Gestiona facturas y clientes de forma profesional',
      icon: '📄',
      color: 'bg-yellow-500',
      comingSoon: 'Próximamente en móvil'
    },
    {
      id: 'trainingkit',
      name: 'TrainingKit',
      description: 'Planifica y registra tus entrenamientos físicos',
      icon: '💪',
      color: 'bg-green-500',
      comingSoon: 'Próximamente en móvil'
    },
    {
      id: 'caloriekit',
      description: 'Controla tu nutrición y alcanza tus objetivos de peso',
      name: 'CalorieKit',
      icon: '🍎',
      color: 'bg-red-500',
      comingSoon: 'Próximamente en móvil'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100">
      <Header appName="LifeHub" />
      
      <div className="pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tus Aplicaciones
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Próximamente disponibles en dispositivos móviles
          </p>
        </div>

        {/* Plan Status */}
        {user && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Tu Plan Actual</h2>
              <PlanStatusBadge plan={user.plan} />
            </div>
            
            <div className="text-center">
              <p className="text-gray-600">
                Estamos trabajando en las versiones móviles de todas las apps
              </p>
            </div>
          </div>
        )}

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {apps.map((app) => (
            <div
              key={app.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
            >
              <div className={`w-16 h-16 ${app.color} rounded-lg flex items-center justify-center text-2xl text-white mb-4 mx-auto`}>
                {app.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">{app.name}</h3>
              <p className="text-gray-600 text-center text-sm mb-4">{app.description}</p>
              
              <div className="text-center">
                <span className="text-xs text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full font-medium">
                  {app.comingSoon}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Info CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
            <h3 className="text-2xl font-bold mb-4">
              ¿Quieres estar al día?
            </h3>
            <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
              Suscríbete para recibir notificaciones cuando las apps móviles estén disponibles
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/contact')}
                className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Contactar
              </button>
              <button
                onClick={() => navigate('/pricing')}
                className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition-all duration-200"
              >
                Ver Planes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSelectorPage; 