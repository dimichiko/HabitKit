import React, { useState, useEffect } from 'react';
import Header from '../shared/components/Header';
import Footer from '../shared/components/Footer';
import { useUser } from '../shared/context/UserContext';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaCrown, FaAppleAlt, FaDumbbell, FaFileInvoice } from 'react-icons/fa';
import apiClient from '../apps/habitkit/utils/api';
import { Helmet } from 'react-helmet-async';

const APPS = [
  { id: 'habitkit', name: 'HabitKit', icon: <FaCheckCircle className="text-blue-500" />, desc: 'Hábitos diarios', badge: '✅ Hábitos' },
  { id: 'invoicekit', name: 'InvoiceKit', icon: <FaFileInvoice className="text-yellow-500" />, desc: 'Facturación simple', badge: '💰 Facturación' },
  { id: 'trainingkit', name: 'TrainingKit', icon: <FaDumbbell className="text-green-500" />, desc: 'Entrenamiento', badge: '🏋️ Entrena' },
  { id: 'caloriekit', name: 'CalorieKit', icon: <FaAppleAlt className="text-red-500" />, desc: 'Nutrición', badge: '🍎 Nutrición' },
];

const FLEX_PRICING = [
  { apps: 1, price: 5, ahorro: 0 },
  { apps: 2, price: 8, ahorro: 2 },
  { apps: 3, price: 10, ahorro: 5 },
  { apps: 4, price: 12, ahorro: 8 },
];

const FLEX_PRICING_ANNUAL = [
  { apps: 1, price: 50, ahorro: 10 },
  { apps: 2, price: 80, ahorro: 20 },
  { apps: 3, price: 100, ahorro: 50 },
  { apps: 4, price: 120, ahorro: 80 },
];

const KITFULL_PRICE = { monthly: 15, annual: 150 };

