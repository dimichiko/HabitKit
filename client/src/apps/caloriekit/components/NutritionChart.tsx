import React, { useState, useEffect } from 'react';
import { getMealsByDate } from '../utils/api';

// Tipos
interface Meal {
  _id: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: string;
  quantity: number;
  unit: string;
  date: string;
  servingSize?: string;
}

interface MealsByDay {
  [date: string]: Meal[];
}

interface MacroTotals {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

interface DailyAverages {
  avgCalories: number;
  avgProtein: number;
  avgCarbs: number;
  avgFat: number;
}

interface MacroPercentages {
  protein: number;
  carbs: number;
  fat: number;
}

const NutritionChart: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | '30days'>('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMeals();
  }, [selectedPeriod]);

  const loadMeals = async (): Promise<void> => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      if (selectedPeriod === 'week') {
        startDate.setDate(endDate.getDate() - 7);
      } else if (selectedPeriod === 'month') {
        startDate.setMonth(endDate.getMonth() - 1);
      } else {
        startDate.setDate(endDate.getDate() - 30);
      }

      const allMeals: Meal[] = [];
      const currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        try {
          const dateStr = currentDate.toISOString().split('T')[0];
          const dayMeals = await getMealsByDate(dateStr);
          allMeals.push(...dayMeals);
        } catch (error) {
          console.error(`Error loading meals for ${currentDate.toISOString().split('T')[0]}:`, error);
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      setMeals(allMeals);
    } catch (error) {
      console.error('Error loading meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMacros = (): MacroTotals => {
    const totalCalories = meals.reduce((sum: number, meal: Meal) => sum + (meal.calories || 0), 0);
    const totalProtein = meals.reduce((sum: number, meal: Meal) => sum + (meal.protein || 0), 0);
    const totalCarbs = meals.reduce((sum: number, meal: Meal) => sum + (meal.carbs || 0), 0);
    const totalFat = meals.reduce((sum: number, meal: Meal) => sum + (meal.fat || 0), 0);

    return { totalCalories, totalProtein, totalCarbs, totalFat };
  };

  const calculateDailyAverages = (): DailyAverages => {
    const days = selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 30;
    const { totalCalories, totalProtein, totalCarbs, totalFat } = calculateMacros();
    
    return {
      avgCalories: Math.round(totalCalories / days),
      avgProtein: Math.round((totalProtein / days) * 10) / 10,
      avgCarbs: Math.round((totalCarbs / days) * 10) / 10,
      avgFat: Math.round((totalFat / days) * 10) / 10
    };
  };

  const getMacroPercentages = (): MacroPercentages => {
    const { totalProtein, totalCarbs, totalFat } = calculateMacros();
    const totalMacros = totalProtein + totalCarbs + totalFat;
    
    if (totalMacros === 0) return { protein: 0, carbs: 0, fat: 0 };
    
    return {
      protein: Math.round((totalProtein / totalMacros) * 100),
      carbs: Math.round((totalCarbs / totalMacros) * 100),
      fat: Math.round((totalFat / totalMacros) * 100)
    };
  };

  const getMealsByDay = (): MealsByDay => {
    const mealsByDay: MealsByDay = {};
    meals.forEach((meal: Meal) => {
      const date = new Date(meal.date).toISOString().split('T')[0];
      if (!mealsByDay[date]) {
        mealsByDay[date] = [];
      }
      mealsByDay[date].push(meal);
    });
    return mealsByDay;
  };

  const renderMacroBar = (label: string, value: number, color: string, percentage: number): React.ReactElement => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-800">{value}g ({percentage}%)</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className={`h-3 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );

  const renderDailyChart = (): React.ReactElement => {
    const mealsByDay = getMealsByDay();
    const sortedDays = Object.keys(mealsByDay).sort();
    
    if (sortedDays.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No hay datos para mostrar en este período
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {sortedDays.slice(-7).map(day => {
          const dayMeals = mealsByDay[day];
          const dayCalories = dayMeals.reduce((sum: number, meal: Meal) => sum + (meal.calories || 0), 0);
          const dayProtein = dayMeals.reduce((sum: number, meal: Meal) => sum + (meal.protein || 0), 0);
          const dayCarbs = dayMeals.reduce((sum: number, meal: Meal) => sum + (meal.carbs || 0), 0);
          const dayFat = dayMeals.reduce((sum: number, meal: Meal) => sum + (meal.fat || 0), 0);
          
          const date = new Date(day);
          const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
          const dayNumber = date.getDate();
          
          return (
            <div key={day} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-16 text-center">
                <div className="text-sm font-medium text-gray-800">{dayName}</div>
                <div className="text-lg font-bold text-gray-600">{dayNumber}</div>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{dayCalories} cal</span>
                  <span className="text-xs text-gray-500">{dayMeals.length} comidas</span>
                </div>
                <div className="flex space-x-1 h-2">
                  <div 
                    className="bg-blue-500 rounded"
                    style={{ width: `${(dayProtein / (dayProtein + dayCarbs + dayFat)) * 100}%` }}
                  ></div>
                  <div 
                    className="bg-green-500 rounded"
                    style={{ width: `${(dayCarbs / (dayProtein + dayCarbs + dayFat)) * 100}%` }}
                  ></div>
                  <div 
                    className="bg-red-500 rounded"
                    style={{ width: `${(dayFat / (dayProtein + dayCarbs + dayFat)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-gray-600 mt-2">Cargando datos...</p>
        </div>
      </div>
    );
  }

  const { totalCalories, totalProtein, totalCarbs, totalFat } = calculateMacros();
  const { avgCalories, avgProtein, avgCarbs, avgFat } = calculateDailyAverages();
  const { protein, carbs, fat } = getMacroPercentages();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">📊 Análisis de Nutrición</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
              selectedPeriod === 'week'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
              selectedPeriod === 'month'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Mes
          </button>
        </div>
      </div>

      {/* Resumen total */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{totalCalories}</div>
          <div className="text-sm text-gray-600">Calorías totales</div>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{totalProtein}g</div>
          <div className="text-sm text-gray-600">Proteínas totales</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{totalCarbs}g</div>
          <div className="text-sm text-gray-600">Carbohidratos totales</div>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{totalFat}g</div>
          <div className="text-sm text-gray-600">Grasas totales</div>
        </div>
      </div>

      {/* Promedios diarios */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-800 mb-4">Promedios Diarios</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-gray-800">{avgCalories}</div>
            <div className="text-sm text-gray-600">cal/día</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-blue-600">{avgProtein}g</div>
            <div className="text-sm text-gray-600">proteína/día</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-green-600">{avgCarbs}g</div>
            <div className="text-sm text-gray-600">carbs/día</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-red-600">{avgFat}g</div>
            <div className="text-sm text-gray-600">grasas/día</div>
          </div>
        </div>
      </div>

      {/* Distribución de macronutrientes */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-800 mb-4">Distribución de Macronutrientes</h4>
        {renderMacroBar('Proteínas', totalProtein, 'bg-blue-500', protein)}
        {renderMacroBar('Carbohidratos', totalCarbs, 'bg-green-500', carbs)}
        {renderMacroBar('Grasas', totalFat, 'bg-red-500', fat)}
      </div>

      {/* Gráfico diario */}
      <div>
        <h4 className="text-lg font-medium text-gray-800 mb-4">Actividad de los Últimos 7 Días</h4>
        {renderDailyChart()}
      </div>
    </div>
  );
};

export default NutritionChart; 