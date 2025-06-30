import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../shared/context/UserContext';

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
  popular?: boolean;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');
  const [loading, setLoading] = useState<boolean>(false);

  const plans: Plan[] = [
    {
      id: 'premium',
      name: 'Plan Premium',
      price: 9.99,
      interval: 'mes',
      features: [
        'Acceso a todas las apps',
        'Sin anuncios',
        'Soporte prioritario',
        'Backups automáticos'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Plan Enterprise',
      price: 29.99,
      interval: 'mes',
      features: [
        'Todo del plan Premium',
        'Integraciones avanzadas',
        'Soporte 24/7',
        'Personalización completa'
      ]
    }
  ];

  const handlePlanSelect = (planId: string): void => {
    setSelectedPlan(planId);
  };

  const handleCheckout = async (): Promise<void> => {
    setLoading(true);
    try {
      // Simular proceso de checkout
      await new Promise(resolve => setTimeout(resolve, 2000));
      navigate('/dashboard');
    } catch (error) {
      console.error('Error en checkout:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedPlanData = plans.find(plan => plan.id === selectedPlan);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Finalizar Compra</h1>
          <p className="text-xl text-gray-600">Completa tu suscripción a Lifehub</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Planes */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Selecciona tu Plan</h2>
            <div className="space-y-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => handlePlanSelect(plan.id)}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPlan === plan.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                    {plan.popular && (
                      <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    ${plan.price}
                    <span className="text-sm font-normal text-gray-500">/{plan.interval}</span>
                  </div>
                  <ul className="space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Resumen de Compra</h2>
            
            {selectedPlanData && (
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Plan seleccionado:</span>
                  <span className="font-semibold">{selectedPlanData.name}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Precio mensual:</span>
                  <span className="font-semibold">${selectedPlanData.price}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Impuestos:</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                
                <div className="flex justify-between items-center py-4 text-lg font-bold">
                  <span>Total mensual:</span>
                  <span>${selectedPlanData.price}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Procesando...' : 'Completar Compra'}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Al completar la compra, aceptas nuestros términos de servicio y política de privacidad
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/pricing')}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Volver a Planes
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;