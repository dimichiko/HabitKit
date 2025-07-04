import React, { useState } from 'react';
import Header from '../shared/components/Header';
import Footer from '../shared/components/Footer';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
      
      // Simular actualización de plan
      setTimeout(() => {
        setSuccess('¡Plan actualizado correctamente!');
      }, 1000);
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
      />
      <main className="pt-28 max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4 text-center">Precios</h1>
        <p className="text-center mb-8 text-lg text-gray-600">
          Elige el plan que mejor se adapte a ti
        </p>
        
        {/* Toggle de facturación */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billing === 'monthly' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setBilling('annual')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billing === 'annual' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Anual
              <span className="ml-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Planes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-lg p-8 relative ${
                plan.popular ? 'ring-2 ring-indigo-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Más Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-indigo-600">
                    ${getPlanPrice(plan)}
                  </span>
                  <span className="text-gray-500">/{billing === 'monthly' ? 'mes' : 'año'}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-3">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate('/pricing')}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  plan.popular
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {plan.id === 'free' ? 'Comenzar gratis' : 'Elegir plan'}
              </button>
            </div>
          ))}
        </div>

        {/* Apps disponibles */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Apps disponibles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {APPS.map((app) => (
              <div
                key={app.id}
                className="text-center p-4 rounded-lg border border-gray-200"
              >
                <span className="text-3xl mb-3 block">{app.icon}</span>
                <h3 className="font-semibold text-gray-800 mb-1">{app.name}</h3>
                <p className="text-sm text-gray-600">{app.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage; 