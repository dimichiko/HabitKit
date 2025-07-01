import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../shared/components/Header';
import { useUser } from '../shared/context/UserContext';
import { Helmet } from 'react-helmet-async';

const ServerErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const publicNav = [
    { id: 'home', label: '🏠 Inicio', path: '/' },
    { id: 'pricing', label: '💰 Precios', path: '/pricing' },
    { id: 'about', label: 'Nosotros', path: '/about' },
    { id: 'account', label: user ? '👤 Cuenta' : '👤 Login', path: user ? '/account' : '/login' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100">
      <Helmet>
        <title>Error del servidor - Lifehub</title>
        <meta name="description" content="Ha ocurrido un error interno en el servidor de Lifehub." />
      </Helmet>
      
      <Header
        appName="Lifehub"
        appLogo="🌐"
        navigationItems={publicNav}
        currentPage="500"
        centerNav={true}
        onNavigate={id => {
          const nav = publicNav.find(n => n.id === id);
          if (nav) navigate(nav.path);
        }}
      />
      
      <main className="pt-28 pb-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8">
            {/* Error Icon */}
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">🔥</span>
            </div>
            
            {/* Error Code */}
            <div className="text-8xl font-bold text-gray-300 mb-4">500</div>
            
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Error interno del servidor</h1>
            
            {/* Description */}
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Algo salió mal en nuestros servidores. Nuestro equipo ya está trabajando para solucionarlo.
            </p>
            
            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={() => navigate('/contact')}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200 font-medium"
              >
                Ir a soporte
              </button>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-white text-indigo-600 px-6 py-3 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors font-medium"
                >
                  Intentar de nuevo
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="bg-white text-indigo-600 px-6 py-3 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors font-medium"
                >
                  Volver al inicio
                </button>
              </div>
            </div>
            
            {/* Status Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-blue-900 mb-2">¿Qué puedes hacer?</h3>
                <ul className="text-sm text-blue-800 space-y-1 text-left">
                  <li>• Espera unos minutos e intenta de nuevo</li>
                  <li>• Contacta a nuestro equipo de soporte</li>
                  <li>• Verifica tu conexión a internet</li>
                  <li>• Limpia el caché de tu navegador</li>
                </ul>
              </div>
              
              <p className="text-xs text-gray-500">
                Si el problema persiste, contacta a{' '}
                <a href="mailto:soporte@lifehub.app" className="text-indigo-600 hover:underline">
                  soporte@lifehub.app
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServerErrorPage; 