import React, { useState, useEffect } from 'react';
import { getMealStats } from '../utils/api';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Tipos
interface DailyStat {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

interface Stats {
  dailyStats: DailyStat[];
  avgDailyCalories: number;
  avgDailyProtein: number;
  avgDailyCarbs: number;
  avgDailyFat: number;
  daysWithEntries: number;
  totalDays: number;
  maxDayCalories: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

interface MacroBlockProps {
  label: string;
  value: string | number;
  unit: string;
  icon: string;
  color: string;
}

interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins: {
    legend: {
      display: boolean;
    };
    title: {
      display: boolean;
      text: string;
      color: string;
      font: {
        size: number;
      };
    };
    tooltip?: {
      enabled: boolean;
      callbacks: {
        label: (context: any) => string;
      };
    };
  };
  scales: {
    x: {
      ticks: {
        color: string;
      };
      grid: {
        display: boolean;
      };
    };
    y: {
      ticks: {
        color: string;
      };
      grid: {
        color: string;
      };
    };
  };
  elements?: {
    bar: {
      backgroundColor: string;
      borderRadius: number;
    };
  };
}

const AnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [period]);

  const loadStats = async (): Promise<void> => {
    setLoading(true);
    try {
      const days = period === 'week' ? 7 : 30;
      const data = await getMealStats(days);
      setStats(data);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number, decimals: number = 1): number => {
    if (typeof num !== 'number') return 0;
    return parseFloat(num.toFixed(decimals));
  };

  const chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Actividad de los Últimos 7 Días',
        color: document.body.classList.contains('dark') ? '#fff' : '#333',
        font: {
          size: 16
        }
      },
    },
    scales: {
      x: {
        ticks: {
          color: document.body.classList.contains('dark') ? '#ccc' : '#666',
        },
        grid: {
          display: false
        }
      },
      y: {
        ticks: {
          color: document.body.classList.contains('dark') ? '#ccc' : '#666',
        },
        grid: {
          color: document.body.classList.contains('dark') ? '#444' : '#eee',
        }
      }
    }
  };

  const chartData = {
    labels: stats?.dailyStats.map((d: DailyStat) => new Date(d.date).toLocaleDateString('es-ES', { weekday: 'short' })) || [],
    datasets: [
      {
        label: 'Calorías',
        data: stats?.dailyStats.map((d: DailyStat) => d.totalCalories) || [],
        backgroundColor: '#f97316',
        borderRadius: 4,
      },
    ],
  };
  
  const renderStatCard = (title: string, value: string | number, unit: string, icon: string, colorClass: string): React.ReactElement => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className={`text-3xl font-bold ${colorClass}`}>{value} <span className="text-lg">{unit}</span></p>
        </div>
        <div className={`p-3 bg-opacity-20 rounded-full ${colorClass.replace('text-', 'bg-')}`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );

  const renderMacroDistribution = (): React.ReactElement => {
    if (!stats) return <div>No hay datos disponibles</div>;
    
    const totalMacros = (stats.totalProtein || 0) + (stats.totalCarbs || 0) + (stats.totalFat || 0);
    if (totalMacros === 0) {
      return (
        <div className="text-center py-4 text-gray-500">
          No hay datos de macros para mostrar la distribución.
        </div>
      );
    }

    const proteinPercentage = Math.round(((stats.totalProtein || 0) / totalMacros) * 100);
    const carbsPercentage = Math.round(((stats.totalCarbs || 0) / totalMacros) * 100);
    const fatPercentage = Math.round(((stats.totalFat || 0) / totalMacros) * 100);

    return (
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Proteínas</span>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{proteinPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${proteinPercentage}%` }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-green-600 dark:text-green-400">Carbohidratos</span>
            <span className="text-sm font-medium text-green-600 dark:text-green-400">{carbsPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${carbsPercentage}%` }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-red-600 dark:text-red-400">Grasas</span>
            <span className="text-sm font-medium text-red-600 dark:text-red-400">{fatPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${fatPercentage}%` }}></div>
          </div>
        </div>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Cargando analíticas...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">No se pudieron cargar los datos. Inténtalo de nuevo.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6" style={{paddingTop:'80px'}}>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Análisis de Progreso</h2>
            <p className="text-gray-600 dark:text-gray-400 text-base mb-2">Resumen de tus hábitos alimenticios del {stats.dailyStats?.[0]?.date ? new Date(stats.dailyStats[0].date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''} al {stats.dailyStats?.[stats.dailyStats.length-1]?.date ? new Date(stats.dailyStats[stats.dailyStats.length-1].date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}</p>
          </div>
          <div className="flex space-x-2 bg-gray-200 dark:bg-gray-700 p-1 rounded-full shadow-inner">
            <button
              onClick={() => setPeriod('week')}
              className={`px-6 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${period === 'week' ? 'bg-white dark:bg-gray-800 text-orange-500 shadow' : 'text-gray-700 dark:text-gray-300'}`}
              tabIndex={0}
            >
              Semana
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-6 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${period === 'month' ? 'bg-white dark:bg-gray-800 text-orange-500 shadow' : 'text-gray-700 dark:text-gray-300'}`}
              tabIndex={0}
            >
              Mes
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-10 border border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
          {renderStatCard('Promedio diario', formatNumber(stats.avgDailyCalories), 'cal', '📈', 'text-orange-600')}
          {renderStatCard('Días cumplidos', `${stats.daysWithEntries} / ${stats.totalDays}`, '', '🎯', 'text-green-600')}
          {renderStatCard('Mejor día', formatNumber(stats.maxDayCalories), 'cal', '🏆', 'text-blue-600')}
          {renderStatCard('Total periodo', formatNumber(stats.totalCalories, 0), 'cal', '📊', 'text-purple-600')}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-10 border border-gray-100 dark:border-gray-700">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Análisis de Macronutrientes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <MacroBlock label="Calorías totales" value={formatNumber(stats.totalCalories, 0)} unit="cal" icon="🔥" color="orange" />
            <MacroBlock label="Proteínas totales" value={formatNumber(stats.totalProtein)} unit="g" icon="🥩" color="blue" />
            <MacroBlock label="Carbohidratos totales" value={formatNumber(stats.totalCarbs)} unit="g" icon="🍚" color="green" />
            <MacroBlock label="Grasas totales" value={formatNumber(stats.totalFat)} unit="g" icon="🥑" color="red" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Promedios Diarios</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Calorías</span>
                  <span className="font-bold text-gray-900 dark:text-white">{formatNumber(stats.avgDailyCalories)} cal/día</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Proteínas</span>
                  <span className="font-bold text-gray-900 dark:text-white">{formatNumber(stats.avgDailyProtein)} g/día</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Carbohidratos</span>
                  <span className="font-bold text-gray-900 dark:text-white">{formatNumber(stats.avgDailyCarbs)} g/día</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Grasas</span>
                  <span className="font-bold text-gray-900 dark:text-white">{formatNumber(stats.avgDailyFat)} g/día</span>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Distribución de Macronutrientes</h3>
              {renderMacroDistribution()}
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl shadow p-6 border border-orange-200 dark:border-orange-800 flex items-center gap-4">
              <span className="text-3xl">🎯</span>
              <div>
                <div className="font-semibold text-orange-800 dark:text-orange-200">Comparación con la meta</div>
                <div className="text-gray-700 dark:text-gray-300 text-sm">Tu promedio esta semana fue <span className="font-bold">{formatNumber(stats.avgDailyCalories)}</span> cal sobre tu meta de <span className="font-bold">2000</span> cal/día.</div>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl shadow p-6 border border-blue-200 dark:border-blue-800 flex items-center gap-4">
              <span className="text-3xl">💡</span>
              <div>
                <div className="font-semibold text-blue-800 dark:text-blue-200">Insight</div>
                <div className="text-gray-700 dark:text-gray-300 text-sm">Comiste más grasa de lo planeado 3 días seguidos. ¿Quieres ajustar tus metas?</div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top alimentos más frecuentes</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-200"><span className="text-xl">🥚</span> Huevos <span className="ml-auto text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">5 veces</span></li>
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-200"><span className="text-xl">🥛</span> Leche <span className="ml-auto text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">3 veces</span></li>
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-200"><span className="text-xl">🍗</span> Pollo <span className="ml-auto text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">3 veces</span></li>
              </ul>
            </div>
          </div>
          <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 flex flex-col">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Calorías por Día</h3>
            <div className="h-96">
              <Bar options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  tooltip: {
                    enabled: true,
                    callbacks: {
                      label: function(context: any) {
                        return `${context.parsed.y} cal`;
                      }
                    }
                  },
                  annotation: {
                    annotations: {
                      line1: {
                        type: 'line',
                        yMin: 2000,
                        yMax: 2000,
                        borderColor: '#f59e42',
                        borderWidth: 2,
                        borderDash: [6, 6],
                        label: {
                          content: 'Meta diaria: 2000 cal',
                          enabled: true,
                          position: 'end',
                          color: '#f59e42',
                          font: { weight: 'bold' }
                        }
                      }
                    }
                  }
                },
                elements: {
                  bar: {
                    backgroundColor: '#fb923c',
                    borderRadius: 8
                  }
                }
              } as any} data={chartData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MacroBlock: React.FC<MacroBlockProps> = ({ label, value, unit, icon, color }) => {
  const [open, setOpen] = useState(false);
  return (
    <button
      className={`cursor-pointer bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col items-center border-2 border-transparent hover:shadow-2xl hover:border-${color}-400 transition-all duration-300 group`}
      onClick={() => setOpen(!open)}
    >
      <span className={`text-4xl mb-2`}>{icon}</span>
      <span className={`text-lg font-semibold text-${color}-700 dark:text-${color}-300 mb-1`}>{label}</span>
      <span className={`text-3xl font-bold text-${color}-600 dark:text-${color}-300`}>{value} <span className="text-lg">{unit}</span></span>
      {open && (
        <div className="mt-4 w-full bg-gray-50 dark:bg-gray-900/30 rounded-xl p-4 text-sm text-gray-700 dark:text-gray-200 animate-fade-in">
          <span>Desglose diario próximamente...</span>
        </div>
      )}
    </button>
  );
};

export default AnalyticsPage; 