import React, { useState } from 'react';

interface Meal {
  id: string;
  food: string;
  type: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface DailySummaryProps {
  meals: Meal[];
  waterIntake?: number;
  exercise?: number;
  dailyGoal?: number;
}

const DailySummary = ({ meals, waterIntake, exercise, dailyGoal = 2000 }: DailySummaryProps) => {
  const [waterAmount, setWaterAmount] = useState<number>(waterIntake || 0);
  const [exerciseAmount, setExerciseAmount] = useState<number>(exercise || 0);

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = meals.reduce((sum, meal) => sum + meal.fat, 0);

  const netCalories = totalCalories - exerciseAmount;
  const remainingCalories = dailyGoal - netCalories;
  const progressPercentage = Math.min((netCalories / dailyGoal) * 100, 100);

  const getProgressColor = (): string => {
    if (progressPercentage < 80) return 'bg-red-500';
    if (progressPercentage < 100) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getRemainingColor = (): string => {
    if (remainingCalories > 0) return 'text-green-600';
    return 'text-red-600';
  };

  const handleWaterAdd = (amount: number): void => {
    setWaterAmount(prev => prev + amount);
  };

  const handleExerciseAdd = (amount: number): void => {
    setExerciseAmount(prev => prev + amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Resumen del Día</h3>
      
      {/* Calorías principales */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Calorías consumidas</span>
          <span className="text-lg font-bold text-orange-600">{totalCalories} / {dailyGoal}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className={getRemainingColor()}>
            {remainingCalories > 0 ? `+${remainingCalories} restantes` : `${Math.abs(remainingCalories)} excedidas`}
          </span>
          <span className="text-gray-500">{Math.round(progressPercentage)}%</span>
        </div>
      </div>

      {/* Macronutrientes */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{Math.round(totalProtein)}g</div>
          <div className="text-sm text-gray-600">Proteínas</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{Math.round(totalCarbs)}g</div>
          <div className="text-sm text-gray-600">Carbohidratos</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{Math.round(totalFat)}g</div>
          <div className="text-sm text-gray-600">Grasas</div>
        </div>
      </div>

      {/* Agua */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Agua consumida</span>
          <span className="text-lg font-bold text-blue-600">{waterAmount}ml</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleWaterAdd(250)}
            className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition"
          >
            +250ml
          </button>
          <button
            onClick={() => handleWaterAdd(500)}
            className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition"
          >
            +500ml
          </button>
          <button
            onClick={() => setWaterAmount(0)}
            className="px-3 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg text-sm font-medium transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Ejercicio */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Calorías quemadas</span>
          <span className="text-lg font-bold text-green-600">{exerciseAmount} cal</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleExerciseAdd(100)}
            className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition"
          >
            +100 cal
          </button>
          <button
            onClick={() => handleExerciseAdd(300)}
            className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition"
          >
            +300 cal
          </button>
          <button
            onClick={() => setExerciseAmount(0)}
            className="px-3 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg text-sm font-medium transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Comidas del día */}
      <div>
        <h4 className="text-sm font-medium text-gray-600 mb-2">Comidas registradas</h4>
        {meals.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay comidas registradas hoy</p>
        ) : (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {meals.map((meal) => (
              <div key={meal.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <span className="text-sm font-medium text-gray-900">{meal.food}</span>
                  <span className="text-xs text-gray-500 ml-2">({meal.type})</span>
                </div>
                <span className="text-sm font-semibold text-orange-600">{meal.calories} cal</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailySummary; 