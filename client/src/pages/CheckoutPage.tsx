import React, { useState } from 'react';
import apiClient from '../apps/habitkit/utils/api';
import { useUser } from '../shared/context/UserContext';
import { useNavigate } from 'react-router-dom';

const APPS = [
  { id: 'habitkit', name: 'HabitKit', icon: '✅' },
  { id: 'invoicekit', name: 'InvoiceKit', icon: '🧾' },
  { id: 'trainingkit', name: 'TrainingKit', icon: '🏋️' },
  { id: 'caloriekit', name: 'CalorieKit', icon: '🍎' },
];

const CheckoutPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    lastName: '',
    document: '',
    phone: '',
    coupon: '',
    paymentMethod: 'credit_card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    installments: '1'
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [redeemMsg, setRedeemMsg] = useState('');
  const { user, updateUser } = useUser();
  const navigate = useNavigate();

  // Precios flexibles según cantidad de apps
  const FLEX_PRICING = [
    { apps: 1, price: 5 },
    { apps: 2, price: 8 },
    { apps: 3, price: 12 },
    { apps: 4, price: 15 },
    { apps: 5, price: 17 },
    { apps: 6, price: 19.99 },
  ];

  const getFlexiblePrice = (num: number) => {
    const found = FLEX_PRICING.find(f => f.apps === num);
    return found ? found.price : 19.99;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
    }, 3000);
  };

  const installmentOptions = [
    { value: '1', label: '1x $19.99 sin interés' },
    { value: '3', label: '3x $6.99 sin interés' },
    { value: '6', label: '6x $3.67 sin interés' },
    { value: '12', label: '12x $1.89 sin interés' }
  ];

  // Obtener apps seleccionadas según plan y query params
  const getSelectedApps = (plan: string, apps: string) => {
    if (plan === 'full' || apps === 'all') return APPS;
    const ids = apps.split(',');
    return APPS.filter(a => ids.includes(a.id));
  };

  const location = window.location;
  const params = new URLSearchParams(location.search);
  const plan = params.get('plan') || 'full';
  const apps = params.get('apps') || 'all';

  const selectedApps = getSelectedApps(plan, apps);
  const isFull = plan === 'full' || apps === 'all';
  const basePrice = isFull ? 19.99 : getFlexiblePrice(selectedApps.length);
  const discount = formData.coupon === 'LIFEHUB10' ? 0.1 * basePrice : 
                  formData.coupon === 'BIENVENIDO' ? 0.15 * basePrice : 0;
  const finalPrice = basePrice - discount;

  const handleRedeemCode = async () => {
    if (!formData.coupon.trim()) {
      setRedeemMsg('Por favor ingresa un código');
      return;
    }

    setRedeemLoading(true);
    try {
      const res = await apiClient.post('/auth/redeem-code', { code: formData.coupon, userId: user?.id });
      setRedeemMsg(res.data.message || '¡Código canjeado!');
      if (res.data.type === 'admin') await updateUser({ plan: 'enterprise', role: 'admin' });
      if (res.data.type === 'full') await updateUser({ plan: 'enterprise' });
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err: any) {
      setRedeemMsg(err.response?.data?.message || 'Error al canjear código');
    } finally {
      setRedeemLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Pago aprobado!</h2>
          <p className="text-gray-600 mb-4">Tu suscripción a LifeHub Premium está activa</p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-green-700">
              Recibirás un email de confirmación en los próximos minutos
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Continuar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">LH</span>
            </div>
            <span className="font-semibold text-gray-800">LifeHub</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600 text-sm">Checkout</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              
              {/* Progress Steps */}
              <div className="flex items-center mb-8">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    1
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">Datos</span>
                </div>
                <div className="flex-1 h-px bg-gray-200 mx-4"></div>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    2
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">Pago</span>
                </div>
                <div className="flex-1 h-px bg-gray-200 mx-4"></div>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    3
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">Confirmar</span>
                </div>
              </div>

              {/* Step 1: Personal Data */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Completá tus datos</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="checkout-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input id="checkout-email" type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="tu@email.com" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="checkout-name" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input id="checkout-name" type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      </div>
                      <div>
                        <label htmlFor="checkout-lastName" className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                        <input id="checkout-lastName" type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="checkout-document" className="block text-sm font-medium text-gray-700 mb-1">DNI/CUIT</label>
                        <input id="checkout-document" type="text" name="document" value={formData.document} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="12345678" />
                      </div>
                      <div>
                        <label htmlFor="checkout-phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        <input id="checkout-phone" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="11 1234-5678" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="checkout-coupon" className="block text-sm font-medium text-gray-700 mb-1">Cupón de descuento (opcional)</label>
                      <div className="flex gap-2 items-center mt-2">
                        <input id="checkout-coupon" type="text" name="coupon" value={formData.coupon} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Código promocional" />
                        <button type="button" onClick={handleRedeemCode} disabled={redeemLoading || !formData.coupon} className="bg-green-500 text-white px-3 py-2 rounded-md font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-300">{redeemLoading ? 'Canjeando...' : 'Canjear'}</button>
                      </div>
                      {redeemMsg && <div className={`mt-2 text-sm ${redeemMsg.includes('éxito') || redeemMsg.includes('correctamente') ? 'text-green-600' : 'text-red-600'}`}>{redeemMsg}</div>}
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    disabled={!formData.email || !formData.name || !formData.lastName}
                    className="w-full mt-6 bg-blue-500 text-white py-3 rounded-md font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Continuar
                  </button>
                </div>
              )}

              {/* Step 2: Payment Method */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">¿Cómo querés pagar?</h2>
                  
                  <div className="space-y-4 mb-6">
                    {/* Credit Card */}
                    <label htmlFor="payment-credit-card" className={`block border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      formData.paymentMethod === 'credit_card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`} aria-label="Seleccionar tarjeta de crédito">
                      <div className="flex items-center">
                        <input
                          id="payment-credit-card"
                          type="radio"
                          name="paymentMethod"
                          value="credit_card"
                          checked={formData.paymentMethod === 'credit_card'}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Tarjeta de crédito</span>
                            <div className="flex gap-1">
                              <span className="text-blue-600 text-sm">💳 Visa</span>
                              <span className="text-red-600 text-sm">💳 Mastercard</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">Hasta 12 cuotas sin interés</p>
                        </div>
                      </div>
                    </label>

                    {/* MercadoPago */}
                    <label htmlFor="payment-mercadopago" className={`block border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      formData.paymentMethod === 'mercadopago' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`} aria-label="Seleccionar MercadoPago">
                      <div className="flex items-center">
                        <input
                          id="payment-mercadopago"
                          type="radio"
                          name="paymentMethod"
                          value="mercadopago"
                          checked={formData.paymentMethod === 'mercadopago'}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">MercadoPago</span>
                            <span className="text-blue-500 text-lg">💙</span>
                          </div>
                          <p className="text-sm text-gray-500">Pago rápido y seguro</p>
                        </div>
                      </div>
                    </label>

                    {/* PayPal */}
                    <label htmlFor="payment-paypal" className={`block border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      formData.paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`} aria-label="Seleccionar PayPal">
                      <div className="flex items-center">
                        <input
                          id="payment-paypal"
                          type="radio"
                          name="paymentMethod"
                          value="paypal"
                          checked={formData.paymentMethod === 'paypal'}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">PayPal</span>
                            <span className="text-blue-600 text-lg">🅿️</span>
                          </div>
                          <p className="text-sm text-gray-500">Pago internacional</p>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Credit Card Form */}
                  {formData.paymentMethod === 'credit_card' && (
                    <div className="space-y-4 mb-6">
                      <div>
                        <label htmlFor="card-number" className="block text-sm font-medium text-gray-700 mb-1">Número de tarjeta</label>
                        <input
                          id="card-number"
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="card-expiry" className="block text-sm font-medium text-gray-700 mb-1">Vencimiento</label>
                          <input
                            id="card-expiry"
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <label htmlFor="card-cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                          <input
                            id="card-cvv"
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="123"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="card-name" className="block text-sm font-medium text-gray-700 mb-1">Nombre del titular</label>
                        <input
                          id="card-name"
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Como aparece en la tarjeta"
                        />
                      </div>

                      <div>
                        <label htmlFor="card-installments" className="block text-sm font-medium text-gray-700 mb-1">Cuotas</label>
                        <select
                          id="card-installments"
                          name="installments"
                          value={formData.installments}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {installmentOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-md font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Volver
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 bg-blue-500 text-white py-3 rounded-md font-semibold hover:bg-blue-600 transition-colors"
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {step === 3 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Confirmá tu compra</h2>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-800 mb-2">Datos personales</h3>
                    <p className="text-sm text-gray-600">{formData.name} {formData.lastName}</p>
                    <p className="text-sm text-gray-600">{formData.email}</p>
                    <p className="text-sm text-gray-600">{formData.document}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-800 mb-2">Método de pago</h3>
                    <p className="text-sm text-gray-600">
                      {formData.paymentMethod === 'credit_card' && 'Tarjeta de crédito'}
                      {formData.paymentMethod === 'mercadopago' && 'MercadoPago'}
                      {formData.paymentMethod === 'paypal' && 'PayPal'}
                    </p>
                    {formData.paymentMethod === 'credit_card' && (
                      <p className="text-sm text-gray-600">
                        {formData.installments}x cuotas sin interés
                      </p>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-blue-600">🔒</span>
                      <span className="text-sm font-medium text-blue-800">Compra protegida</span>
                    </div>
                    <p className="text-xs text-blue-700">
                      Tus datos están seguros. Podés cancelar tu suscripción cuando quieras.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-md font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Volver
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 bg-green-500 text-white py-3 rounded-md font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-300"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Procesando...
                        </div>
                      ) : (
                        'Pagar'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="font-semibold text-gray-800 mb-4">Resumen de compra</h3>
              
              {/* Product */}
              <div className="flex items-start gap-3 mb-4 pb-4 border-b">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">LH</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">LifeHub Premium</h4>
                  <p className="text-sm text-gray-600">Suscripción mensual</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Incluye acceso a {APPS.length} apps
                  </p>
                </div>
              </div>

              {/* Apps List */}
              <div className="mb-4 pb-4 border-b">
                <p className="text-sm font-medium text-gray-700 mb-2">Apps incluidas:</p>
                <div className="grid grid-cols-2 gap-2">
                  {selectedApps.map(app => (
                    <div key={app.id} className="flex items-center gap-2">
                      <span className="text-sm">{app.icon}</span>
                      <span className="text-xs text-gray-600">{app.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${basePrice}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Descuento</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>${finalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Security badges */}
              <div className="text-center pt-4 border-t">
                <div className="flex justify-center items-center gap-2 text-xs text-gray-500 mb-2">
                  <span>🔒</span>
                  <span>Pago 100% seguro</span>
                </div>
                <div className="flex justify-center items-center gap-2 text-xs text-gray-500">
                  <span>🛡️</span>
                  <span>Garantía de devolución</span>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">¿Necesitás ayuda?</h4>
              <p className="text-sm text-gray-600 mb-3">
                Contactanos si tienes alguna duda sobre tu suscripción.
              </p>
              <button 
                className="text-blue-500 text-sm font-medium hover:underline"
              >
                Ir al centro de ayuda →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;