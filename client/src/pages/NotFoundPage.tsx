import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../shared/components/Header';
import { useUser } from '../shared/context/UserContext';
import { Helmet } from 'react-helmet-async';

const NotFoundPage: React.FC = () => {
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
        <title>Página no encontrada - Lifehub</title>
        <meta name="description" content="La página que estás buscando no existe en Lifehub." />
      </Helmet>
      
      <Header
        appName="Lifehub"
        appLogo="🌐"
        navigationItems={publicNav}
        currentPage="404"
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
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">😵</span>
            </div>
            
            {/* Error Code */}
            <div className="text-8xl font-bold text-gray-300 mb-4">404</div>
            
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Página no encontrada</h1>
            
            {/* Description */}
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              La página que estás buscando no existe o ha sido movida a otra ubicación.
            </p>
            
            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium"
              >
                Volver al inicio
              </button>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/pricing')}
                  className="bg-white text-indigo-600 px-6 py-3 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors font-medium"
                >
                  Ver planes
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="bg-white text-indigo-600 px-6 py-3 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors font-medium"
                >
                  Contactar soporte
                </button>
              </div>
            </div>
            
            {/* Helpful Links */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">Páginas populares:</p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => navigate('/about')}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  Sobre nosotros
                </button>
                <button
                  onClick={() => navigate('/pricing')}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  Precios
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  Contacto
                </button>
                <button
                  onClick={() => navigate('/terms')}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  Términos
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFoundPage; 