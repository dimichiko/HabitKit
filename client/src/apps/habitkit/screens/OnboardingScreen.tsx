import React, { useState, useEffect } from 'react';

const OnboardingScreen = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    name: '',
    goal: '',
    motivation: '',
    experience: '',
    reminderTime: '09:00',
    theme: 'green'
  });

  const steps = [
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

  const updateUserData = (updates) => {
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
const WelcomeStep = ({ onNext }) => {
  const [isVisible, setIsVisible] = useState(false);

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
const ProfileStep = ({ userData, updateUserData, onNext, onBack }) => {
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
              placeholder="Ej: Quiero ser más saludable, productivo, etc."
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
              <option value="beginner">Principiante - Es mi primera vez</option>
              <option value="intermediate">Intermedio - He intentado antes</option>
              <option value="advanced">Avanzado - Ya tengo algunos hábitos</option>
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
          disabled={!userData.name}
          className="px-8 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

// Goals Step Component
const GoalsStep = ({ userData, updateUserData, onNext, onBack }) => {
  const commonGoals = [
    {
      id: 'health',
      title: 'Salud y Bienestar',
      description: 'Ejercicio, alimentación, sueño',
      icon: '🏃‍♂️',
      examples: ['Hacer ejercicio 30 min', 'Beber 8 vasos de agua', 'Dormir 8 horas']
    },
    {
      id: 'productivity',
      title: 'Productividad',
      description: 'Trabajo, estudio, organización',
      icon: '💼',
      examples: ['Leer 30 min', 'Planificar el día', 'Meditar 10 min']
    },
    {
      id: 'learning',
      title: 'Aprendizaje',
      description: 'Nuevas habilidades, idiomas',
      icon: '📚',
      examples: ['Practicar idioma', 'Aprender algo nuevo', 'Escribir en blog']
    },
    {
      id: 'relationships',
      title: 'Relaciones',
      description: 'Familia, amigos, comunicación',
      icon: '❤️',
      examples: ['Llamar a familia', 'Salir con amigos', 'Expresar gratitud']
    },
    {
      id: 'finance',
      title: 'Finanzas',
      description: 'Ahorro, inversión, presupuesto',
      icon: '💰',
      examples: ['Ahorrar 10%', 'Revisar gastos', 'Invertir mensualmente']
    },
    {
      id: 'custom',
      title: 'Personalizado',
      description: 'Define tus propios objetivos',
      icon: '🎯',
      examples: ['Cualquier hábito que quieras construir']
    }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Tus Objetivos</h2>
      <p className="text-lg text-gray-600 mb-8 text-center">¿Qué hábitos quieres construir?</p>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-4">Selecciona tu área principal de enfoque:</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {commonGoals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => updateUserData({ goal: goal.id })}
              className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                userData.goal === goal.id
                  ? 'border-green-500 bg-green-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{goal.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-800">{goal.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    {goal.examples.map((example, index) => (
                      <li key={index}>• {example}</li>
                    ))}
                  </ul>
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
const PreferencesStep = ({ userData, updateUserData, onNext, onBack }) => {
  const themes = [
    { id: 'green', name: 'Verde', color: 'bg-green-500', description: 'Naturaleza y crecimiento' },
    { id: 'blue', name: 'Azul', color: 'bg-blue-500', description: 'Calma y confianza' },
    { id: 'purple', name: 'Púrpura', color: 'bg-purple-500', description: 'Creatividad y sabiduría' },
    { id: 'orange', name: 'Naranja', color: 'bg-orange-500', description: 'Energía y entusiasmo' }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Preferencias</h2>
      <p className="text-lg text-gray-600 mb-8 text-center">Personaliza tu experiencia</p>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hora de recordatorio diario</label>
            <input
              type="time"
              value={userData.reminderTime}
              onChange={(e) => updateUserData({ reminderTime: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Te recordaremos revisar tus hábitos a esta hora</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Tema de color</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => updateUserData({ theme: theme.id })}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    userData.theme === theme.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-green-300'
                  }`}
                >
                  <div className={`w-8 h-8 ${theme.color} rounded-full mx-auto mb-2`}></div>
                  <h4 className="font-semibold text-gray-800 text-sm">{theme.name}</h4>
                  <p className="text-xs text-gray-600">{theme.description}</p>
                </button>
              ))}
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
          className="px-8 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

// Summary Step Component
const SummaryStep = ({ userData, onNext, onBack }) => {
  const getGoalText = (goal) => {
    const goals = {
      health: 'Salud y Bienestar',
      productivity: 'Productividad',
      learning: 'Aprendizaje',
      relationships: 'Relaciones',
      finance: 'Finanzas',
      custom: 'Personalizado'
    };
    return goals[goal] || goal;
  };

  const getThemeText = (theme) => {
    const themes = {
      green: 'Verde',
      blue: 'Azul',
      purple: 'Púrpura',
      orange: 'Naranja'
    };
    return themes[theme] || theme;
  };

  return (
    <div className="text-center">
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Todo Listo!</h2>
      <p className="text-lg text-gray-600 mb-8">Comienza tu viaje hacia mejores hábitos</p>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-left">
            <h3 className="font-semibold text-gray-800 mb-4">Tu Perfil</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Nombre:</span> {userData.name}</p>
              <p><span className="font-medium">Experiencia:</span> {userData.experience}</p>
              <p><span className="font-medium">Motivación:</span> {userData.motivation}</p>
            </div>
          </div>
          
          <div className="text-left">
            <h3 className="font-semibold text-gray-800 mb-4">Configuración</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Objetivo:</span> {getGoalText(userData.goal)}</p>
              <p><span className="font-medium">Recordatorio:</span> {userData.reminderTime}</p>
              <p><span className="font-medium">Tema:</span> {getThemeText(userData.theme)}</p>
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
          className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          ¡Comenzar!
        </button>
      </div>
    </div>
  );
};

export default OnboardingScreen; 