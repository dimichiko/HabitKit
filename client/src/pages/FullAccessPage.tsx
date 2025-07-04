import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../shared/components/Header';
import Footer from '../shared/components/Footer';
import { useUser } from '../shared/context/UserContext';
import { Helmet } from 'react-helmet-async';

const APPS = [
  { id: 'habitkit', name: 'HabitKit', icon: <span className="text-green-500 text-4xl">✅</span>, desc: 'Hábitos diarios', comingSoon: 'Próximamente en móvil' },
  { id: 'invoicekit', name: 'InvoiceKit', icon: <span className="text-yellow-500 text-4xl">📄</span>, desc: 'Facturación simple', comingSoon: 'Próximamente en móvil' },
  { id: 'trainingkit', name: 'TrainingKit', icon: <span className="text-indigo-500 text-4xl">🏋️</span>, desc: 'Entrenamiento', comingSoon: 'Próximamente en móvil' },
  { id: 'caloriekit', name: 'CalorieKit', icon: <span className="text-red-500 text-4xl">🍎</span>, desc: 'Nutrición', comingSoon: 'Próximamente en móvil' },
];

const FullAccessPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  // const [searchParams] = useSearchParams(); // Comentado temporalmente

  useEffect(() => {
    // Si no está logueado, redirigir a login
    if (!user) {
      navigate('/login');
      return;
    }

    // Si está logueado pero no es premium, redirigir a pricing
    if (user.plan !== 'premium' && user.plan !== 'KitFull') {
      navigate('/pricing?upgrade_required=true');
      return;
    }
  }, [user, navigate]);

  // Si no está logueado o no es premium, no renderizar nada
  if (!user || (user.plan !== 'premium' && user.plan !== 'KitFull')) {
    return null;
  }

  const publicNav = [
    { id: 'home', label: '🏠 Inicio', path: '/' },
    { id: 'about', label: 'Nosotros', path: '/about' },
    { id: 'account', label: user ? '👤 Cuenta' : '👤 Login', path: user ? '/account' : '/login' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100">
      <Helmet>
        <title>Full Access - Lifehub</title>
        <meta name="description" content="Acceso completo a todas las aplicaciones de Lifehub. Disfruta de todas las funcionalidades premium." />
      </Helmet>
      
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
      
      <main className="pt-28 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">👑</span>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Acceso Completo Lifehub</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              ¡Gracias por ser usuario Premium! Accede a todas tus aplicaciones desde aquí.
            </p>
          </div>

          {/* Apps Grid */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Tus Aplicaciones</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {APPS.map((app) => (
                <div key={app.id} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    {app.icon}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{app.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{app.desc}</p>
                  <span className="text-xs text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg font-medium">
                    {app.comingSoon}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Features */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 mb-8">
            <div className="text-center mb-6">
              <span className="text-3xl mb-4 block">🌟</span>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Beneficios Premium</h2>
              <p className="text-gray-600">Disfruta de todas las ventajas de tu suscripción</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-4 text-center">
                <span className="text-2xl mb-2 block">🚀</span>
                <h3 className="font-semibold text-gray-900 mb-1">Sin Límites</h3>
                <p className="text-sm text-gray-600">Acceso ilimitado a todas las funciones</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <span className="text-2xl mb-2 block">🔒</span>
                <h3 className="font-semibold text-gray-900 mb-1">Sin Anuncios</h3>
                <p className="text-sm text-gray-600">Experiencia limpia sin interrupciones</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <span className="text-2xl mb-2 block">💬</span>
                <h3 className="font-semibold text-gray-900 mb-1">Soporte Prioritario</h3>
                <p className="text-sm text-gray-600">Atención personalizada cuando la necesites</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Acciones Rápidas</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/account')}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Gestionar Cuenta
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="bg-white text-indigo-600 px-6 py-3 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors font-medium"
              >
                Contactar Soporte
              </button>
              <button
                onClick={() => navigate('/pricing')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium"
              >
                Ver Planes
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FullAccessPage; 