const PricingPage = () => {
  const { user, updateUser } = useUser();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: '', email: '', photo: '' });
  const [plan, setPlan] = useState('Free');
  const [flexApps, setFlexApps] = useState([]);
  const [billing, setBilling] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setProfile({ name: user.name, email: user.email, photo: user.avatarUrl });
      setPlan(user.plan || 'Free');
      if (user.plan === 'Flexible' && user.activeApps) setFlexApps(user.activeApps);
      else setFlexApps([]);
    }
  }, [user]);

  const handleToggleApp = (id) => {
    if (flexApps.includes(id)) {
      if (flexApps.length > 1) setFlexApps(flexApps.filter(a => a !== id));
    } else {
      if (flexApps.length < 4) setFlexApps([...flexApps, id]);
      else setFlexApps([...flexApps.slice(1), id]);
    }
  };

  const flexPrice = billing === 'monthly'
    ? FLEX_PRICING.find(f => f.apps === flexApps.length) || FLEX_PRICING[0]
    : FLEX_PRICING_ANNUAL.find(f => f.apps === flexApps.length) || FLEX_PRICING_ANNUAL[0];

  const handlePlanChange = async (plan, activeApps) => {
    setLoading(true); setSuccess(''); setError('');
    try {
      const { data } = await apiClient.put('/auth/plan', { plan, activeApps });
      updateUser && updateUser(data);
      setSuccess('¡Plan actualizado!');
    } catch (err) {
      setError('Error al actualizar el plan');
    } finally {
      setLoading(false);
    }
  };

  const publicNav = [
    { id: 'home', label: '🏠 Inicio', path: '/' },
    { id: 'pricing', label: '💰 Precios', path: '/pricing' },
    { id: 'about', label: 'Nosotros', path: '/about' },
    { id: 'account', label: user ? '👤 Cuenta' : '👤 Login', path: user ? '/account' : '/login' },
  ];

  const blockBase = "rounded-xl p-6 flex flex-col items-center border shadow-md transition-all min-h-[420px] justify-between";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col">
      <Helmet>
        <title>Precios - Lifehub</title>
        <meta name="description" content="Consulta los precios de Lifehub y elige el plan que mejor se adapta a tus necesidades. Apps modulares, paga solo por lo que usas." />
      </Helmet>
      <Header
        appName="Lifehub"
        appLogo="🌐"
        navigationItems={publicNav}
        currentPage="pricing"
        centerNav={true}
        onNavigate={id => {
          const nav = publicNav.find(n => n.id === id);
          if (nav) {
            window.location.href = nav.path;
          }
        }}
      />
      <main className="pt-28 max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-4 text-center">Precios</h1>
        <div className="text-center mb-4 text-lg font-semibold text-indigo-600 flex items-center justify-center gap-2">
          <span role="img" aria-label="llave">🔓</span> Elige el plan que mejor se adapte a ti.
        </div>
        {user && (
          <div className="bg-white rounded-2xl shadow p-4 mb-6 flex items-center gap-4">
            <img
              src={profile.photo || `https://ui-avatars.com/api/?name=${profile.name || 'U'}&background=indigo&color=fff`}
              alt="Avatar"
              className="w-14 h-14 rounded-full shadow"
            />
            <div>
              <div className="font-bold text-lg text-indigo-700">{profile.name || 'Sin nombre'}</div>
              <div className="text-gray-500 text-sm">{profile.email || 'Sin email'}</div>
              <div className="mt-1 text-xs text-indigo-500 font-semibold">Plan actual: {plan}</div>
            </div>
          </div>
        )}
        <div className="flex justify-center items-center gap-4 mb-8">
          <span className={`font-bold ${billing==='monthly'?'text-indigo-700':'text-gray-400'}`}>Mensual</span>
          <label className="relative inline-flex items-center cursor-pointer" aria-label="Cambiar entre facturación mensual y anual">
            <input type="checkbox" checked={billing==='annual'} onChange={()=>setBilling(billing==='monthly'?'annual':'monthly')} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-green-400 transition-all"></div>
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow transition-all ${billing==='annual'?'translate-x-5':'translate-x-0'}`}></div>
          </label>
          <span className={`font-bold ${billing==='annual'?'text-green-700':'text-gray-400'}`}>Anual <span className="text-xs">(ahorra 2 meses)</span></span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {/* Plan Free */}
          <div className={`${blockBase} border-blue-200 bg-blue-50`}>
            <div className="flex flex-col items-center w-full">
              <div className="text-2xl font-bold text-blue-700 mb-2">Plan Free</div>
              <div className="text-3xl font-extrabold mb-2">Gratis para siempre</div>
              <ul className="text-gray-600 mb-4 list-disc list-inside text-left w-full max-w-xs mx-auto">
                <li>📱 1 app básica</li>
                <li>📉 Funciones limitadas</li>
                <li>📢 Con anuncios</li>
                <li>❌ Sin backups</li>
              </ul>
            </div>
            <button className="mt-4 px-4 py-2 rounded-lg font-semibold w-full bg-blue-600 text-white hover:bg-blue-700 transition" onClick={() => handlePlanChange('Free', [APPS[0].id])} disabled={loading}>Seguir con plan Free</button>
          </div>
          {/* Personaliza tu Kit */}
          <div className={`${blockBase} border-yellow-200 bg-yellow-50`}>
            <div className="flex flex-col items-center w-full">
              <div className="text-2xl font-bold text-yellow-700 mb-2">Personaliza tu Kit</div>
              <div className="mb-2 text-lg font-semibold text-yellow-700">Elige 1, 2, 3 o 4 apps</div>
              {/* Grid compacto de apps */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                {APPS.map(app => (
                  <button
                    key={app.id}
                    title={app.name}
                    className={`flex flex-col items-center px-2 py-1 rounded-lg border-2 transition-all duration-200 font-semibold text-xs ${flexApps.includes(app.id) ? 'border-yellow-600 bg-white scale-105 shadow-lg' : 'border-gray-200 bg-gray-50 opacity-60'}`}
                    onClick={e => { e.stopPropagation(); handleToggleApp(app.id); }}
                  >
                    <span className="text-lg mb-0.5">{app.icon}</span>
                    <span className="font-bold text-gray-800">{app.name}</span>
                  </button>
                ))}
              </div>
              <div className="text-2xl font-extrabold text-yellow-700 mb-1">${flexPrice.price}<span className="text-base font-normal">/{billing==='monthly'?'mes':'año'}</span></div>
              <div className="text-sm text-yellow-700 mb-1">Estás pagando ${flexPrice.price}/{billing==='monthly'?'mes':'año'} por {flexApps.length||1} app{flexApps.length===1?'':'s'}</div>
              {flexPrice.ahorro > 0 && (
                <div className="text-green-700 font-semibold mb-2 text-xs">Ahorro de ${flexPrice.ahorro} comparado al pago individual</div>
              )}
              <ul className="text-gray-600 mb-4 list-disc list-inside text-left w-full max-w-xs mx-auto">
                <li>🧩 Apps completas seleccionadas</li>
                <li>🚫 Sin anuncios</li>
                <li>☁️ Backups</li>
                <li>📧 Soporte por email</li>
              </ul>
            </div>
            <button
              className="mt-4 px-4 py-2 rounded-lg font-semibold w-full bg-yellow-500 text-white hover:bg-yellow-600 transition"
              onClick={() => navigate(`/checkout?plan=flexible&apps=${flexApps.length?flexApps.join(','):[APPS[0].id]}&billing=${billing}&email=${encodeURIComponent(profile.email)}`)}
              disabled={loading || flexApps.length===0}
            >
              Ir a Checkout
            </button>
          </div>
          {/* Kit Full */}
          <div className={`${blockBase} border-green-300 bg-green-50`}>
            <div className="flex flex-col items-center w-full">
              <div className="flex items-center gap-2 mb-2">
                <FaCrown className="text-green-600 text-2xl" />
                <span className="text-2xl font-bold text-green-700">Kit Full</span>
              </div>
              <div className="mb-2 text-lg font-semibold text-green-700">Acceso total a todas las apps</div>
              <div className="text-2xl font-extrabold text-green-700 mb-1">${billing==='monthly'?KITFULL_PRICE.monthly:KITFULL_PRICE.annual}<span className="text-base font-normal">/{billing==='monthly'?'mes':'año'}</span></div>
              <ul className="text-gray-600 mb-4 list-disc list-inside text-left w-full max-w-xs mx-auto">
                <li>🔓 Todas las apps actuales y futuras</li>
                <li>🧠 Funciones exclusivas</li>
                <li>🚫 Sin anuncios</li>
                <li>☁️ Backups automáticos</li>
                <li>⭐ Soporte prioritario</li>
                <li>🔄 Integraciones cruzadas</li>
              </ul>
            </div>
            <button
              className="mt-4 px-4 py-2 rounded-lg font-semibold w-full bg-green-600 text-white hover:bg-green-700 transition"
              onClick={() => navigate(`/checkout?plan=full&apps=all&billing=${billing}&email=${encodeURIComponent(profile.email)}`)}
              disabled={loading}
            >
              Ir a Checkout
            </button>
          </div>
        </div>
        <div className="mt-10 text-center text-lg font-bold text-indigo-700">¿No estás seguro? Puedes probar gratis y actualizar más tarde.</div>
        {success && <div className="text-green-600 font-semibold mt-2">{success}</div>}
        {error && <div className="text-red-600 font-semibold mt-2">{error}</div>}
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage; 