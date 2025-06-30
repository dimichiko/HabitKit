import React, { useState, useEffect } from 'react';
import apiClient from '../utils/api';
import { FaLightbulb, FaHeart, FaBullseye, FaCheckCircle } from 'react-icons/fa';

interface Habit {
  _id: string;
  name: string;
  timesPerDay: number;
  folder?: string;
  color: string;
  goal?: string;
  motivation?: string;
}

interface Checkin {
  _id: string;
  date: string;
  habitId: string;
}

interface UserProfile {
  name?: string;
  goal?: string;
  motivation?: string;
}

interface Stats {
  currentStreak: number;
}

interface DashboardScreenProps {
  onNavigate: (route: string) => void;
}

interface QuickAction {
  title: string;
  icon: string;
  action: () => void;
  color: string;
}

interface Greeting {
  text: string;
  subtext: string;
}

interface InspirationContent {
  quote: string;
  goal: string;
  motivation: string;
}

const DashboardScreen = ({ onNavigate }: DashboardScreenProps) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [checkinCounts, setCheckinCounts] = useState<Record<string, number>>({});
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    // Load user profile
    const profile = localStorage.getItem('habitkit_user_profile');
    if (profile) {
      setUserProfile(JSON.parse(profile));
    }

    // Load habits and stats
    loadHabits();
    loadStats();

    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const loadHabits = async () => {
    try {
      const { data } = await apiClient.get('/habits');
      setHabits(data);
      loadCheckinCounts(data);
    } catch (error) {
      console.error('Error loading habits:', error);
    }
  };

  const loadCheckinCounts = async (habitsList: Habit[]) => {
    try {
      const counts: Record<string, number> = {};
      for (const habit of habitsList) {
        const { data } = await apiClient.get(`/habits/${habit._id}/checkins`);
        const todayYMD = new Date().toISOString().slice(0, 10);
        const todayCount = data.filter((c: Checkin) => c.date.slice(0, 10) === todayYMD).length;
        counts[habit._id] = todayCount;
      }
      setCheckinCounts(counts);
    } catch (error) {
      console.error('Error loading checkin counts:', error);
    }
  };

  const loadStats = async () => {
    try {
      if (habits.length > 0) {
        const { data } = await apiClient.get(`/habits/${habits[0]._id}/stats`);
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const totalHabits = habits.length;
  const completedToday = Object.values(checkinCounts).reduce((sum: number, count: number) => sum + count, 0);
  const totalTargets = habits.reduce((sum: number, habit: Habit) => sum + habit.timesPerDay, 0);
  const completionRate = totalTargets > 0 ? Math.round((completedToday / totalTargets) * 100) : 0;
  const streakDays = stats?.currentStreak || 0;

  const getMotivationalGreeting = (): Greeting => {
    const hour = currentTime.getHours();
    const userName = userProfile?.name || 'Usuario';
    
    const greetings: Greeting[] = [
      { text: `¡Vamos, ${userName}! 💪`, subtext: 'Hoy puedes lograr tu objetivo' },
      { text: `¡Buenos días, ${userName}! 🌅`, subtext: 'Un nuevo día para brillar' },
      { text: `¡Buenas tardes, ${userName}! ☀️`, subtext: 'Mantén el momentum' },
      { text: `¡Buenas noches, ${userName}! 🌙`, subtext: 'Reflexiona sobre tus logros' }
    ];
    
    if (hour < 12) return greetings[1];
    if (hour < 18) return greetings[2];
    return greetings[3];
  };

  const getProgressColor = (): string => {
    if (completionRate < 50) return 'text-red-500';
    if (completionRate < 80) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getProgressBarColor = (): string => {
    if (completionRate < 50) return 'bg-red-500';
    if (completionRate < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const quickActions: QuickAction[] = [
    {
      title: 'Ver Hábitos',
      icon: '✅',
      action: () => onNavigate('habits'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Calendario',
      icon: '📅',
      action: () => onNavigate('calendar'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Estadísticas',
      icon: '📈',
      action: () => onNavigate('stats'),
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  const getRecentHabits = (): Habit[] => {
    return habits
      .sort((a: Habit, b: Habit) => {
        const aCount = checkinCounts[a._id] || 0;
        const bCount = checkinCounts[b._id] || 0;
        return bCount - aCount;
      })
      .slice(0, 5);
  };

  const getInspirationContent = (): InspirationContent => {
    const motivationalQuotes = [
      "Los hábitos se construyen día a día. No te rindas si fallas un día, ¡lo importante es volver a intentarlo al siguiente!",
      "Comienza con hábitos pequeños y específicos. Es mejor hacer 1 minuto de meditación todos los días que 30 minutos una vez por semana.",
      "La consistencia es la clave del éxito. Cada pequeño paso cuenta hacia tu objetivo final.",
      "Los grandes cambios comienzan con pequeñas decisiones diarias. ¡Tú tienes el poder de transformar tu vida!"
    ];
    
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    
    return {
      quote: randomQuote,
      goal: userProfile?.goal || 'Construye hábitos que te ayuden a alcanzar tus metas',
      motivation: userProfile?.motivation || 'Cada pequeño paso cuenta hacia tu objetivo final'
    };
  };

  const inspiration = getInspirationContent();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {getMotivationalGreeting().text}
          </h2>
          <p className="text-gray-600 mb-1">
            {getMotivationalGreeting().subtext}
          </p>
          <p className="text-gray-500 text-sm">
            {currentTime.toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Hábitos</p>
                <p className="text-2xl font-bold text-gray-900">{totalHabits}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {habits.filter((h: Habit) => h.folder).length} organizados
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completados Hoy</p>
                <p className="text-2xl font-bold text-green-600">{completedToday}</p>
                <p className="text-xs text-gray-500 mt-1">
                  de {totalTargets} objetivos
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasa de Éxito</p>
                <p className={`text-2xl font-bold ${getProgressColor()}`}>{completionRate}%</p>
                <p className="text-xs text-gray-500 mt-1">
                  {completionRate >= 80 ? '¡Excelente!' : completionRate >= 50 ? 'Buen trabajo' : 'Sigue intentando'}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Racha Actual</p>
                <p className="text-2xl font-bold text-orange-600">{streakDays}</p>
                <p className="text-xs text-gray-500 mt-1">
                  días consecutivos
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Progreso del Día</h3>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progreso General</span>
              <span className={`text-sm font-bold ${getProgressColor()}`}>
                {completedToday} / {totalTargets}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full transition-all duration-500 ${getProgressBarColor()}`}
                style={{ width: `${Math.min(completionRate, 100)}%` }}
              ></div>
            </div>
          </div>

          {habits.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {habits.slice(0, 6).map((habit: Habit) => {
                const todayCount = checkinCounts[habit._id] || 0;
                const habitProgress = Math.min((todayCount / habit.timesPerDay) * 100, 100);
                
                return (
                  <div key={habit._id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800 text-sm">{habit.name}</span>
                      <span className="text-xs text-gray-500">
                        {todayCount}/{habit.timesPerDay}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          habitProgress >= 100 ? 'bg-green-500' : 
                          habitProgress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${habitProgress}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Featured Habits - Moved here */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaBullseye className="text-green-500" />
            Hábitos Destacados
          </h3>
          
          {habits.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <FaLightbulb className="w-8 h-8 text-green-500" />
              </div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">No tienes hábitos activos hoy</h4>
              <p className="text-gray-600 mb-4">¡Crea tu primer hábito y comienza tu transformación!</p>
              <button
                onClick={() => onNavigate('habits')}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition"
              >
                Crear Hábito
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {getRecentHabits().map((habit: Habit) => {
                const todayCount = checkinCounts[habit._id] || 0;
                const isComplete = todayCount >= habit.timesPerDay;
                
                return (
                  <div key={habit._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: habit.color + '20' }}
                      >
                        <span className="text-sm" style={{ color: habit.color }}>
                          {isComplete ? '✅' : '⏳'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{habit.name}</p>
                        <p className="text-sm text-gray-500">
                          {todayCount}/{habit.timesPerDay} completados hoy
                        </p>
                      </div>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      isComplete 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {isComplete ? 'Completado' : 'Pendiente'}
                    </div>
                  </div>
                );
              })}
              
              {habits.length > 5 && (
                <div className="text-center pt-2">
                  <button
                    onClick={() => onNavigate('habits')}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Ver todos los hábitos ({habits.length})
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action: QuickAction, index: number) => (
              <button
                key={index}
                onClick={action.action}
                className={`${action.color} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{action.icon}</div>
                  <div className="font-semibold">{action.title}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Inspiration Box - Combined and Compact */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 border border-green-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaHeart className="text-green-500" />
            Inspiración
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/60 p-4 rounded-lg border border-green-200/50">
              <div className="flex items-center gap-2 mb-2">
                <FaBullseye className="text-green-500 text-sm" />
                <h4 className="font-semibold text-gray-800 text-sm">Tu Objetivo</h4>
              </div>
              <p className="text-gray-600 text-sm">
                {inspiration.goal}
              </p>
            </div>

            <div className="bg-white/60 p-4 rounded-lg border border-green-200/50">
              <div className="flex items-center gap-2 mb-2">
                <FaHeart className="text-green-500 text-sm" />
                <h4 className="font-semibold text-gray-800 text-sm">Recordatorio</h4>
              </div>
              <p className="text-gray-600 text-sm">
                {inspiration.motivation}
              </p>
            </div>

            <div className="bg-white/60 p-4 rounded-lg border border-green-200/50">
              <div className="flex items-center gap-2 mb-2">
                <FaLightbulb className="text-green-500 text-sm" />
                <h4 className="font-semibold text-gray-800 text-sm">Consejo del Día</h4>
              </div>
              <p className="text-gray-600 text-sm">
                &quot;{inspiration.quote}&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen; 