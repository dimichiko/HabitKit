import React from 'react';
import Header from '../shared/components/Header';
import Footer from '../shared/components/Footer';
import { Helmet } from 'react-helmet-async';

const NotFoundPage: React.FC = () => {
  const publicNav = [
    { id: 'home', label: '🏠 Inicio', path: '/' },
    { id: 'pricing', label: '💰 Precios', path: '/pricing' },
    { id: 'about', label: 'Nosotros', path: '/about' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 flex flex-col">
      <Helmet>
        <title>Página no encontrada - Lifehub</title>
        <meta name="description" content="La página que buscas no existe. Regresa al inicio de Lifehub." />
      </Helmet>
      <Header
        appName="Lifehub"
        appLogo="🌐"
        navigationItems={publicNav}
        currentPage="404"
      />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-8xl mb-6">😕</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Página no encontrada</h1>
          <p className="text-lg text-gray-600 mb-8">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
          <a
            href="/"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Volver al inicio
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFoundPage; 