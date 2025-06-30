import React, { useState, useEffect } from 'react';

const WeeklyProgress = () => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(0);

  useEffect(() => {
    loadWeeklyData();
  }, []);

  const loadWeeklyData = () => {
    const today = new Date();
    const weekData = [];
    
    // Get data for the last 4 weeks
    for (let week = 0; week < 4; week++) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (today.getDay() + 7 * week));
      weekStart.setHours(0, 0, 0, 0);
      
      const days = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + day);
        const dateStr = date.toISOString().split('T')[0];
        
        const meals = JSON.parse(localStorage.getItem(`caloriekit_meals_${dateStr}`) || '[]');
        const totalCalories = meals.reduce((sum, meal) => sum + (parseFloat(meal.calories) || 0), 0);
        const userProfile = JSON.parse(localStorage.getItem('caloriekit_user_profile') || '{}');
        const dailyGoal = userProfile.dailyGoal || 2000;
        
        days.push({
          date: dateStr,
          calories: totalCalories,
          goal: dailyGoal,
          meals: meals.length,
          isToday: dateStr === today.toISOString().split('T')[0]
        });
      }
      
      weekData.push({
        weekStart: weekStart.toISOString().split('T')[0],
        days: days,
        totalCalories: days.reduce((sum, day) => sum + day.calories, 0),
        avgCalories: Math.round(days.reduce((sum, day) => sum + day.calories, 0) / 7),
        goalMet: days.filter(day => day.calories >= day.goal * 0.8).length,
        hasData: days.some(day => day.calories > 0)
      });
    }
    
    setWeeklyData(weekData);
  };

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { weekday: 'short' });
  };

  const getProgressColor = (calories, goal) => {
    const percentage = (calories / goal) * 100;
    if (percentage < 60) return 'bg-red-500';
    if (percentage < 80) return 'bg-yellow-500';
    if (percentage < 100) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getWeekLabel = (weekStart) => {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    
    return `${start.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`;
  };

  const isCurrentWeek = (weekIndex) => {
    return weekIndex === 0;
  };

  if (weeklyData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 animate-fadeIn">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">📆 Progreso Semanal</h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
            <span className="text-2xl">📊</span>
          </div>
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">No has registrado comidas esta semana</h4>
          <p className="text-gray-600 dark:text-gray-400 mb-4">¡Empieza hoy para ver tu progreso semanal!</p>
          <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105">
            Agregar primera comida
          </button>
        </div>
      </div>
    );
  }

  const currentWeek = weeklyData[selectedWeek];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">📆 Progreso Semanal</h3>
        
        {/* Week Selector with horizontal scroll */}
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {weeklyData.map((week, index) => (
            <button
              key={index}
              onClick={() => setSelectedWeek(index)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                selectedWeek === index
                  ? 'bg-orange-500 text-white shadow-lg transform scale-105'
                  : isCurrentWeek(index)
                  ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-2 border-orange-300 dark:border-orange-600'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {isCurrentWeek(index) ? '📅 Esta Semana' : `Semana ${4 - index}`}
            </button>
          ))}
        </div>
      </div>

      {/* Week Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{currentWeek.avgCalories}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Promedio diario</div>
        </div>
        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{currentWeek.goalMet}/7</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Días con meta</div>
        </div>
        <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors duration-200">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{currentWeek.totalCalories}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total semanal</div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
          <span className="mr-2">📅</span>
          {getWeekLabel(currentWeek.weekStart)}
        </h4>
        
        <div className="grid grid-cols-7 gap-3">
          {currentWeek.days.map((day, index) => (
            <div key={index} className="text-center group">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
                {getDayName(day.date)}
              </div>
              
              {/* Progress Bar with enhanced visuals */}
              <div className="relative h-32 bg-gray-100 dark:bg-gray-700 rounded-lg mb-2 overflow-hidden group-hover:shadow-md transition-all duration-200">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10 bg-gradient-to-t from-gray-300 to-transparent"></div>
                
                {/* Progress bar with gradient */}
                <div
                  className={`absolute bottom-0 left-0 right-0 transition-all duration-700 ease-out ${getProgressColor(day.calories, day.goal)}`}
                  style={{ 
                    height: `${Math.min((day.calories / day.goal) * 100, 100)}%` 
                  }}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent"></div>
                </div>
                
                {/* Today indicator */}
                {day.isToday && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-orange-500 rounded-full shadow-lg animate-pulse"></div>
                )}
                
                {/* Hover tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  {day.calories} / {day.goal} cal
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-gray-800"></div>
                </div>
              </div>
              
              {/* Calories display */}
              <div className="text-xs font-medium text-gray-800 dark:text-gray-200">
                {day.calories > 0 ? day.calories : '-'}
              </div>
              
              {/* Goal indicator */}
              <div className="text-xs text-gray-400 dark:text-gray-500">
                /{day.goal}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Legend */}
      <div className="flex items-center justify-center space-x-4 text-xs bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded shadow-sm"></div>
          <span className="text-gray-600 dark:text-gray-300">&lt;60%</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-yellow-500 rounded shadow-sm"></div>
          <span className="text-gray-600 dark:text-gray-300">60-80%</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-500 rounded shadow-sm"></div>
          <span className="text-gray-600 dark:text-gray-300">80-100%</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded shadow-sm"></div>
          <span className="text-gray-600 dark:text-gray-300">&gt;100%</span>
        </div>
      </div>

      {/* No data message for empty weeks */}
      {!currentWeek.hasData && (
        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-600 dark:text-yellow-400">⚠️</span>
            <span className="text-sm text-yellow-800 dark:text-yellow-200">
              No hay datos registrados en esta semana
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyProgress; 