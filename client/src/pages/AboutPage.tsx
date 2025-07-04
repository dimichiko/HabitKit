import React from 'react';
import Header from '../shared/components/Header';
import Footer from '../shared/components/Footer';
// import { useNavigate } from 'react-router-dom'; // Comentado temporalmente

import { Helmet } from 'react-helmet-async';

const AboutPage: React.FC = () => {
  // const navigate = useNavigate(); // Comentado temporalmente
  
  const publicNav = [
    { id: 'home', label: '🏠 Inicio', path: '/' },
    { id: 'pricing', label: '💰 Precios', path: '/pricing' },
    { id: 'about', label: 'Nosotros', path: '/about' },

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 flex flex-col">
      <Helmet>
        <title>Sobre Nosotros - Lifehub</title>
        <meta name="description" content="Conoce el equipo y la misión detrás de Lifehub. Apps modulares para simplificar tu vida digital." />
      </Helmet>
      <Header
        appName="Lifehub"
        appLogo="🌐"
        navigationItems={publicNav}
        currentPage="about"
      />
      <main className="pt-28 max-w-5xl mx-auto px-4 flex flex-col items-center">
        {/* HERO SECTION */}
        <section className="w-full text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-indigo-700 mb-6 drop-shadow-lg">
            Sobre <span className="bg-gradient-to-r from-pink-400 to-indigo-500 bg-clip-text text-transparent">Nosotros</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Construyendo el futuro de la productividad personal con herramientas simples y poderosas
          </p>
        </section>

        {/* MISIÓN Y VISIÓN */}
        <section className="w-full max-w-4xl mx-auto mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-indigo-100 hover:shadow-xl transition-all duration-200">
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Nuestra Misión</h2>
              <p className="text-gray-600 leading-relaxed">
                Crear herramientas intuitivas y poderosas que ayuden a las personas a organizar sus vidas, 
                alcanzar sus metas y maximizar su potencial. Creemos que la tecnología debe simplificar, 
                no complicar.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border border-indigo-100 hover:shadow-xl transition-all duration-200">
              <div className="text-4xl mb-4">🚀</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Nuestra Visión</h2>
              <p className="text-gray-600 leading-relaxed">
                Ser la plataforma líder en gestión personal, ofreciendo un ecosistema completo de 
                aplicaciones que se adapten a las necesidades únicas de cada usuario.
              </p>
            </div>
          </div>
        </section>

        {/* VALORES */}
        <section className="w-full max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-indigo-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Nuestros Valores</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Simplicidad</h3>
                <p className="text-gray-600">Diseñamos interfaces intuitivas que cualquier persona puede usar sin complicaciones</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">🔒</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Privacidad</h3>
                <p className="text-gray-600">Tu información personal está segura y protegida. Tu privacidad es nuestra prioridad</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Innovación</h3>
                <p className="text-gray-600">Siempre buscamos nuevas formas de mejorar tu experiencia y hacer tu vida más fácil</p>
              </div>
            </div>
          </div>
        </section>

        {/* EQUIPO */}
        <section className="w-full max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-indigo-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Nuestro Equipo</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <span className="text-3xl">👨‍💻</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Desarrolladores</h3>
                <p className="text-gray-600">Expertos en crear experiencias digitales excepcionales</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <span className="text-3xl">🎨</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Diseñadores</h3>
                <p className="text-gray-600">Creadores de interfaces hermosas y funcionales</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <span className="text-3xl">💬</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Soporte</h3>
                <p className="text-gray-600">Aquí para ayudarte en cada paso del camino</p>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIOS */}
        <section className="w-full max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Lo que dicen nuestros usuarios</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonios.map((testimonio, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100 hover:shadow-xl transition-all duration-200">
                <p className="text-gray-700 mb-4 italic">"{testimonio.texto}"</p>
                <p className="text-sm font-semibold text-indigo-600">— {testimonio.autor}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage; 