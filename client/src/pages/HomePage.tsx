import React, { useEffect, Suspense, lazy } from 'react';
import Header from '../shared/components/Header';
import Footer from '../shared/components/Footer';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../shared/context/UserContext';
import { FaRocket, FaLock, FaBolt, FaCrown, FaArrowRight } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
// import demoGif from '../assets/demo-kit.gif';
// const demoGif = '/20250623_1149_Favicon Red Kit_simple_compose_01jyeqm8vye66tz4td0a2bc23x.png';
// const [isScrolled, setIsScrolled] = useState(false);
// const apps = [...];
// const testimonials = [...];

// Lazy load de secciones pesadas
const Testimonios = lazy(() => import('../components/HomeTestimonios'));
const Comparativa = lazy(() => import('../components/HomeComparativa'));
const AppsSection = lazy(() => import('../components/HomeAppsSection'));

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const isLogged = !!user;

  // Detectar scroll para sticky header
  useEffect(() => {
    const handleScroll = () => {
      // setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const publicNav = [
    { id: 'home', label: '🏠 Inicio', path: '/' },
    { id: 'pricing', label: '💰 Precios', path: '/pricing' },
    { id: 'about', label: 'Nosotros', path: '/about' },
    { id: 'account', label: isLogged ? '👤 Cuenta' : '👤 Login', path: isLogged ? '/account' : '/login' },
  ];

  // Beneficios visuales
  const whyKit = [
    { icon: <FaRocket className="text-indigo-500 text-2xl" />, title: 'Todo en uno', desc: 'Hábitos, entrenos, facturas y más.' },
    { icon: <FaLock className="text-pink-500 text-2xl" />, title: 'Privacidad real', desc: 'Sin anuncios ni venta de datos.' },
    { icon: <FaBolt className="text-yellow-500 text-2xl" />, title: 'Ultra rápido', desc: 'Apps ligeras, sin distracciones.' },
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
        centerNav={true}
        onNavigate={id => {
          const nav = publicNav.find(n => n.id === id);
          if (nav) {
            navigate(nav.path);
          }
        }}
      />
      
      {/* Banner para usuarios Free */}
      {isLogged && user.plan === 'free' && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 shadow-lg">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaCrown className="text-yellow-300" />
              <span className="text-sm font-medium">Estás en el plan gratuito</span>
            </div>
            <button 
              onClick={() => navigate('/pricing')}
              className="text-sm bg-white text-purple-600 px-4 py-1 rounded-full font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              Descubre Lifehub Full
              <FaArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
      {/* Banner para usuarios Full */}
      {isLogged && user.plan === 'premium' && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-gradient-to-r from-yellow-400 via-pink-400 to-indigo-500 text-white px-4 py-3 shadow-lg">
          <div className="max-w-5xl mx-auto flex items-center justify-center gap-3">
            <FaCrown className="text-yellow-200 text-xl" />
            <span className="text-base font-semibold">¡Bienvenido a Lifehub Full! Disfruta todas las apps sin límites 🚀</span>
          </div>
        </div>
      )}
      <main className={`pt-24 max-w-5xl mx-auto px-4 flex flex-col items-center ${isLogged && (user.plan === 'free' || user.plan === 'premium') ? 'mt-16' : ''}`}>
        {/* HERO VISUAL */}
        <section className="w-full flex-1 flex flex-col items-center justify-center text-center mb-12">
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
            {isLogged ? (
              <>
                <button
                  onClick={() => navigate('/account')}
                  className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200"
                >
                  Ir a mi cuenta
                </button>
                <button
                  onClick={() => navigate('/apps')}
                  className="bg-white border-2 border-indigo-400 text-indigo-700 px-8 py-4 rounded-xl text-lg font-bold shadow hover:bg-indigo-50 hover:scale-105 transition-all duration-200"
                >
                  Explorar apps
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/register')}
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
              </>
            )}
          </motion.div>
          {/* Imagen/ilustración hero eliminada */}
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
            <AppsSection onAppClick={(appPath: string) => {
              if (!isLogged) {
                navigate('/register');
              } else {
                navigate(appPath);
              }
            }} />
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
        {/* ...resto de la landing... */}
      </main>
      <Footer />
    </div>
  );
};

export default HomePage; 