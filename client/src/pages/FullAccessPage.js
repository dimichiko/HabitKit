import React from 'react';
import Header from '../shared/components/Header';
import Footer from '../shared/components/Footer';
import { useUser } from '../shared/context/UserContext';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaFileInvoice, FaDumbbell, FaAppleAlt, FaCrown } from 'react-icons/fa';

const APPS = [
  { id: 'habitkit', name: 'HabitKit', icon: <FaCheckCircle className="text-green-500 text-4xl" />, desc: 'Hábitos diarios', path: '/habitkit' },
  { id: 'invoicekit', name: 'InvoiceKit', icon: <FaFileInvoice className="text-yellow-500 text-4xl" />, desc: 'Facturación simple', path: '/invoicekit' },
  { id: 'trainingkit', name: 'TrainingKit', icon: <FaDumbbell className="text-indigo-500 text-4xl" />, desc: 'Entrenamiento', path: '/trainingkit-app' },
  { id: 'caloriekit', name: 'CalorieKit', icon: <FaAppleAlt className="text-red-500 text-4xl" />, desc: 'Nutrición', path: '/caloriekit' },
];

const FullAccessPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  if (!user || user.plan !== 'KitFull') {
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
          <FaCrown className="text-purple-600 text-3xl" />
          <h1 className="text-3xl font-extrabold text-indigo-700">Acceso rápido Lifehub Full</h1>
        </div>
        <div className="mb-8 text-lg text-gray-700 text-center">¡Gracias por ser usuario Full! Accede a todas tus apps desde aquí.</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
          {APPS.map(app => (
            <button
              key={app.id}
              onClick={() => navigate(app.path)}
              className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-3 hover:scale-105 hover:shadow-2xl transition-all border border-gray-100"
            >
              {app.icon}
              <div className="font-bold text-xl text-indigo-700">{app.name}</div>
              <div className="text-gray-500 text-sm text-center">{app.desc}</div>
            </button>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FullAccessPage; 