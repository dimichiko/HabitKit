import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '../shared/context/UserContext';
import Header from '../shared/components/Header';
import { Helmet } from 'react-helmet-async';

interface Plan {
  id: string;
  name: string;
  price: number;
  annualPrice: number;
  interval: string;
  features: string[];
  popular?: boolean;
  description: string;
}

const APPS = [
  { id: 'habitkit', name: 'HabitKit', icon: '✅', desc: 'Hábitos diarios' },
  { id: 'invoicekit', name: 'InvoiceKit', icon: '📄', desc: 'Facturación simple' },
  { id: 'trainingkit', name: 'TrainingKit', icon: '🏋️', desc: 'Entrenamiento' },
  { id: 'caloriekit', name: 'CalorieKit', icon: '🍎', desc: 'Nutrición' },
];

const PERSONALIZED_PRICING = {
  monthly: [
    { apps: 1, price: 5 },
    { apps: 2, price: 10 },
    { apps: 3, price: 15 },
    { apps: 4, price: 17 },
  ],
  annual: [
    { apps: 1, price: 50 },
    { apps: 2, price: 100 },
    { apps: 3, price: 150 },
    { apps: 4, price: 170 },
  ]
};

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');

  const planParam = searchParams.get('plan');
  const appsParam = searchParams.get('apps');
  const selectedApps = appsParam ? appsParam.split(',') : [];

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      annualPrice: 0,
      interval: 'mes',
      description: 'Elige 1 app para empezar. Siempre puedes actualizar.',
      features: [
        'Acceso completo a 1 app',
        'Sin anuncios',
        'Datos seguros',
        'Soporte básico'
      ]
    },
    {
      id: 'custom',
      name: 'Personalizado',
      price: 5,
      annualPrice: 50,
      interval: 'mes',
      description: 'Selecciona entre 1 a 4 apps',
      features: [
        'Elige las apps que necesitas',
        'Precio por app',
        'Sin anuncios',
        'Soporte prioritario',
        'Backups automáticos'
      ]
    },
    {
      id: 'full',
      name: 'Full Access',
      price: 17,
      annualPrice: 170,
      interval: 'mes',
      description: 'Acceso total a todas las apps sin límites',
      features: [
        'Todas las apps incluidas',
        'Sin anuncios',
        'Soporte prioritario',
        'Backups automáticos',
        'Nuevas apps gratis'
      ],
      popular: true
    }
  ];

  const getPersonalizedPrice = () => {
    const pricing = PERSONALIZED_PRICING[billing];
    const plan = pricing.find(p => p.apps === selectedApps.length) || pricing[0];
    return plan.price;
  };

  const getPlanPrice = (plan: Plan) => {
    if (plan.id === 'custom') {
      return billing === 'monthly' ? getPersonalizedPrice() : getPersonalizedPrice();
    }
    return billing === 'monthly' ? plan.price : plan.annualPrice;
  };

  const selectedPlan = plans.find(plan => plan.id === planParam) || plans[0];

  const handleCheckout = async (): Promise<void> => {
    setLoading(true);
    try {
      // Simular proceso de checkout
      await new Promise(resolve => setTimeout(resolve, 2000));
      navigate('/account');
    } catch (error) {
      console.error('Error en checkout:', error);
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

  // Si no hay plan seleccionado, mostrar mensaje
  if (!planParam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100">
        <Header
          appName="Lifehub"
          appLogo="🌐"
          navigationItems={publicNav}
          currentPage="checkout"
          centerNav={true}
          onNavigate={id => {
            const nav = publicNav.find(n => n.id === id);
            if (nav) navigate(nav.path);
          }}
        />
        <main className="pt-28 pb-12 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Selecciona un plan</h1>
              <p className="text-gray-600 mb-6">
                Para continuar con la compra, primero debes seleccionar un plan desde la página de precios.
              </p>
              <button
                onClick={() => navigate('/pricing')}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Ver planes disponibles
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100">
      <Helmet>
        <title>Finalizar Compra - Lifehub</title>
        <meta name="description" content="Completa tu suscripción a Lifehub y accede a todas las aplicaciones." />
      </Helmet>
      
      <Header
        appName="Lifehub"
        appLogo="🌐"
        navigationItems={publicNav}
        currentPage="checkout"
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
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🛒</span>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Finalizar Compra</h1>
            <p className="text-xl text-gray-600">Completa tu suscripción a Lifehub</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Plan Seleccionado */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-indigo-600">📋</span>
                Plan Seleccionado
              </h2>
              
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 mb-6">
                {selectedPlan.popular && (
                  <div className="text-center mb-4">
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                      Más Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedPlan.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{selectedPlan.description}</p>
                  
                  <div className="text-4xl font-bold text-gray-800 mb-1">
                    ${getPlanPrice(selectedPlan)}
                    <span className="text-base font-normal text-gray-500">/{billing === 'monthly' ? 'mes' : 'año'}</span>
                  </div>
                  
                  {billing === 'annual' && selectedPlan.id !== 'free' && (
                    <p className="text-sm text-green-600 font-medium">
                      Ahorras ${selectedPlan.price * 12 - selectedPlan.annualPrice}
                    </p>
                  )}
                </div>

                {/* Apps seleccionadas para plan personalizado */}
                {selectedPlan.id === 'custom' && selectedApps.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Apps incluidas:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedApps.map(appId => {
                        const app = APPS.find(a => a.id === appId);
                        return app ? (
                          <div key={appId} className="bg-white rounded-lg p-3 border border-indigo-200">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{app.icon}</span>
                              <span className="text-sm font-medium text-gray-700">{app.name}</span>
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                <ul className="space-y-2">
                  {selectedPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-3 mt-0.5">✓</span>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Toggle Mensual/Anual */}
              {selectedPlan.id !== 'free' && (
                <div className="flex justify-center items-center gap-4 mb-6">
                  <span className={`font-bold ${billing === 'monthly' ? 'text-gray-800' : 'text-gray-400'}`}>
                    Mensual
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={billing === 'annual'} 
                      onChange={() => setBilling(billing === 'monthly' ? 'annual' : 'monthly')} 
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-indigo-600 transition-all"></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow transition-all ${billing === 'annual' ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </label>
                  <span className={`font-bold ${billing === 'annual' ? 'text-gray-800' : 'text-gray-400'}`}>
                    Anual <span className="text-xs text-green-600">(ahorra 2 meses)</span>
                  </span>
                </div>
              )}
            </div>

            {/* Resumen de Compra */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-indigo-600">💰</span>
                Resumen de Compra
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Plan seleccionado:</span>
                  <span className="font-semibold text-gray-900">{selectedPlan.name}</span>
                </div>
                
                {selectedPlan.id === 'custom' && selectedApps.length > 0 && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">Apps incluidas:</span>
                    <span className="font-semibold text-gray-900">{selectedApps.length} apps</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Precio {billing === 'monthly' ? 'mensual' : 'anual'}:</span>
                  <span className="font-semibold text-gray-900">${getPlanPrice(selectedPlan)}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Impuestos:</span>
                  <span className="font-semibold text-gray-900">$0.00</span>
                </div>
                
                <div className="flex justify-between items-center py-4 text-lg font-bold bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg px-4">
                  <span>Total {billing === 'monthly' ? 'mensual' : 'anual'}:</span>
                  <span>${getPlanPrice(selectedPlan)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Procesando...
                  </div>
                ) : (
                  'Completar Compra'
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Al completar la compra, aceptas nuestros{' '}
                <button onClick={() => navigate('/terms')} className="text-indigo-600 hover:underline">
                  términos de servicio
                </button>
                {' '}y{' '}
                <button onClick={() => navigate('/privacy')} className="text-indigo-600 hover:underline">
                  política de privacidad
                </button>
              </p>
            </div>
          </div>

          {/* Botón volver */}
          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/pricing')}
              className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2 mx-auto"
            >
              <span>←</span>
              Volver a Planes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;