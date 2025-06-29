import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './shared/context/UserContext';
import Header from './shared/components/Header';

const AppSelectorPage = () => {
  const navigate = useNavigate();
  const { user, logout, hasAppAccess } = useUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBackToLanding = () => {
    navigate('/');
  };

  const apps = [
    {
      id: 'habitkit',
      name: 'HabitKit',
      description: 'Construye hábitos que duran para siempre',
      icon: '✅',
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      hoverColor: 'hover:bg-green-100',
      path: '/habitkit',
    },
    {
      id: 'caloriekit',
      name: 'CalorieKit',
      description: 'Controla tus calorías y nutrición fácilmente',
      icon: '🍎',
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      hoverColor: 'hover:bg-orange-100',
      path: '/caloriekit',
    },
    {
      id: 'invoicekit',
      name: 'InvoiceKit',
      description: 'Facturación simple y profesional',
      icon: '🧾',
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      hoverColor: 'hover:bg-blue-100',
      path: '/invoicekit',
    },
    {
      id: 'trainingkit',
      name: 'TrainingKit',
      description: 'Registra y visualiza tus entrenamientos',
      icon: '🏋️‍♂️',
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      hoverColor: 'hover:bg-purple-100',
      path: '/trainingkit-app',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4 pt-20">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight">
              Tus herramientas, en un solo lugar
            </h1>
            <p className="text-xl text-gray-600 mb-2">🧰</p>
            <p className="text-lg text-gray-600">
              Elige la app que necesites para organizar tu vida
            </p>
          </div>

          {/* Grid de Apps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {apps.map(app => {
              const hasAccess = hasAppAccess(app.id);
              
              return (
                <button
                  key={app.id}
                  className={`relative rounded-xl border-2 transition-all duration-200 w-full text-left ${
                    hasAccess 
                      ? `${app.borderColor} ${app.bgColor} ${app.hoverColor} hover:shadow-lg hover:scale-105 cursor-pointer` 
                      : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                  }`}
                  onClick={hasAccess ? () => navigate(app.path) : undefined}
                  disabled={!hasAccess}
                >
                  {/* Badge de plan requerido */}
                  {!hasAccess && (
                    <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      🔒 Pro
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 ${app.color} rounded-xl flex items-center justify-center text-2xl text-white shadow-lg`}>
                        {app.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{app.name}</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">{app.description}</p>
                        {hasAccess ? (
                          <span className={`inline-block px-4 py-2 ${app.color} text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200`}>
                            Entrar
                          </span>
                        ) : (
                          <span className="inline-block px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold shadow-md hover:bg-purple-600 transition-all duration-200">
                            Ver Plan Pro
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Card "Próximamente" */}
            <div className="rounded-xl border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-2xl text-white shadow-lg">
                  🔮
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Más microapps en camino</h3>
                  
                </div>
              </div>
            </div>

            {/* Card "Ideas y Sugerencias" */}
            <button 
              className="rounded-xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 w-full text-left"
              onClick={() => navigate('/ideas')}
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-2xl text-white shadow-lg">
                  💡
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Ideas y Sugerencias</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Comparte tus ideas para mejorar Lifehub. Vota por las mejores sugerencias de la comunidad.
                  </p>
                  <span className="inline-block px-4 py-2 bg-indigo-500 text-white rounded-lg font-semibold shadow-md hover:bg-indigo-600 transition-all duration-200">
                    Ver Ideas
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Botón Volver */}
          <div className="text-center">
            <button
              onClick={handleBackToLanding}
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
            >
              <span className="text-xl">🏠</span>
              Volver al Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppSelectorPage; 