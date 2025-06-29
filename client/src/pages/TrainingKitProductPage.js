import React from 'react';
import Header from '../shared/components/Header';

const publicNav = [
  { id: 'home', label: 'Inicio', path: '/' },
  { id: 'trainingkit', label: 'TrainingKit', path: '/trainingkit' },
  { id: 'pricing', label: 'Precios', path: '/pricing' },
  { id: 'about', label: 'Sobre', path: '/about' },
  { id: 'contact', label: 'Contacto', path: '/contact' },
];

const TrainingKitProductPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-white to-indigo-50 flex flex-col items-center px-4 py-12">
    <Header
      appName="Kit"
      appLogo="🟣"
      navigationItems={publicNav}
      currentPage="trainingkit"
      onNavigate={id => {
        const nav = publicNav.find(n => n.id === id);
        if (nav) window.location.href = nav.path;
      }}
    />
    <div className="max-w-2xl w-full text-center mt-12">
      <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-700 mb-2">TrainingKit</h1>
      <p className="text-lg text-gray-600 mb-4">Registra, visualiza y mejora tus entrenamientos día a día.</p>
      <img src="/img/trainingkit-demo.png" alt="Demo TrainingKit" className="mx-auto rounded-xl shadow mb-6 max-w-full" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-indigo-600 mb-2">Beneficios</h2>
          <ul className="text-gray-600 list-disc list-inside text-left">
            <li>Historial y calendario de entrenamientos</li>
            <li>Mapa de ubicaciones y progreso</li>
            <li>Rachas, estadísticas y motivación</li>
            <li>Social: entrena solo o con amigos</li>
          </ul>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-indigo-600 mb-2">Free vs Kit+</h2>
          <ul className="text-gray-600 text-left">
            <li>✅ Free: Registro básico, historial, calendario</li>
            <li>⭐ Kit+: Estadísticas avanzadas, mapas, retos, exportar datos, soporte prioritario</li>
          </ul>
        </div>
      </div>
      <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow hover:bg-indigo-700 transition">Usar TrainingKit</button>
    </div>
  </div>
);

export default TrainingKitProductPage; 