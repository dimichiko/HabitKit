import React, { useState, useEffect } from 'react';
import { calculateMacros, saveProfile } from '../utils/api';

interface ProfileData {
  name: string;
  goal: string;
  age: string;
  gender: string;
  weight: string;
  height: string;
  activityLevel: string;
  dailyCalories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  weeklyWeightGoal: number;
}

interface OnboardingScreenProps {
  onComplete: (data: ProfileData) => void;
}

interface StepComponentProps {
  userData: ProfileData;
  updateUserData: (updates: Partial<ProfileData>) => void;
  onNext: () => void;
  onBack?: () => void;
  currentStep?: number;
  totalSteps?: number;
  calculatedGoals?: ProfileData | null;
  isSaving?: boolean;
}

interface Step {
  id: string;
  title: string;
  subtitle: string;
  component: React.ComponentType<StepComponentProps>;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface ActivityLevel {
  id: string;
  title: string;
  description: string;
  icon: string;
  multiplier: number;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ProfileData>({
    name: '',
    goal: '',
    age: '',
    gender: '',
    weight: '',
    height: '',
    activityLevel: '',
    weeklyWeightGoal: 0
  });

  const handleInputChange = (field: keyof ProfileData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Calcular macros basados en los datos
      const weight = parseFloat(formData.weight) || 70;
      const height = parseFloat(formData.height) || 170;
      const age = parseInt(formData.age) || 30;
      
      let bmr = 0;
      if (formData.gender === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
      } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
      }
      
      const activityMultipliers: Record<string, number> = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        veryActive: 1.9
      };
      
      const tdee = bmr * (activityMultipliers[formData.activityLevel] || 1.55);
      
      let dailyCalories = tdee;
      if (formData.goal === 'lose') {
        dailyCalories = tdee - 500;
      } else if (formData.goal === 'gain') {
        dailyCalories = tdee + 500;
      }
      
      const protein = weight * 2.2; // 1g por lb
      const fat = (dailyCalories * 0.25) / 9; // 25% de calorías
      const carbs = (dailyCalories - (protein * 4) - (fat * 9)) / 4;
      
      const completeData: ProfileData = {
        ...formData,
        dailyCalories: Math.round(dailyCalories),
        protein: Math.round(protein),
        carbs: Math.round(carbs),
        fat: Math.round(fat)
      };
      
      onComplete(completeData);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración Inicial</h1>
          <p className="text-gray-600">Paso {step} de 3</p>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objetivo
              </label>
              <select
                value={formData.goal}
                onChange={(e) => handleInputChange('goal', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Selecciona tu objetivo</option>
                <option value="lose">Perder peso</option>
                <option value="maintain">Mantener peso</option>
                <option value="gain">Ganar peso</option>
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Edad
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Género
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Selecciona</option>
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="70"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Altura (cm)
                </label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="170"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nivel de Actividad
              </label>
              <select
                value={formData.activityLevel}
                onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Selecciona tu nivel</option>
                <option value="sedentary">Sedentario (poco ejercicio)</option>
                <option value="light">Ligero (1-3 días/semana)</option>
                <option value="moderate">Moderado (3-5 días/semana)</option>
                <option value="active">Activo (6-7 días/semana)</option>
                <option value="veryActive">Muy activo (ejercicio intenso)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Semanal de Peso (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.weeklyWeightGoal}
                onChange={(e) => handleInputChange('weeklyWeightGoal', parseFloat(e.target.value) || 0)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="-0.5"
              />
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Atrás
            </button>
          )}
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors ml-auto"
          >
            {step === 3 ? 'Completar' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen; 