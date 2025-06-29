import React from 'react';
import Header from '../shared/components/Header';
import Footer from '../shared/components/Footer';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../shared/context/UserContext';
import { Helmet } from 'react-helmet-async';

const AboutPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  
  const publicNav = [
    { id: 'home', label: '🏠 Inicio', path: '/' },
    { id: 'pricing', label: '💰 Precios', path: '/pricing' },
    { id: 'about', label: 'Nosotros', path: '/about' },
    { id: 'account', label: user ? '👤 Cuenta' : '👤 Login', path: user ? '/account' : '/login' },
  ];

  const apps = [
    {
      name: 'InvoiceKit',
      icon: '📦',
      desc: 'Crea y envía facturas simples.',
      color: 'bg-yellow-100',
    },
    {
      name: 'TrainingKit',
      icon: '🏋️',
      desc: 'Planifica tus entrenamientos diarios.',
      color: 'bg-green-100',
    },
    {
      name: 'CalorieKit',
      icon: '🔥',
      desc: 'Lleva control de tus calorías fácilmente.',
      color: 'bg-red-100',
    },
    {
      name: 'HabitKit',
      icon: '🧱',
      desc: 'Construye hábitos que duran.',
      color: 'bg-blue-100',
    },
  ];
  
  const testimonios = [
    { texto: '"Kit me ayudó a organizar mi vida y ser más productivo."', autor: 'María, emprendedora' },
    { texto: '"Las apps son simples, útiles y sin distracciones. ¡Perfecto!"', autor: 'Carlos, freelancer' },
    { texto: '"Me encanta tener todo en un solo lugar y sin anuncios."', autor: 'Lucía, estudiante' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col">
      <Helmet>
        <title>Sobre Lifehub</title>
        <meta name="description" content="Conoce el equipo y la misión detrás de Lifehub. Apps modulares para simplificar tu vida digital." />
      </Helmet>
      <Header
        appName="Lifehub"
        appLogo="🌐"
        navigationItems={publicNav}
        currentPage="about"
        centerNav={true}
        onNavigate={id => {
          const nav = publicNav.find(n => n.id === id);
          if (nav) {
            window.location.href = nav.path;
          }
        }}
      />
      <div className="max-w-3xl w-full text-center mt-12 mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-700 mb-4">Sobre Lifehub</h1>
        <p className="text-lg text-gray-600 mb-6">Lifehub nació para simplificar tu vida digital. Apps útiles, sin ruido, sin anuncios.</p>
        {/* Apps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {apps.map(app => (
            <div key={app.name} className={`rounded-xl shadow-md p-6 flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-xl ${app.color}`}> 
              <div className="text-4xl mb-2">{app.icon}</div>
              <div className="font-bold text-lg text-indigo-700 mb-1">{app.name}</div>
              <div className="text-gray-700 text-sm">{app.desc}</div>
            </div>
          ))}
        </div>
        {/* CTA */}
        <button
          onClick={() => navigate('/pricing')}
          className="mt-2 mb-8 px-8 py-3 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-700 transition-colors text-lg"
        >
          👉 Explora las apps de Lifehub
        </button>
        {/* Modelo todo incluido */}
        <div className="bg-indigo-100 rounded-xl p-4 mb-8 shadow text-indigo-800 font-semibold">
          <span className="text-xl">Una sola suscripción. Acceso total a todas las microapps de Lifehub.</span>
        </div>
        {/* Testimonios */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-indigo-600 mb-2">Testimonios</h2>
          <div className="flex flex-col gap-3">
            {testimonios.map((t, i) => (
              <div key={i} className="italic text-gray-700">{t.texto} <span className="not-italic text-indigo-500 font-semibold">— {t.autor}</span></div>
            ))}
          </div>
        </div>
        {/* Historia y misión */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-indigo-600 mb-2">Nuestra historia</h2>
            <p className="text-gray-600">Lifehub fue creado por un desarrollador apasionado por la productividad y el diseño simple. La misión: que puedas organizar tu vida con microapps realmente útiles y sin distracciones.</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-indigo-600 mb-2">Misión</h2>
            <p className="text-gray-600">Apps minimalistas, útiles y sin complicaciones. Queremos que Lifehub sea tu espacio digital favorito para crecer, crear y lograr tus metas.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage; 