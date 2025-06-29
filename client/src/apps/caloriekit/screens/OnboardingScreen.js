import React, { useState, useEffect } from 'react';
import { calculateMacros, saveProfile } from '../utils/api';

const OnboardingScreen = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    name: '',
    goal: 'maintain',
    age: '',
    gender: 'male',
    weight: '',
    height: '',
    activityLevel: 'light',
    targetWeight: '',
    weightGoal: 'maintain',
    weeklyWeightGoal: 0.5
  });
  const [isSaving, setIsSaving] = useState(false);
  const [calculatedGoals, setCalculatedGoals] = useState(null);

  const steps = [
    {
      id: 'welcome',
      title: '¡Bienvenido a CalorieKit!',
      subtitle: 'Tu compañero nutricional inteligente',
      component: WelcomeStep
    },
    {
      id: 'goal',
      title: '¿Cuál es tu objetivo?',
      subtitle: 'Elige lo que mejor se adapte a ti',
      component: GoalStep
    },
    {
      id: 'profile',
      title: 'Tu Perfil',
      subtitle: 'Necesitamos algunos datos para personalizar tu experiencia',
      component: ProfileStep
    },
    {
      id: 'activity',
      title: 'Nivel de Actividad',
      subtitle: '¿Qué tan activo eres en tu día a día?',
      component: ActivityStep
    },
    {
      id: 'weightGoals',
      title: 'Objetivos de Peso',
      subtitle: 'Define tus metas específicas de peso',
      component: WeightGoalsStep
    },
    {
      id: 'summary',
      title: '¡Todo Listo!',
      subtitle: 'Revisa tu configuración personalizada',
      component: SummaryStep
    }
  ];

  const updateUserData = (updates) => {
    setUserData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      if (steps[currentStep + 1].id === 'summary') {
        try {
          const goals = await calculateMacros(userData);
          setCalculatedGoals(goals);
        } catch (error) {
          console.error("Error al calcular macros:", error);
          // Opcional: mostrar un error al usuario
        }
      }
      setCurrentStep(currentStep + 1);
    } else {
      setIsSaving(true);
      try {
        const finalProfileData = { ...userData, ...calculatedGoals };
        await saveProfile(finalProfileData);
        onComplete(finalProfileData);
      } catch (error) {
        console.error('Error al guardar el perfil:', error);
        alert('Hubo un error al guardar tu perfil. Por favor, inténtalo de nuevo.');
        setIsSaving(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-800 dark:via-gray-900 dark:to-black">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="w-full bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">CK</span>
                </div>
                <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">CalorieKit</span>
              </div>
              <div className="flex items-center space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index <= currentStep ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
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
            calculatedGoals={calculatedGoals}
            isSaving={isSaving}
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
        <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">¡Bienvenido a CalorieKit!</h1>
        <p className="text-xl text-gray-600 mb-8">Tu compañero nutricional inteligente</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">300,000+ Alimentos</h3>
          <p className="text-sm text-gray-600">Base de datos completa de USDA</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Analytics Avanzados</h3>
          <p className="text-sm text-gray-600">Seguimiento detallado de tu progreso</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Personalizado</h3>
          <p className="text-sm text-gray-600">Adaptado a tus objetivos y estilo de vida</p>
        </div>
      </div>

      <button
        onClick={onNext}
        className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        ¡Empezar!
      </button>
    </div>
  );
};

// Goal Step Component
const GoalStep = ({ userData, updateUserData, onNext }) => {
  const goals = [
    {
      id: 'lose',
      title: 'Perder Peso',
      description: 'Crear un déficit calórico para perder grasa',
      icon: '📉',
      color: 'from-red-400 to-red-600'
    },
    {
      id: 'maintain',
      title: 'Mantener Peso',
      description: 'Mantener tu peso actual y mejorar hábitos',
      icon: '⚖️',
      color: 'from-green-400 to-green-600'
    },
    {
      id: 'gain',
      title: 'Ganar Músculo',
      description: 'Aumentar masa muscular con superávit calórico',
      icon: '💪',
      color: 'from-blue-400 to-blue-600'
    }
  ];

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">¿Cuál es tu objetivo?</h2>
      <p className="text-lg text-gray-600 mb-8">Elige lo que mejor se adapte a ti</p>

      <div className="grid grid-cols-1 gap-4 mb-8">
        {goals.map((goal) => (
          <button
            key={goal.id}
            onClick={() => updateUserData({ goal: goal.id })}
            className={`p-6 rounded-lg border-2 transition-all duration-300 text-left ${
              userData.goal === goal.id
                ? `border-orange-500 bg-gradient-to-r ${goal.color} text-white shadow-lg`
                : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md'
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

      <button
        onClick={onNext}
        disabled={!userData.goal}
        className="px-8 py-4 bg-orange-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Continuar
      </button>
    </div>
  );
};

// Profile Step Component
const ProfileStep = ({ userData, updateUserData, onNext, onBack }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Tu Perfil</h2>
      <p className="text-lg text-gray-600 mb-8 text-center">Necesitamos algunos datos para personalizar tu experiencia</p>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
            <input
              type="text"
              id="name"
              value={userData.name || ''}
              onChange={(e) => updateUserData({ name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">Edad</label>
            <input
              type="number"
              id="age"
              value={userData.age}
              onChange={(e) => updateUserData({ age: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="25"
              min="13"
              max="120"
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">Género</label>
            <select
              id="gender"
              value={userData.gender}
              onChange={(e) => updateUserData({ gender: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Selecciona...</option>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
            </select>
          </div>

          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
            <input
              type="number"
              id="weight"
              value={userData.weight}
              onChange={(e) => updateUserData({ weight: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="70"
              min="30"
              max="300"
              step="0.1"
            />
          </div>

          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">Altura (cm)</label>
            <input
              type="number"
              id="height"
              value={userData.height}
              onChange={(e) => updateUserData({ height: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="170"
              min="100"
              max="250"
            />
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
          disabled={!userData.name || !userData.age || !userData.gender || !userData.weight || !userData.height}
          className="px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

// Activity Step Component
const ActivityStep = ({ userData, updateUserData, onNext, onBack }) => {
  const activityLevels = [
    {
      id: 'sedentary',
      title: 'Sedentario',
      description: 'Poco o ningún ejercicio',
      icon: '🛋️',
      multiplier: 1.2
    },
    {
      id: 'lightlyActive',
      title: 'Ligeramente Activo',
      description: 'Ejercicio ligero 1-3 días/semana',
      icon: '🚶',
      multiplier: 1.375
    },
    {
      id: 'moderatelyActive',
      title: 'Moderadamente Activo',
      description: 'Ejercicio moderado 3-5 días/semana',
      icon: '🏃',
      multiplier: 1.55
    },
    {
      id: 'veryActive',
      title: 'Muy Activo',
      description: 'Ejercicio intenso 6-7 días/semana',
      icon: '🏋️',
      multiplier: 1.725
    },
    {
      id: 'extremelyActive',
      title: 'Extremadamente Activo',
      description: 'Ejercicio muy intenso, trabajo físico',
      icon: '🔥',
      multiplier: 1.9
    }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Nivel de Actividad</h2>
      <p className="text-lg text-gray-600 mb-8 text-center">¿Qué tan activo eres en tu día a día?</p>

      <div className="space-y-4 mb-8">
        {activityLevels.map((level) => (
          <button
            key={level.id}
            onClick={() => updateUserData({ activityLevel: level.id })}
            className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
              userData.activityLevel === level.id
                ? 'border-orange-500 bg-orange-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center space-x-4">
              <span className="text-2xl">{level.icon}</span>
              <div>
                <h3 className="font-semibold text-lg">{level.title}</h3>
                <p className="text-sm text-gray-600">{level.description}</p>
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
          disabled={!userData.activityLevel}
          className="px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

// Weight Goals Step Component
const WeightGoalsStep = ({ userData, updateUserData, onNext, onBack }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Objetivos de Peso</h2>
      <p className="text-lg text-gray-600 mb-8 text-center">Define tus metas específicas de peso</p>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="targetWeight" className="block text-sm font-medium text-gray-700 mb-2">Peso Objetivo (kg)</label>
            <input
              type="number"
              id="targetWeight"
              value={userData.targetWeight}
              onChange={(e) => updateUserData({ targetWeight: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="70"
              min="30"
              max="300"
              step="0.1"
            />
          </div>

          <div>
            <label htmlFor="weeklyWeightGoal" className="block text-sm font-medium text-gray-700 mb-2">Meta Semanal de Peso (kg)</label>
            <input
              type="number"
              id="weeklyWeightGoal"
              value={userData.weeklyWeightGoal}
              onChange={(e) => updateUserData({ weeklyWeightGoal: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="0.5"
              min="0"
              max="5"
              step="0.1"
            />
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
          disabled={!userData.targetWeight || !userData.weeklyWeightGoal}
          className="px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
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
    const map = {
      lose: 'Perder Peso',
      maintain: 'Mantener Peso',
      gain: 'Ganar Músculo'
    };
    return map[goal] || 'No definido';
  };

  const getActivityText = (activity) => {
    const map = {
      sedentary: 'Sedentario',
      light: 'Ligero',
      moderate: 'Moderado',
      active: 'Activo',
      veryActive: 'Muy Activo'
    };
    return map[activity] || 'No definido';
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Todo Listo!</h2>
      <p className="text-lg text-gray-600 mb-8">Revisa tu configuración personalizada</p>
      
      <div className="bg-white rounded-lg shadow-lg p-8 text-left space-y-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <p className="text-sm text-gray-500">Objetivo Principal</p>
            <p className="font-semibold text-gray-800">{getGoalText(userData.goal)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Nivel de Actividad</p>
            <p className="font-semibold text-gray-800">{getActivityText(userData.activityLevel)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Peso Actual</p>
            <p className="font-semibold text-gray-800">{userData.weight} kg</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Peso Objetivo</p>
            <p className="font-semibold text-gray-800">{userData.targetWeight} kg</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Género</p>
            <p className="font-semibold text-gray-800 capitalize">{userData.gender}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Altura</p>
            <p className="font-semibold text-gray-800">{userData.height} cm</p>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Con estos datos, CalorieKit calculará tus necesidades calóricas y de macronutrientes para ayudarte a alcanzar tus metas.
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
          className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Finalizar y Guardar
        </button>
      </div>
    </div>
  );
};

export default OnboardingScreen; 