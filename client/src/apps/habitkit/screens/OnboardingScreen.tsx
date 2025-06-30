import React, { useState, useEffect } from 'react';

interface UserData {
  name: string;
  goal: string;
  motivation: string;
  experience: string;
  reminderTime: string;
  theme: string;
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
    goal: '',
    motivation: '',
    experience: '',
    reminderTime: '09:00',
    theme: 'green'
  });

  const steps: Step[] = [
    {
      id: 'welcome',
      title: '¡Bienvenido a HabitKit!',
      subtitle: 'Construye hábitos positivos de forma sostenible',
      component: WelcomeStep
    },
    {
      id: 'profile',
      title: 'Tu Perfil',
      subtitle: 'Cuéntanos sobre ti',
      component: ProfileStep
    },
    {
      id: 'goals',
      title: 'Tus Objetivos',
      subtitle: '¿Qué hábitos quieres construir?',
      component: GoalsStep
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
      subtitle: 'Comienza tu viaje hacia mejores hábitos',
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
      localStorage.setItem('habitkit_user_profile', JSON.stringify(userData));
      localStorage.setItem('habitkit_onboarding_complete', 'true');
      onComplete(userData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="w-full bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">HK</span>
                </div>
                <span className="text-lg font-semibold text-gray-800">HabitKit</span>
              </div>
              <div className="flex items-center space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index <= currentStep ? 'bg-green-500' : 'bg-gray-300'
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
          <CurrentStepComponent
            userData={userData}
            updateUserData={updateUserData}
            onNext={handleNext}
            onBack={handleBack}
            currentStep={currentStep}
            totalSteps={steps.length}
          />
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
        <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">¡Bienvenido a HabitKit!</h1>
        <p className="text-xl text-gray-600 mb-8">Construye hábitos positivos de forma sostenible</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Seguimiento Simple</h3>
          <p className="text-sm text-gray-600">Registra tus hábitos con un solo toque</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Analytics Detallados</h3>
          <p className="text-sm text-gray-600">Visualiza tu progreso y estadísticas</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Recordatorios</h3>
          <p className="text-sm text-gray-600">Nunca olvides tus hábitos importantes</p>
        </div>
      </div>

      <button
        onClick={onNext}
        className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        ¡Empezar!
      </button>
    </div>
  );
};

// Profile Step Component
const ProfileStep = ({ userData, updateUserData, onNext, onBack }: Pick<StepComponentProps, 'userData' | 'updateUserData' | 'onNext' | 'onBack'>) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Tu Perfil</h2>
      <p className="text-lg text-gray-600 mb-8 text-center">Cuéntanos sobre ti</p>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
            <input
              type="text"
              value={userData.name}
              onChange={(e) => updateUserData({ name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">¿Qué te motiva a construir hábitos?</label>
            <textarea
              value={userData.motivation}
              onChange={(e) => updateUserData({ motivation: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ej: Quiero ser más productivo, mejorar mi salud..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Experiencia con hábitos</label>
            <select
              value={userData.experience}
              onChange={(e) => updateUserData({ experience: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Selecciona...</option>
              <option value="beginner">Principiante - Nunca he construido hábitos</option>
              <option value="intermediate">Intermedio - He tenido algunos hábitos</option>
              <option value="advanced">Avanzado - Tengo varios hábitos establecidos</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-600 font-medium hover:text-gray-800 transition"
        >
          ← Atrás
        </button>
        <button
          onClick={onNext}
          disabled={!userData.name || !userData.motivation || !userData.experience}
          className="px-8 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

// Goals Step Component
const GoalsStep = ({ userData, updateUserData, onNext, onBack }: Pick<StepComponentProps, 'userData' | 'updateUserData' | 'onNext' | 'onBack'>) => {
  const goals = [
    {
      id: 'health',
      title: 'Salud y Bienestar',
      description: 'Ejercicio, alimentación, sueño',
      icon: '🏃‍♂️',
      color: 'from-green-400 to-green-600'
    },
    {
      id: 'productivity',
      title: 'Productividad',
      description: 'Trabajo, estudio, organización',
      icon: '💼',
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 'learning',
      title: 'Aprendizaje',
      description: 'Lectura, cursos, habilidades',
      icon: '📚',
      color: 'from-purple-400 to-purple-600'
    },
    {
      id: 'relationships',
      title: 'Relaciones',
      description: 'Familia, amigos, comunicación',
      icon: '❤️',
      color: 'from-pink-400 to-pink-600'
    },
    {
      id: 'finance',
      title: 'Finanzas',
      description: 'Ahorro, inversión, presupuesto',
      icon: '💰',
      color: 'from-yellow-400 to-yellow-600'
    },
    {
      id: 'custom',
      title: 'Personalizado',
      description: 'Define tus propios objetivos',
      icon: '🎯',
      color: 'from-gray-400 to-gray-600'
    }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Tus Objetivos</h2>
      <p className="text-lg text-gray-600 mb-8 text-center">¿Qué hábitos quieres construir?</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {goals.map((goal) => (
          <button
            key={goal.id}
            onClick={() => updateUserData({ goal: goal.id })}
            className={`p-6 rounded-lg border-2 transition-all duration-300 text-left ${
              userData.goal === goal.id
                ? `border-green-500 bg-gradient-to-r ${goal.color} text-white shadow-lg`
                : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center space-x-4">
              <span className="text-3xl">{goal.icon}</span>
              <div>
                <h3 className="font-semibold text-lg">{goal.title}</h3>
                <p className="text-sm opacity-80">{goal.description}</p>
              </div>
            </div>
          </button>
        ))}
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
          disabled={!userData.goal}
          className="px-8 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

// Preferences Step Component
const PreferencesStep = ({ userData, updateUserData, onNext, onBack }: Pick<StepComponentProps, 'userData' | 'updateUserData' | 'onNext' | 'onBack'>) => {
  const themes = [
    { id: 'green', name: 'Verde', color: 'bg-green-500' },
    { id: 'blue', name: 'Azul', color: 'bg-blue-500' },
    { id: 'purple', name: 'Púrpura', color: 'bg-purple-500' },
    { id: 'orange', name: 'Naranja', color: 'bg-orange-500' }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Preferencias</h2>
      <p className="text-lg text-gray-600 mb-8 text-center">Personaliza tu experiencia</p>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hora de recordatorio</label>
            <input
              type="time"
              value={userData.reminderTime}
              onChange={(e) => updateUserData({ reminderTime: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tema de color</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => updateUserData({ theme: theme.id })}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    userData.theme === theme.id
                      ? 'border-green-500 shadow-lg'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className={`w-8 h-8 ${theme.color} rounded-full mx-auto mb-2`}></div>
                  <span className="text-sm font-medium">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-600 font-medium hover:text-gray-800 transition"
        >
          ← Atrás
        </button>
        <button
          onClick={onNext}
          className="px-8 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

// Summary Step Component
const SummaryStep = ({ userData, onNext, onBack }: Pick<StepComponentProps, 'userData' | 'onNext' | 'onBack'>) => {
  const getGoalText = (goal: string): string => {
    const map: Record<string, string> = {
      health: 'Salud y Bienestar',
      productivity: 'Productividad',
      learning: 'Aprendizaje',
      relationships: 'Relaciones',
      finance: 'Finanzas',
      custom: 'Personalizado'
    };
    return map[goal] || 'No definido';
  };

  const getThemeText = (theme: string): string => {
    const map: Record<string, string> = {
      green: 'Verde',
      blue: 'Azul',
      purple: 'Púrpura',
      orange: 'Naranja'
    };
    return map[theme] || 'No definido';
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Todo Listo!</h2>
      <p className="text-lg text-gray-600 mb-8">Comienza tu viaje hacia mejores hábitos</p>
      
      <div className="bg-white rounded-lg shadow-lg p-8 text-left space-y-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <p className="text-sm text-gray-500">Nombre</p>
            <p className="font-semibold text-gray-800">{userData.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Objetivo Principal</p>
            <p className="font-semibold text-gray-800">{getGoalText(userData.goal)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Experiencia</p>
            <p className="font-semibold text-gray-800 capitalize">{userData.experience}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tema</p>
            <p className="font-semibold text-gray-800">{getThemeText(userData.theme)}</p>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">Tu motivación:</p>
          <p className="text-gray-800 italic">"{userData.motivation}"</p>
        </div>

        <div className="pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Con esta configuración, HabitKit te ayudará a construir hábitos sostenibles y alcanzar tus objetivos.
          </p>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
        >
          Atrás
        </button>
        <button
          onClick={onNext}
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          ¡Comenzar!
        </button>
      </div>
    </div>
  );
};

export default OnboardingScreen; 