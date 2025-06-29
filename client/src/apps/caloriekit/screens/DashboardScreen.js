import React, { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import { useMeals } from '../context/MealContext';
import NutritionTips from '../components/NutritionTips';
import WeeklyProgress from '../components/WeeklyProgress';
import WeightTracker from '../components/WeightTracker';
import GoalComparison from '../components/GoalComparison';

const DashboardScreen = ({ onNavigate, userProfile }) => {
  const { meals: todayMeals, loading, error, refreshMeals, setError } = useMeals();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Cargar datos solo una vez al montar el componente
    if (!initialized) {
      refreshMeals();
      setInitialized(true);
    }

    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, [initialized, refreshMeals]);

  // Cálculos seguros con validación
  const totalCalories = todayMeals.reduce((sum, meal) => sum + (parseFloat(meal.calories) || 0), 0);
  const totalProtein = todayMeals.reduce((sum, meal) => sum + (parseFloat(meal.protein) || 0), 0);
  const totalCarbs = todayMeals.reduce((sum, meal) => sum + (parseFloat(meal.carbs) || 0), 0);
  const totalFat = todayMeals.reduce((sum, meal) => sum + (parseFloat(meal.fat) || 0), 0);

  const dailyGoal = userProfile?.calorieTarget || 2000;
  const progressPercentage = Math.min((totalCalories / dailyGoal) * 100, 100);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return '¡Buenos días!';
    if (hour < 18) return '¡Buenas tardes!';
    return '¡Buenas noches!';
  };

  const getProgressColor = () => {
    if (progressPercentage < 80) return 'text-red-500';
    if (progressPercentage < 100) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getProgressBarColor = () => {
    if (progressPercentage < 80) return 'bg-red-500';
    if (progressPercentage < 100) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getProgressIcon = () => {
    if (progressPercentage < 50) return '🔴';
    if (progressPercentage < 80) return '🟡';
    if (progressPercentage < 100) return '🟠';
    return '🟢';
  };

  const getStreakDays = () => {
    // Calcular racha basada en comidas registradas consecutivamente
    // Por ahora usamos un valor fijo basado en el perfil del usuario
    const baseStreak = userProfile?.streakDays || 3;
    return Math.min(baseStreak, 7); // Máximo 7 días para demo
  };

  const getNextMeal = () => {
    const hour = currentTime.getHours();
    if (hour < 10) return 'Desayuno';
    if (hour < 14) return 'Almuerzo';
    if (hour < 20) return 'Cena';
    return 'Snack';
  };

  const translateMealType = (englishType) => {
    if (!englishType) return 'Comida';
    const mapping = {
      'breakfast': 'Desayuno',
      'lunch': 'Almuerzo',
      'dinner': 'Cena',
      'snack': 'Snack',
      'desayuno': 'Desayuno',
      'almuerzo': 'Almuerzo',
      'cena': 'Cena'
    };
    return mapping[englishType.toLowerCase()] || englishType;
  };

  const quickActions = [
    {
      title: 'Agregar Comida',
      icon: '🍽️',
      action: () => onNavigate('foodlog'),
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      title: 'Ver Analytics',
      icon: '📊',
      action: () => onNavigate('analytics'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Mis Alimentos',
      icon: '🍎',
      action: () => onNavigate('customfoods'),
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  const getMealIcon = (mealType) => {
    if (!mealType) return '🍽️';
    const type = mealType.toLowerCase();
    if (type.includes('breakfast') || type.includes('desayuno')) return '🥣';
    if (type.includes('lunch') || type.includes('almuerzo')) return '🍗';
    if (type.includes('dinner') || type.includes('cena')) return '🍽️';
    if (type.includes('snack')) return '🍎';
    return '🍽️';
  };

  const getMealTime = (meal) => {
    if (meal.createdAt) {
      return new Date(meal.createdAt).toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    return '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <div className="text-xl font-semibold">Cargando dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out forwards;
          }
        `}
      </style>
      <main className="max-w-7xl mx-auto p-6" style={{paddingTop:'80px'}}>
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg animate-fadeIn">
            {error}
            <button 
              onClick={() => setError(null)}
              className="float-right text-red-800 hover:text-red-900"
              aria-label="Cerrar mensaje de error"
            >
              ✕
            </button>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8 animate-fadeIn">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {getGreeting()}, {userProfile?.name || 'Usuario'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {currentTime.toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Calories Progress Card */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Progreso de Calorías</h3>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getProgressIcon()}</span>
                <span className={`text-lg font-bold ${getProgressColor()}`}>
                  <CountUp end={Math.round(progressPercentage)} duration={1.5} suffix="%" />
                </span>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
                <div 
                  className={`h-6 rounded-full transition-all duration-1000 ease-out ${getProgressBarColor()} relative`}
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </div>
              </div>
              <div className="flex justify-between text-sm mt-3">
                <span className={`${getProgressColor()} transition-colors font-medium`}>
                  {progressPercentage < 100 ? (
                    <>
                      <CountUp end={Math.round(totalCalories)} duration={1.5} /> / {dailyGoal} cal
                    </>
                  ) : (
                    '¡Meta alcanzada! 🎉'
                  )}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {progressPercentage < 100 ? (
                    <CountUp end={Math.round(dailyGoal - totalCalories)} duration={1.5} suffix=" cal restantes" />
                  ) : (
                    '¡Excelente trabajo!'
                  )}
                </span>
              </div>
            </div>

            {/* Macronutrients */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  <CountUp end={Math.round(totalProtein)} duration={1.5} suffix="g" />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Proteínas</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  <CountUp end={Math.round(totalCarbs)} duration={1.5} suffix="g" />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Carbohidratos</div>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  <CountUp end={Math.round(totalFat)} duration={1.5} suffix="g" />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Grasas</div>
              </div>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 animate-fadeIn">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Estadísticas Rápidas</h3>
            
            <div className="space-y-6">
              <div className="group relative">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                      <span className="text-xl">🔥</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Racha</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{getStreakDays()} días</p>
                    </div>
                  </div>
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  Días consecutivos registrando comidas
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
              
              <div className="group relative">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <span className="text-xl">🍽️</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Comidas Hoy</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{todayMeals.length}</p>
                    </div>
                  </div>
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  Comidas registradas hoy
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
              
              <div className="group relative">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <span className="text-xl">⏰</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Próxima Comida</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{getNextMeal()}</p>
                    </div>
                  </div>
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  Basado en la hora actual
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`${action.color} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fadeIn`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col items-center space-y-3 text-center">
                <span className="text-3xl">{action.icon}</span>
                <span className="font-semibold text-lg">{action.title}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Nutrition Tips Carousel */}
        <div className="mb-8">
          <NutritionTips />
        </div>

        {/* Recent Meals and Weekly Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Meals */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">🍽️ Comidas Recientes</h3>
              <button
                onClick={() => onNavigate('foodlog')}
                className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200"
              >
                <span>Ver todas</span>
                <span className="text-lg">➡️</span>
              </button>
            </div>

            {todayMeals.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🍽️</div>
                <p className="text-gray-600 dark:text-gray-400">No hay comidas registradas hoy</p>
                <button
                  onClick={() => onNavigate('foodlog')}
                  className="mt-4 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Agregar primera comida
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {todayMeals.slice(0, 3).map((meal) => (
                  <div 
                    key={meal._id} 
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col items-center">
                        <span className="text-2xl">{getMealIcon(meal.mealType)}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {getMealTime(meal)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{meal.foodName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {translateMealType(meal.mealType)}
                        </p>
                        {/* Macros tooltip */}
                        <div className="hidden group-hover:block absolute mt-2 p-2 bg-gray-800 text-white text-xs rounded-lg z-10">
                          <div>Proteínas: {meal.protein || 0}g</div>
                          <div>Carbohidratos: {meal.carbs || 0}g</div>
                          <div>Grasas: {meal.fat || 0}g</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {meal.calories || 0} cal
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {meal.servingSize || '1 porción'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <WeeklyProgress />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <WeightTracker />
          <GoalComparison userProfile={userProfile} />
        </div>
      </main>
    </div>
  );
};

export default DashboardScreen; 