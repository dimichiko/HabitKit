import React, { useState, useEffect } from 'react';
import EmpresaForm from './EmpresaForm';

interface UserData {
  name: string;
  businessName: string;
  businessType: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  currency: string;
  defaultTax: number;
}

interface Empresa {
  id: number;
  name: string;
  ruc?: string;
  email?: string;
}

interface OnboardingScreenProps {
  onComplete: (userData: UserData) => void;
}

interface StepComponentProps {
  userData: UserData;
  updateUserData: (updates: Partial<UserData>) => void;
  onNext: () => void;
  onBack?: () => void;
  currentStep?: number;
  totalSteps?: number;
}

interface Step {
  id: string;
  title: string;
  subtitle: string;
  component: React.ComponentType<StepComponentProps>;
}

const OnboardingScreen = ({ onComplete }: OnboardingScreenProps) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    businessName: '',
    businessType: '',
    email: '',
    phone: '',
    address: '',
    taxId: '',
    currency: 'USD',
    defaultTax: 21
  });
  const [showEmpresaForm, setShowEmpresaForm] = useState<boolean>(false);
  const [empresaEditIndex, setEmpresaEditIndex] = useState<number | null>(null);
  const [empresaEditData, setEmpresaEditData] = useState<any>(null);
  const userId = localStorage.getItem('userId');
  const getUserKey = (key: string): string => `invoicekit_${key}_${userId}`;
  const [empresas, setEmpresas] = useState<any[]>(() => JSON.parse(localStorage.getItem(getUserKey('companies')) || '[]'));
  const [selectedEmpresa, setSelectedEmpresa] = useState<any>(null);

  const steps: Step[] = [
    {
      id: 'welcome',
      title: '¡Bienvenido a InvoiceKit!',
      subtitle: 'Tu gestor de facturas profesional',
      component: WelcomeStep
    },
    {
      id: 'business',
      title: 'Información de tu Negocio',
      subtitle: 'Configura los datos de tu empresa',
      component: BusinessStep
    },
    {
      id: 'preferences',
      title: 'Preferencias',
      subtitle: 'Personaliza tu experiencia',
      component: PreferencesStep
    },
    {
      id: 'summary',
      title: '¡Todo Listo!',
      subtitle: 'Revisa tu configuración',
      component: SummaryStep
    }
  ];

  const updateUserData = (updates: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('invoicekit_user_profile', JSON.stringify(userData));
      localStorage.setItem('invoicekit_onboarding_complete', 'true');
      setShowEmpresaForm(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveEmpresa = (empresa: any) => {
    const exists = empresas.some((e: any) => e.id === empresa.id);
    if (exists) {
      setEmpresas(empresas.map((e: any) => e.id === empresa.id ? empresa : e));
    } else {
      setEmpresas([...empresas, empresa]);
    }
    setEmpresaEditData(null);
  };

  const handleCancelEmpresa = () => {
    setShowEmpresaForm(false);
    setEmpresaEditIndex(null);
    setEmpresaEditData(null);
  };

  const handleAddEmpresa = () => {
    setEmpresaEditIndex(null);
    setEmpresaEditData(null);
    setShowEmpresaForm(true);
  };

  const handleEditEmpresa = (idx: number) => {
    setEmpresaEditIndex(idx);
    setEmpresaEditData(empresas[idx]);
    setShowEmpresaForm(true);
  };

  const handleSelectEmpresa = (empresa: any) => {
    setSelectedEmpresa(empresa);
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="w-full bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">IK</span>
                </div>
                <span className="text-lg font-semibold text-gray-800">InvoiceKit</span>
              </div>
              <div className="flex items-center space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index <= currentStep ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-8">
        <div className="max-w-2xl mx-auto px-4">
          {empresas.length > 0 && !showEmpresaForm ? (
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 mx-auto">
              <h2 className="text-xl font-bold mb-4">Selecciona o crea tu empresa</h2>
              <div className="space-y-3 mb-6">
                {empresas.map((empresa, idx) => (
                  <div key={empresa.id} className="flex items-center gap-2">
                    <button
                      onClick={() => handleSelectEmpresa(empresa)}
                      className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition text-left"
                    >
                      <h3 className="font-semibold text-gray-800">{empresa.name}</h3>
                      {empresa.ruc && <p className="text-sm text-gray-600">RUC: {empresa.ruc}</p>}
                      {empresa.email && <p className="text-xs text-gray-500">{empresa.email}</p>}
                    </button>
                    <button onClick={()=>handleEditEmpresa(idx)} className="text-blue-500 hover:underline text-xs">Editar</button>
                  </div>
                ))}
              </div>
              <button onClick={handleAddEmpresa} className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition">+ Nueva Empresa</button>
            </div>
          ) : (
            <EmpresaForm onSave={handleSaveEmpresa} onBack={handleCancelEmpresa} empresaToEdit={empresaEditData} />
          )}
        </div>
      </div>
    </div>
  );
};

// Welcome Step Component
const WelcomeStep = ({ onNext }: Pick<StepComponentProps, 'onNext'>) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="mb-8">
        <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">¡Bienvenido a InvoiceKit!</h1>
        <p className="text-xl text-gray-600 mb-8">Tu gestor de facturas profesional</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Facturas Profesionales</h3>
          <p className="text-sm text-gray-600">Crea facturas elegantes y personalizadas</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Gestión Completa</h3>
          <p className="text-sm text-gray-600">Clientes, productos y pagos en un lugar</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Rápido y Fácil</h3>
          <p className="text-sm text-gray-600">Interfaz intuitiva y automatizada</p>
        </div>
      </div>

      <button
        onClick={onNext}
        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        ¡Empezar!
      </button>
    </div>
  );
};

