import React, { useEffect, Suspense, lazy } from 'react';
import Header from '../shared/components/Header';
import Footer from '../shared/components/Footer';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Lazy load de secciones pesadas
const Testimonios = lazy(() => import('../components/HomeTestimonios'));
const Comparativa = lazy(() => import('../components/HomeComparativa'));
const AppsSection = lazy(() => import('../components/HomeAppsSection'));

const HomePage = () => {
  const navigate = useNavigate();

  const publicNav = [
    { id: 'home', label: '🏠 Inicio', path: '/' },
    { id: 'pricing', label: '💰 Precios', path: '/pricing' },
    { id: 'about', label: 'Nosotros', path: '/about' },
  ];

  // Beneficios visuales
  const whyKit = [
    { icon: <span className="text-indigo-500 text-2xl">🚀</span>, title: 'Todo en uno', desc: 'Hábitos, entrenos, facturas y más.' },
    { icon: <span className="text-pink-500 text-2xl">🔒</span>, title: 'Privacidad real', desc: 'Sin anuncios ni venta de datos.' },
    { icon: <span className="text-yellow-500 text-2xl">⚡</span>, title: 'Ultra rápido', desc: 'Apps ligeras, sin distracciones.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 flex flex-col">
      <Helmet>
        <title>Lifehub - Tu vida, tus apps, sin ruido</title>
        <meta name="description" content="Descubre Lifehub: apps para hábitos, entrenos, facturación y más. Todo en un solo lugar, simple y sin distracciones." />
      </Helmet>
      <Header
        appName="Lifehub"
        appLogo="🌐"
        navigationItems={publicNav}
        currentPage="home"
      />
      
      <main className="pt-24 max-w-5xl mx-auto px-4 flex flex-col items-center">
        {/* HERO VISUAL */}
        <section className="w-full flex-1 flex flex-col items-center justify-center text-center mb-12">
          <div className="flex items-center justify-center mb-8">
            <span className="text-6xl mr-4">🚀</span>
            <h1 className="text-5xl font-bold text-gray-800">HabitKit</h1>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl sm:text-6xl font-extrabold text-indigo-700 mb-4 drop-shadow-lg"
          >
            Lifehub: Tu vida, tus apps, <span className="bg-gradient-to-r from-pink-400 to-indigo-500 bg-clip-text text-transparent">sin ruido</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-xl sm:text-2xl text-gray-700 mb-6 max-w-2xl mx-auto"
          >
            Elige solo lo que necesitas: hábitos, entrenos, facturación y más. Sin distracciones, sin anuncios, solo productividad y bienestar.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <button
              onClick={() => navigate('/pricing')}
              className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200"
            >
              Empieza gratis
            </button>
            <button
              onClick={() => document.getElementById('apps-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white border-2 border-indigo-400 text-indigo-700 px-8 py-4 rounded-xl text-lg font-bold shadow hover:bg-indigo-50 hover:scale-105 transition-all duration-200"
            >
              Descubre las apps
            </button>
          </motion.div>
        </section>
        
        {/* BENEFICIOS VISUALES */}
        <section className="w-full max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
          {whyKit.map(b => (
            <motion.div
              key={b.title}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center gap-2 border border-indigo-100 hover:scale-105 transition-transform"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-2">{b.icon}</div>
              <div className="font-bold text-lg text-indigo-700 mb-1">{b.title}</div>
              <div className="text-gray-500 text-sm text-center">{b.desc}</div>
            </motion.div>
          ))}
        </section>
        
        {/* Sección de apps (lazy) */}
        <Suspense fallback={null}>
          <div id="apps-section">
            <AppsSection />
          </div>
        </Suspense>
        
        {/* Comparativa Free vs Full (lazy) */}
        <Suspense fallback={null}>
          <Comparativa />
        </Suspense>
        
        {/* Testimonios (lazy) */}
        <Suspense fallback={null}>
          <Testimonios />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage; 