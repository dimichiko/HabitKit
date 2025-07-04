import React from 'react';
import Header from '../shared/components/Header';
import Footer from '../shared/components/Footer';
import { Helmet } from 'react-helmet-async';

const TrainingKitProductPage: React.FC = () => {
  const publicNav = [
    { id: 'home', label: '🏠 Inicio', path: '/' },
    { id: 'pricing', label: '💰 Precios', path: '/pricing' },
    { id: 'about', label: 'Nosotros', path: '/about' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 flex flex-col">
      <Helmet>
        <title>TrainingKit - Lifehub</title>
        <meta name="description" content="Descubre TrainingKit, la app para gestionar tus entrenamientos y alcanzar tus metas fitness." />
      </Helmet>
      <Header
        appName="Lifehub"
        appLogo="🌐"
        navigationItems={publicNav}
        currentPage="training-kit"
      />
      <main className="pt-28 max-w-4xl mx-auto px-4 flex-1">
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">🏋️</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">TrainingKit</h1>
          <p className="text-xl text-gray-600">
            Gestiona tus entrenamientos, rastrea tu progreso y alcanza tus metas fitness
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Características principales</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Planificación de entrenamientos
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Seguimiento de progreso
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Estadísticas detalladas
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Recordatorios personalizados
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Ejercicios predefinidos
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Próximamente</h2>
            <p className="text-gray-600 mb-4">
              TrainingKit estará disponible pronto como parte del ecosistema Lifehub. 
              Mientras tanto, puedes explorar nuestras otras aplicaciones.
            </p>
            <a
              href="/pricing"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Ver planes disponibles
            </a>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">¿Por qué TrainingKit?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-bold text-gray-800 mb-2">Progreso visual</h3>
              <p className="text-gray-600 text-sm">
                Ve tu evolución con gráficos y estadísticas detalladas
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-bold text-gray-800 mb-2">Metas claras</h3>
              <p className="text-gray-600 text-sm">
                Define objetivos específicos y rastrea tu camino hacia ellos
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">⏰</div>
              <h3 className="font-bold text-gray-800 mb-2">Recordatorios</h3>
              <p className="text-gray-600 text-sm">
                Nunca más te olvides de entrenar con notificaciones inteligentes
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TrainingKitProductPage; 