// Business Step Component
const BusinessStep = ({ userData, updateUserData, onNext, onBack }: Pick<StepComponentProps, 'userData' | 'updateUserData' | 'onNext' | 'onBack'>) => {
  const businessTypes = [
    { id: 'freelance', title: 'Freelancer', description: 'Trabajo independiente', icon: '👨‍💻' },
    { id: 'consulting', title: 'Consultoría', description: 'Servicios de consultoría', icon: '💼' },
    { id: 'retail', title: 'Comercio', description: 'Venta de productos', icon: '🏪' },
    { id: 'services', title: 'Servicios', description: 'Servicios profesionales', icon: '🔧' },
    { id: 'other', title: 'Otro', description: 'Otro tipo de negocio', icon: '📋' }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Información de tu Negocio</h2>
      <p className="text-lg text-gray-600 mb-8 text-center">Configura los datos de tu empresa</p>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
            <input
              type="text"
              value={userData.name}
              onChange={(e) => updateUserData({ name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tu nombre completo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Negocio</label>
            <input
              type="text"
              value={userData.businessName}
              onChange={(e) => updateUserData({ businessName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nombre de tu empresa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={userData.email}
              onChange={(e) => updateUserData({ email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
            <input
              type="tel"
              value={userData.phone}
              onChange={(e) => updateUserData({ phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+1 234 567 890"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
            <textarea
              value={userData.address}
              onChange={(e) => updateUserData({ address: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Dirección completa"
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Tipo de Negocio</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {businessTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => updateUserData({ businessType: type.id })}
              className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                userData.businessType === type.id
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{type.icon}</span>
                <div>
                  <h4 className="font-semibold text-gray-800">{type.title}</h4>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-600 font-medium hover:text-gray-800 transition"
        >
          ← Atrás
        </button>
        <button
          onClick={onNext}
          disabled={!userData.name || !userData.businessName || !userData.email}
          className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

// Preferences Step Component
const PreferencesStep = ({ userData, updateUserData, onNext, onBack }: Pick<StepComponentProps, 'userData' | 'updateUserData' | 'onNext' | 'onBack'>) => {
  const currencies = [
    { code: 'USD', symbol: '$', name: 'Dólar Estadounidense' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'Libra Esterlina' },
    { code: 'MXN', symbol: '$', name: 'Peso Mexicano' },
    { code: 'COP', symbol: '$', name: 'Peso Colombiano' },
    { code: 'ARS', symbol: '$', name: 'Peso Argentino' }
  ];

  const taxRates = [0, 5, 10, 15, 16, 19, 21, 25];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Preferencias</h2>
      <p className="text-lg text-gray-600 mb-8 text-center">Personaliza tu experiencia</p>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Moneda Principal</label>
            <select
              value={userData.currency}
              onChange={(e) => updateUserData({ currency: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.name} ({currency.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Impuesto por Defecto (%)</label>
            <select
              value={userData.defaultTax}
              onChange={(e) => updateUserData({ defaultTax: Number(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {taxRates.map((rate) => (
                <option key={rate} value={rate}>
                  {rate}%
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Número de Identificación Fiscal</label>
            <input
              type="text"
              value={userData.taxId}
              onChange={(e) => updateUserData({ taxId: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="RFC, NIT, CUIT, etc."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-600 font-medium hover:text-gray-800 transition"
        >
          ← Atrás
        </button>
        <button
          onClick={onNext}
          className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

// Summary Step Component
const SummaryStep = ({ userData, onNext, onBack }: Pick<StepComponentProps, 'userData' | 'onNext' | 'onBack'>) => {
  const getBusinessTypeText = (type: string): string => {
    const map: Record<string, string> = {
      freelance: 'Freelance',
      consulting: 'Consultoría',
      retail: 'Comercio',
      services: 'Servicios',
      other: 'Otro'
    };
    return map[type] || 'No definido';
  };

  const getCurrencySymbol = (code: string): string => {
    const map: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      MXN: '$',
      COP: '$',
      ARS: '$'
    };
    return map[code] || code;
  };

  return (
    <div className="text-center">
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Todo Listo!</h2>
      <p className="text-lg text-gray-600 mb-8">Revisa tu configuración</p>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-left">
            <h3 className="font-semibold text-gray-800 mb-4">Información Personal</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Nombre:</span> {userData.name}</p>
              <p><span className="font-medium">Email:</span> {userData.email}</p>
              <p><span className="font-medium">Teléfono:</span> {userData.phone}</p>
            </div>
          </div>
          
          <div className="text-left">
            <h3 className="font-semibold text-gray-800 mb-4">Información del Negocio</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Empresa:</span> {userData.businessName}</p>
              <p><span className="font-medium">Tipo:</span> {getBusinessTypeText(userData.businessType)}</p>
              <p><span className="font-medium">Moneda:</span> {getCurrencySymbol(userData.currency)} {userData.currency}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Impuesto por defecto:</span> {userData.defaultTax}%
            </div>
            <div>
              <span className="font-medium">ID Fiscal:</span> {userData.taxId || 'No especificado'}
            </div>
            <div>
              <span className="font-medium">Dirección:</span> {userData.address || 'No especificada'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-600 font-medium hover:text-gray-800 transition"
        >
          ← Atrás
        </button>
        <button
          onClick={onNext}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          ¡Comenzar!
        </button>
      </div>
    </div>
  );
};

export default OnboardingScreen; 