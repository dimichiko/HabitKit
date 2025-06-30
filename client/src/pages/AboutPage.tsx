import React from 'react';
import Header from '../shared/components/Header';
import Footer from '../shared/components/Footer';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../shared/context/UserContext';
import { Helmet } from 'react-helmet-async';

const AboutPage: React.FC = () => {
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
    <div className="min-h-screen bg-gray-50 py-12">
      <Helmet>
        <title>Sobre Nosotros</title>
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
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sobre Nosotros</h1>
          <p className="text-xl text-gray-600">Construyendo el futuro de la productividad personal</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Nuestra Misión</h2>
            <p className="text-gray-600 leading-relaxed">
              Crear herramientas intuitivas y poderosas que ayuden a las personas a organizar sus vidas, 
              alcanzar sus metas y maximizar su potencial. Creemos que la tecnología debe simplificar, 
              no complicar.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Nuestra Visión</h2>
            <p className="text-gray-600 leading-relaxed">
              Ser la plataforma líder en gestión personal, ofreciendo un ecosistema completo de 
              aplicaciones que se adapten a las necesidades únicas de cada usuario.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Nuestros Valores</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Simplicidad</h3>
              <p className="text-gray-600">Diseñamos interfaces intuitivas que cualquier persona puede usar</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacidad</h3>
              <p className="text-gray-600">Tu información personal está segura y protegida</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Innovación</h3>
              <p className="text-gray-600">Siempre buscamos nuevas formas de mejorar tu experiencia</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Nuestro Equipo</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">👨‍💻</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Desarrolladores</h3>
              <p className="text-gray-600">Expertos en crear experiencias digitales excepcionales</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Diseñadores</h3>
              <p className="text-gray-600">Creadores de interfaces hermosas y funcionales</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Soporte</h3>
              <p className="text-gray-600">Aquí para ayudarte en cada paso del camino</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage; 