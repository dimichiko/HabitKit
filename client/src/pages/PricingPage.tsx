import React, { useState, useEffect } from 'react';
import Header from '../shared/components/Header';
import Footer from '../shared/components/Footer';
import { useUser } from '../shared/context/UserContext';
import { useNavigate } from 'react-router-dom';
import apiClient from '../apps/habitkit/utils/api';
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

const PricingPage: React.FC = () => {
  const { user, updateUser } = useUser();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: '', email: '', photo: '' });
  const [selectedPlan, setSelectedPlan] = useState<string>('free');
  const [selectedApps, setSelectedApps] = useState<string[]>(['habitkit']);
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

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
      id: 'personalized',
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

  useEffect(() => {
    if (user) {
      setProfile({ name: user.name, email: user.email, photo: user.avatar || '' });
    }
  }, [user]);

  const handleToggleApp = (appId: string) => {
    if (selectedApps.includes(appId)) {
      if (selectedApps.length > 1) {
        setSelectedApps(selectedApps.filter(id => id !== appId));
      }
    } else {
      if (selectedApps.length < 4) {
        setSelectedApps([...selectedApps, appId]);
      }
    }
  };

  const getPersonalizedPrice = () => {
    const pricing = PERSONALIZED_PRICING[billing];
    const plan = pricing.find(p => p.apps === selectedApps.length) || pricing[0];
    return plan.price;
  };

  // const handlePlanSelect = (planId: string): void => {
  //   setSelectedPlan(planId);
  //   if (planId === 'free') {
  //     setSelectedApps(['habitkit']);
  //   }
  // };

  const handlePlanChange = async () => {
    setLoading(true);
    setSuccess('');
    setError('');
    
    try {
      let planData;
      if (selectedPlan === 'personalized') {
        planData = { plan: 'personalized', activeApps: selectedApps };
      } else {
        planData = { plan: selectedPlan };
      }
      
      const { data } = await apiClient.put('/auth/plan', planData);
      if (updateUser) updateUser(data);
      setSuccess('¡Plan actualizado correctamente!');
    } catch {
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

  const getPlanPrice = (plan: Plan) => {
    if (plan.id === 'personalized') {
      return billing === 'monthly' ? getPersonalizedPrice() : getPersonalizedPrice();
    }
    return billing === 'monthly' ? plan.price : plan.annualPrice;
  };

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
      <main className="pt-28 max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4 text-center">Precios</h1>
        <p className="text-center mb-8 text-lg text-gray-600">
          Elige el plan que mejor se adapte a ti
        </p>
        
        {user && (
          <div className="bg-white rounded-2xl shadow p-4 mb-8 flex items-center gap-4 max-w-md mx-auto">
            <img
              src={profile.photo || `https://ui-avatars.com/api/?name=${profile.name || 'U'}&background=indigo&color=fff`}
              alt="Avatar"
              className="w-12 h-12 rounded-full shadow"
            />
            <div>
              <div className="font-bold text-gray-800">{profile.name || 'Sin nombre'}</div>
              <div className="text-gray-500 text-sm">{profile.email || 'Sin email'}</div>
            </div>
          </div>
        )}

        {/* Toggle Mensual/Anual */}
        <div className="flex justify-center items-center gap-4 mb-12">
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

        {/* Planes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-lg p-8 border-2 transition-all duration-200 hover:shadow-xl ${
                selectedPlan === plan.id ? 'border-indigo-500 shadow-indigo-100' : 'border-gray-100'
              } ${plan.popular ? 'ring-2 ring-indigo-200' : ''}`}
            >
              {plan.popular && (
                <div className="text-center mb-4">
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                    Más Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                
                <div className="text-4xl font-bold text-gray-800 mb-1">
                  ${getPlanPrice(plan)}
                  <span className="text-base font-normal text-gray-500">/{billing === 'monthly' ? 'mes' : 'año'}</span>
                </div>
                
                                 {billing === 'annual' && plan.id !== 'free' && (
                   <p className="text-sm text-green-600 font-medium">
                     Ahorras ${plan.price * 12 - plan.annualPrice}
                   </p>
                 )}
              </div>

              {/* Selector de apps para plan personalizado */}
              {plan.id === 'personalized' && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Selecciona tus apps:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {APPS.map(app => (
                      <button
                        key={app.id}
                        onClick={() => handleToggleApp(app.id)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedApps.includes(app.id)
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{app.icon}</span>
                          <span className="text-sm font-medium text-gray-700">{app.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {selectedApps.length} de 4 apps seleccionadas
                  </p>
                </div>
              )}

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-3 mt-0.5">✓</span>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  if (plan.id === 'free') {
                    navigate('/checkout?plan=free');
                  } else if (plan.id === 'personalized') {
                    const appsParam = selectedApps.join(',');
                    navigate(`/checkout?plan=custom&apps=${appsParam}`);
                  } else if (plan.id === 'full') {
                    navigate('/checkout?plan=full');
                  }
                }}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                  selectedPlan === plan.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {selectedPlan === plan.id ? 'Seleccionado' : 'Seleccionar'}
              </button>
            </div>
          ))}
        </div>

        {/* Botón de actualizar plan */}
        {user && (
          <div className="text-center mb-8">
            <button
              onClick={handlePlanChange}
              disabled={loading}
              className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Actualizando...' : 'Actualizar Plan'}
            </button>
            {success && <p className="text-green-600 mt-2">{success}</p>}
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </div>
        )}

        {/* Texto inferior */}
        <div className="text-center text-gray-600 max-w-2xl mx-auto">
          <p className="text-lg font-medium">
            Prueba gratis una app. En pocos días, vas a querer desbloquearlas todas.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage; 