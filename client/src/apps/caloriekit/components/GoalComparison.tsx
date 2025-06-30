import React, { useState, useEffect } from 'react';
import { getWeightStats } from '../utils/api';

const GoalComparison = ({ userProfile, todayMeals }) => {
  const [weightStats, setWeightStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState('calories');

  useEffect(() => {
    loadWeightData();
  }, []);

  const loadWeightData = async () => {
    setLoading(true);
    setError(null);
    try {
      const weightData = await getWeightStats(7);
      
      // Validar que los datos sean válidos
      if (weightData && typeof weightData === 'object') {
        setWeightStats(weightData);
      } else {
        setWeightStats(null);
      }
    } catch (error) {
      console.error('Error loading weight data:', error);
      setError('Error al cargar datos de peso');
      setWeightStats(null);
    } finally {
      setLoading(false);
    }
  };

  const calculateTodayStats = () => {
    if (!todayMeals || !Array.isArray(todayMeals)) {
      return { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 };
    }
    const totalCalories = todayMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
    const totalProtein = todayMeals.reduce((sum, meal) => sum + (meal.protein || 0), 0);
    const totalCarbs = todayMeals.reduce((sum, meal) => sum + (meal.carbs || 0), 0);
    const totalFat = todayMeals.reduce((sum, meal) => sum + (meal.fat || 0), 0);

    return { totalCalories, totalProtein, totalCarbs, totalFat };
  };

  const getGoalTargets = () => {
    const calorieTarget = userProfile?.calorieTarget || 2000;
    const proteinTarget = userProfile?.proteinTarget || Math.round((calorieTarget * 0.3) / 4);
    const carbTarget = userProfile?.carbTarget || Math.round((calorieTarget * 0.4) / 4);
    const fatTarget = userProfile?.fatTarget || Math.round((calorieTarget * 0.3) / 9);

    return { calorieTarget, proteinTarget, carbTarget, fatTarget };
  };

  const getProgressPercentage = (current, target) => {
    if (target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage < 50) return 'bg-red-500';
    if (percentage < 80) return 'bg-yellow-500';
    if (percentage < 100) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getProgressTextColor = (percentage) => {
    if (percentage < 50) return 'text-red-600 dark:text-red-400';
    if (percentage < 80) return 'text-yellow-600 dark:text-yellow-400';
    if (percentage < 100) return 'text-orange-600 dark:text-orange-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getTrafficLightIcon = (percentage) => {
    if (percentage < 50) return '🔴';
    if (percentage < 80) return '🟡';
    if (percentage < 100) return '🟠';
    return '🟢';
  };

  const getWeightGoalStatus = () => {
    if (!weightStats || !weightStats.entries || !Array.isArray(weightStats.entries) || weightStats.entries.length === 0) {
      return null;
    }

    if (!userProfile?.targetWeight) {
      return null;
    }

    const currentWeight = weightStats.entries[weightStats.entries.length - 1]?.weight;
    const targetWeight = userProfile.targetWeight;
    const goal = userProfile.weightGoal; // 'lose', 'maintain', 'gain'

    if (!currentWeight || typeof currentWeight !== 'number') {
      return null;
    }

    const difference = currentWeight - targetWeight;
    const isOnTrack = (() => {
      switch (goal) {
        case 'lose':
          return difference > 0;
        case 'gain':
          return difference < 0;
        case 'maintain':
          return Math.abs(difference) <= 2; // 2kg tolerance
        default:
          return true;
      }
    })();

    return {
      currentWeight,
      targetWeight,
      difference: Math.abs(difference),
      isOnTrack,
      goal
    };
  };

  const renderCalorieComparison = () => {
    const { totalCalories } = calculateTodayStats();
    const { calorieTarget } = getGoalTargets();
    const percentage = getProgressPercentage(totalCalories, calorieTarget);

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-2">
            <span>🔥</span>
            <span>Calorías</span>
          </h4>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getTrafficLightIcon(percentage)}</span>
            <span className={`text-lg font-bold ${getProgressTextColor(percentage)}`}>
              {totalCalories} / {calorieTarget} cal
            </span>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
          <div 
            className={`${getProgressColor(percentage)} h-6 rounded-full transition-all duration-700 ease-out relative`}
            style={{ width: `${percentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className={`${getProgressTextColor(percentage)} font-medium`}>
            {Math.round(percentage)}% completado
          </span>
          <span className={`${getProgressTextColor(percentage)} font-medium`}>
            {Math.round(calorieTarget - totalCalories)} cal restantes
          </span>
        </div>

        {percentage > 100 && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg animate-pulse">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-600 dark:text-yellow-400">⚠️</span>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                Has excedido tu objetivo por <span className="font-bold">{Math.round(totalCalories - calorieTarget)} cal</span>
              </p>
            </div>
          </div>
        )}

        {percentage < 50 && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-red-600 dark:text-red-400">🔴</span>
              <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                Te faltan <span className="font-bold">{Math.round(calorieTarget - totalCalories)} cal</span> para alcanzar tu meta
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMacroComparison = () => {
    const { totalProtein, totalCarbs, totalFat } = calculateTodayStats();
    const { proteinTarget, carbTarget, fatTarget } = getGoalTargets();

    const macros = [
      { name: 'Proteínas', current: totalProtein, target: proteinTarget, color: 'bg-blue-500', textColor: 'text-blue-600 dark:text-blue-400', icon: '🥩' },
      { name: 'Carbohidratos', current: totalCarbs, target: carbTarget, color: 'bg-green-500', textColor: 'text-green-600 dark:text-green-400', icon: '🍞' },
      { name: 'Grasas', current: totalFat, target: fatTarget, color: 'bg-red-500', textColor: 'text-red-600 dark:text-red-400', icon: '🥑' }
    ];

    return (
      <div className="space-y-6 animate-fadeIn">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-2">
          <span>⚖️</span>
          <span>Macronutrientes</span>
        </h4>
        
        {macros.map((macro) => {
          const percentage = getProgressPercentage(macro.current, macro.target);
          
          return (
            <div key={macro.name} className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{macro.icon}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{macro.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{getTrafficLightIcon(percentage)}</span>
                  <span className={`text-sm font-semibold ${macro.textColor}`}>
                    {Math.round(macro.current)} / {macro.target}g
                  </span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div 
                  className={`${macro.color} h-3 rounded-full transition-all duration-700 ease-out relative`}
                  style={{ width: `${percentage}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span className="font-medium">{Math.round(percentage)}%</span>
                <span className="font-medium">{Math.round(macro.target - macro.current)}g restantes</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeightComparison = () => {
    if (loading) {
      return (
        <div className="text-center py-8 animate-fadeIn">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Cargando datos de peso...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8 animate-fadeIn">
          <p className="text-sm text-red-500 mb-2">{error}</p>
          <button 
            onClick={loadWeightData}
            className="text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
          >
            Reintentar
          </button>
        </div>
      );
    }

    const weightStatus = getWeightGoalStatus();
    
    if (!weightStatus) {
      return (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 animate-fadeIn">
          <div className="text-4xl mb-4">⚖️</div>
          <p className="font-medium">No hay datos de peso suficientes</p>
          <p className="text-sm">Registra tu peso para ver el progreso</p>
        </div>
      );
    }

    const { currentWeight, targetWeight, difference, isOnTrack, goal } = weightStatus;
    const goalText = {
      lose: 'Perder peso',
      gain: 'Ganar peso',
      maintain: 'Mantener peso'
    };

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-2">
            <span>⚖️</span>
            <span>Peso</span>
          </h4>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{isOnTrack ? '🟢' : '🔴'}</span>
            <span className={`text-sm font-semibold ${isOnTrack ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {isOnTrack ? 'En camino' : 'Fuera de camino'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{currentWeight} kg</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Peso actual</div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{targetWeight} kg</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Peso objetivo</div>
          </div>
        </div>
        
        <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors duration-200">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{difference.toFixed(1)} kg</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {goal === 'lose' ? 'Por perder' : goal === 'gain' ? 'Por ganar' : 'Diferencia'}
          </div>
        </div>
        
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Objetivo: {goalText[goal]}
          </p>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (selectedGoal) {
      case 'calories':
        return renderCalorieComparison();
      case 'macros':
        return renderMacroComparison();
      case 'weight':
        return renderWeightComparison();
      default:
        return renderCalorieComparison();
    }
  };

  const goalTabs = [
    { id: 'calories', label: 'Calorías', icon: '🔥' },
    { id: 'macros', label: 'Macros', icon: '⚖️' },
    { id: 'weight', label: 'Peso', icon: '⚖️' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">🎯 Comparación de Objetivos</h3>
      </div>

      {/* Enhanced Tab Selector */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        {goalTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedGoal(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
              selectedGoal === tab.id
                ? 'bg-white dark:bg-gray-600 text-orange-600 dark:text-orange-400 shadow-sm transform scale-105'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content with smooth transitions */}
      <div className="transition-all duration-300 ease-in-out">
        {renderContent()}
      </div>
    </div>
  );
};

export default GoalComparison;