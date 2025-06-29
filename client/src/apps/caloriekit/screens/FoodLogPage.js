import React, { useState } from 'react';
import { useMeals } from '../context/MealContext';
import MealEntry from '../components/MealEntry';
import CustomFoodsManager from '../components/CustomFoodsManager';

// Función centralizada para mapear tipos de comida
const mapMealTypeToEnglish = (spanishType) => {
  if (!spanishType) return 'snack';
  const mapping = {
    'desayuno': 'breakfast',
    'almuerzo': 'lunch',
    'cena': 'dinner',
    'snack': 'snack'
  };
  return mapping[spanishType.toLowerCase()] || spanishType.toLowerCase();
};

const FoodLogPage = ({ userProfile }) => {
  const { 
    meals, 
    loading, 
    error, 
    selectedDate, 
    changeDate, 
    addMeal, 
    deleteMeal, 
    setError 
  } = useMeals();
  
  const [showMealEntry, setShowMealEntry] = useState(false);
  const [activeMealType, setActiveMealType] = useState('Desayuno');

  const dailyGoal = userProfile?.calorieTarget || 2000;

  const handleMealAdd = async (mealData) => {
    try {
      await addMeal({
        ...mealData,
        mealType: mapMealTypeToEnglish(activeMealType)
      });
      setShowMealEntry(false);
    } catch (error) {
      console.error("Error al añadir la comida:", error);
      setError('Error al añadir la comida. Inténtalo de nuevo.');
    }
  };

  const handleMealDelete = async (mealId) => {
    try {
      await deleteMeal(mealId);
    } catch (error) {
      console.error("Error al eliminar la comida:", error);
      setError('Error al eliminar la comida. Inténtalo de nuevo.');
    }
  };

  const handleDateChange = (date) => {
    changeDate(date);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Fecha inválida');
      }
      return date.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Fecha inválida';
    }
  };

  const getMealsByType = (type) => {
    const englishType = mapMealTypeToEnglish(type);
    return meals.filter(meal => meal.mealType === englishType);
  };

  const getTotalCaloriesByType = (type) => {
    return getMealsByType(type).reduce((sum, meal) => sum + (meal.calories || 0), 0);
  };

  const mealTypes = [
    { 
      id: 'Desayuno', 
      icon: '🌅', 
      color: 'bg-yellow-500', 
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700'
    },
    { 
      id: 'Almuerzo', 
      icon: '🌞', 
      color: 'bg-orange-500', 
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    { 
      id: 'Cena', 
      icon: '🌙', 
      color: 'bg-blue-500', 
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    { 
      id: 'Snack', 
      icon: '🍎', 
      color: 'bg-green-500', 
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    }
  ];

  const totalCalories = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  const progressPercentage = Math.min((totalCalories / dailyGoal) * 100, 100);

  const getProgressBarColor = () => {
    if (progressPercentage < 50) return 'bg-red-500';
    if (progressPercentage < 80) return 'bg-yellow-500';
    if (progressPercentage < 100) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getProgressTextColor = () => {
    if (progressPercentage < 50) return 'text-red-600';
    if (progressPercentage < 80) return 'text-yellow-600';
    if (progressPercentage < 100) return 'text-orange-600';
    return 'text-green-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <div className="text-xl font-semibold">Cargando comidas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800" style={{paddingTop:'80px'}}>
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-gray-900 dark:to-gray-800 py-6 px-6 shadow-sm">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔥</span>
              <span className="text-xl font-bold text-orange-700 dark:text-orange-300">{totalCalories} / {dailyGoal} kcal</span>
              <span className={`ml-3 px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-gray-800 shadow border ${getProgressBarColor()} animate-pulse`}>{Math.round(progressPercentage)}% completado</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative overflow-hidden mt-2">
              <div 
                className={`h-6 rounded-full transition-all duration-700 ${getProgressBarColor()}`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          <div className="flex-1 flex justify-end">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl px-6 py-4 flex items-center gap-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <span className="text-lg">📅</span>
                <span className="font-medium">{formatDate(selectedDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <span className="text-lg">🎯</span>
                <span className="font-medium">Meta diaria: {dailyGoal} cal</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg">
            {error}
            <button 
              onClick={() => setError(null)}
              className="float-right text-red-800 dark:text-red-300 hover:text-red-900"
              aria-label="Cerrar mensaje de error"
            >
              ✕
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navegación de tipos de comida */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Tipos de Comida</h3>
              <div className="space-y-2">
                {mealTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setActiveMealType(type.id);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 border-2 ${
                      activeMealType === type.id
                        ? `${type.bgColor} ${type.textColor} border-current shadow-lg`
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{type.icon}</span>
                      <span className="font-medium">{type.id}</span>
                      <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${type.color}`}></span>
                    </div>
                    <div className="text-sm">
                      {getTotalCaloriesByType(type.id)} cal
                    </div>
                  </button>
                ))}
              </div>

              {/* Botón global para agregar comida */}
              <button
                onClick={() => setShowMealEntry(true)}
                className="w-full mt-6 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow transition-all duration-200 transform hover:scale-105"
              >
                + Agregar Comida
              </button>

              {/* Botón escanear/buscar */}
              <button
                className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl border border-gray-200 dark:border-gray-700 text-sm transition-all duration-200"
              >
                <span className="text-lg">📷</span> Escanear o buscar comida
              </button>
            </div>
          </div>

          {/* Lista de comidas por tipo */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 min-h-[350px] transition-all duration-500 border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
                {activeMealType} - {getTotalCaloriesByType(activeMealType)} cal
                <button
                  onClick={() => setShowMealEntry(true)}
                  className="ml-auto px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow transition-all duration-200 text-sm font-semibold"
                >
                  + Agregar {activeMealType.toLowerCase()}
                </button>
              </h3>
              
              {getMealsByType(activeMealType).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
                  <div className="text-7xl mb-4">🍽️</div>
                  <p className="text-lg text-gray-600 mb-2">Aún no has agregado {activeMealType.toLowerCase()} hoy. ¿Te apetece algo saludable?</p>
                  <button
                    onClick={() => setShowMealEntry(true)}
                    className="mt-4 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg text-lg font-bold transition-all duration-200"
                  >
                    + Añadir {activeMealType.toLowerCase()}
                  </button>
                  {/* Sugerencia rápida */}
                  <div className="mt-6 text-sm text-gray-500">
                    ¿Quieres registrar tu {activeMealType.toLowerCase()} favorito de ayer?
                    <button className="ml-2 underline text-orange-600 hover:text-orange-800">Reutilizar comida anterior</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  {getMealsByType(activeMealType).map((meal) => (
                    <div 
                      key={meal._id} 
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 shadow-sm transition-all duration-300 group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-xl">🍽️</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{meal.foodName}</h4>
                          <p className="text-xs text-gray-600">
                            {meal.amount && meal.unit ? `${meal.amount}${meal.unit}` : '1 porción'} • {meal.calories || 0} cal • {meal.protein || 0}g proteína • {meal.carbs || 0}g carbs • {meal.fat || 0}g grasas
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button className="p-2 text-gray-400 hover:text-orange-600" title="Editar">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h2v2a2 2 0 002 2h2a2 2 0 002-2v-2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2H7a2 2 0 00-2 2v2a2 2 0 002 2z" /></svg>
                        </button>
                        <button onClick={() => handleMealDelete(meal._id)} className="p-2 text-red-400 hover:text-red-600" title="Eliminar">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal para agregar comida */}
        {showMealEntry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <MealEntry
                onMealAdded={handleMealAdd}
                onClose={() => setShowMealEntry(false)}
                mealType={activeMealType}
                userProfile={userProfile}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FoodLogPage; 