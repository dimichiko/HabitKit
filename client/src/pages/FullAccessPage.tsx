import React from 'react';
import Header from '../shared/components/Header';
import Footer from '../shared/components/Footer';
import { useUser } from '../shared/context/UserContext';
import { useNavigate } from 'react-router-dom';

const APPS = [
  { id: 'habitkit', name: 'HabitKit', icon: <span className="text-green-500 text-4xl">✅</span>, desc: 'Hábitos diarios', path: '/habitkit' },
  { id: 'invoicekit', name: 'InvoiceKit', icon: <span className="text-yellow-500 text-4xl">📄</span>, desc: 'Facturación simple', path: '/invoicekit' },
  { id: 'trainingkit', name: 'TrainingKit', icon: <span className="text-indigo-500 text-4xl">🏋️</span>, desc: 'Entrenamiento', path: '/trainingkit-app' },
  { id: 'caloriekit', name: 'CalorieKit', icon: <span className="text-red-500 text-4xl">🍎</span>, desc: 'Nutrición', path: '/caloriekit' },
];

const FullAccessPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  if (!user || user.plan !== 'premium') {
    navigate('/');
    return null;
  }

  const publicNav = [
    { id: 'home', label: '🏠 Inicio', path: '/' },
    { id: 'about', label: 'Nosotros', path: '/about' },
    { id: 'account', label: user ? '👤 Cuenta' : '👤 Login', path: user ? '/account' : '/login' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9fafb] to-indigo-50 font-sans pb-8">
      <Header
        appName="Lifehub"
        appLogo="🌐"
        navigationItems={publicNav}
        currentPage="full"
        centerNav={true}
        onNavigate={id => {
          const nav = publicNav.find(n => n.id === id);
          if (nav) navigate(nav.path);
        }}
      />
      <main className="pt-28 max-w-4xl mx-auto px-4 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-purple-600 text-3xl">👑</span>
          <h1 className="text-3xl font-extrabold text-indigo-700">Acceso rápido Lifehub Full</h1>
        </div>
        <div className="mb-8 text-lg text-gray-700 text-center">¡Gracias por ser usuario Full! Accede a todas tus apps desde aquí.</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">HabitKit</h3>
            <p className="text-sm text-gray-600">Construye hábitos saludables</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📄</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">InvoiceKit</h3>
            <p className="text-sm text-gray-600">Facturación profesional</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏋️</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">TrainingKit</h3>
            <p className="text-sm text-gray-600">Entrenamiento personalizado</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🍎</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">CalorieKit</h3>
            <p className="text-sm text-gray-600">Control nutricional</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-xl mb-8">
          <div className="flex items-center justify-center mb-4">
            <span className="text-purple-600 text-3xl mr-3">👑</span>
            <h2 className="text-2xl font-bold">Acceso Premium Completo</h2>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FullAccessPage; 