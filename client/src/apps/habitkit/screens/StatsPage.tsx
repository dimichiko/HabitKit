import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import apiClient from '../utils/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FaFire, FaTrophy, FaCalendarAlt, FaChartBar, FaCheckCircle, FaStar } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Habit {
  _id: string;
  timesPerDay: number;
}

interface Checkin {
  _id: string;
  date: string;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderRadius: number;
    borderSkipped: boolean;
    maxBarThickness: number;
  }[];
}

interface Stats {
  noHabits?: boolean;
  rachaActual: number;
  rachaMax: number;
  topDias: [string, number][];
  promedioSemanal: number;
  metaDiaria: number;
  labels?: string[];
}

type DateRange = '7' | '30' | 'current';

const StatsPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>('7'); // 7, 30, current

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const { data: habits } = await apiClient.get('/habits');

        if (habits.length === 0) {
          setStats({ noHabits: true, rachaActual: 0, rachaMax: 0, topDias: [], promedioSemanal: 0, metaDiaria: 0 });
          setLoading(false);
          return;
        }

        let rachaActual = 0;
        let rachaMax = 0;
        const dias: Record<string, number> = {};
        for (const habit of habits) {
          const { data: checkins } = await apiClient.get(`/habits/${habit._id}/checkins`);
          checkins.forEach((c: Checkin) => {
            const d = c.date.slice(0, 10);
            dias[d] = (dias[d] || 0) + 1;
          });
          // Racha actual y máxima (por hábito)
          let curr = 0, max = 0, prev: Date | null = null;
          checkins.forEach((c: Checkin) => {
            const date = new Date(c.date);
            date.setHours(0,0,0,0);
            if (!prev) { curr = 1; max = 1; }
            else {
              const diff = (date.getTime() - prev.getTime()) / (1000*60*60*24);
              if (diff === 1) curr++;
              else curr = 1;
              if (curr > max) max = curr;
            }
            prev = date;
          });
          if (curr > rachaActual) rachaActual = curr;
          if (max > rachaMax) rachaMax = max;
        }
        // Ordenar días por fecha
        const fechas = Object.keys(dias).sort();
        const metaDiaria = habits.reduce((sum: number, h: Habit) => sum + h.timesPerDay, 0);
        setChartData({
          labels: fechas,
          datasets: [{
            label: 'Hábitos completados',
            data: fechas.map((f: string) => dias[f]),
            backgroundColor: fechas.map((f: string, i: number) => {
              const value = dias[f];
              const prevValue = i > 0 ? dias[fechas[i-1]] : 0;
              if (value >= metaDiaria) return 'rgba(34,197,94,0.9)'; // verde meta alcanzada
              if (value > prevValue) return 'rgba(34,197,94,0.7)'; // verde progreso
              if (value < prevValue) return 'rgba(34,197,94,0.4)'; // verde caída
              return 'rgba(34,197,94,0.6)'; // verde estable
            }),
            borderRadius: 8,
            borderSkipped: false,
            maxBarThickness: 36
          }]
        });
        // Días top
        const topDias = Object.entries(dias).sort((a: [string, number], b: [string, number]) => b[1]-a[1]).slice(0,3);
        const promedioSemanal = Object.values(dias).reduce((sum: number, val: number) => sum + val, 0) / Math.max(Object.keys(dias).length, 1);
        setStats({
          rachaActual,
          rachaMax,
          topDias,
          promedioSemanal,
          metaDiaria
        });
      } catch {
        setStats(null);
      }
      setLoading(false);
    };
    fetchStats();
  }, [dateRange]);

  if (loading) return <div className="flex justify-center items-center h-screen bg-gray-50"><div className="text-xl font-semibold text-green-600">Cargando estadísticas...</div></div>;
  if (!stats) return <div className="flex justify-center items-center h-screen bg-gray-50"><div className="text-red-500 text-xl">No se pudieron cargar las estadísticas.</div></div>;

  if (stats.noHabits) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="container max-w-lg mx-auto px-4 py-8 text-center">
            <div className="bg-white rounded-xl shadow-sm p-10">
                <div className="text-6xl mb-4">📊</div>
                <h2 className="text-2xl font-bold mb-2 text-gray-800">Estadísticas de tus hábitos</h2>
                <p className="text-gray-600 mb-6">Visualiza tu progreso, rachas y constancia semanal.</p>
                <p className="text-lg font-medium text-gray-800">Aún no has creado ningún hábito.</p>
                <p className="text-gray-500 mt-1">¡Crea un hábito y completa tus metas para ver aquí tus estadísticas!</p>
            </div>
        </div>
      </div>
    )
  }

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Rendimiento Diario', font: { size: 18, weight: 'bold' }, padding: { top: 10, bottom: 20 } },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: { weight: 'bold' },
        bodyFont: { size: 14 },
        displayColors: false,
        callbacks: {
          label: function (context: any) {
            const value = context.parsed.y;
            const label = value === 1 ? 'hábito completado' : 'hábitos completados';
            const date = new Date(context.label).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
            return `${value} ${label} el ${date}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: { display: false },
        ticks: { font: { size: 12 } },
        grid: {
          display: false
        }
      },
      y: {
        title: { display: false },
        beginAtZero: true,
        ticks: { font: { size: 12 } },
        grid: {
          color: 'rgba(0,0,0,0.05)'
        }
      }
    }
  };

  return (
    <div className="bg-gray-50" style={{height:'100vh',overflow:'hidden',paddingTop:'80px'}}>
      <div className="container max-w-5xl mx-auto px-2 sm:px-4 py-6">
        {/* Selector de rango Fijo */}
        <div className="sticky top-0 z-10 bg-gray-50/80 backdrop-blur-sm py-3 mb-6">
          <div className="flex justify-center sm:justify-start gap-2">
            <button
              onClick={() => setDateRange('7')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-sm transition-all ${dateRange === '7' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
            >
              <div className="flex items-center space-x-2">
                <span>📅</span>
                <span className="text-sm font-medium text-gray-600">Últimos 7 días</span>
              </div>
            </button>
            <button
              onClick={() => setDateRange('30')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-sm transition-all ${dateRange === '30' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
            >
              <div className="flex items-center space-x-2">
                <span>📅</span>
                <span className="text-sm font-medium text-gray-600">Últimos 30 días</span>
              </div>
            </button>
            <button
              onClick={() => setDateRange('current')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-sm transition-all ${dateRange === 'current' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
            >
              <div className="flex items-center space-x-2">
                <span>📅</span>
                <span className="text-sm font-medium text-gray-600">Mes actual</span>
              </div>
            </button>
          </div>
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Columna Izquierda: Gráfico y Resumen */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-4 h-80">
              {chartData && chartData.labels.length > 0 ? <Bar data={chartData} options={chartOptions} /> : <div className="flex items-center justify-center h-full text-center p-10 text-gray-500">No hay datos para mostrar en este rango.</div>}
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100/80">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-green-700">Promedio semanal</p>
                        <p className="text-2xl font-bold text-green-800">{stats.promedioSemanal.toFixed(1)} hábitos/día</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-green-700">Meta diaria</p>
                        <p className="text-2xl font-bold text-green-800">{stats.metaDiaria} hábitos</p>
                    </div>
                </div>
            </div>
          </div>

          {/* Columna Derecha: Rachas y Mejores Días */}
          <div className="space-y-6">
            {/* Rachas */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="flex items-center space-x-2">
                  <span>📊</span>
                  <span className="text-sm font-medium text-gray-600">Racha</span>
                </div>
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                      <span>🔥</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Racha actual</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.rachaActual} días</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                      <span>🏆</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Racha más larga</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.rachaMax} días</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Mejores días */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="flex items-center space-x-2">
                  <span>⭐</span>
                  <span className="text-sm font-medium text-gray-600">Mejores Días</span>
                </div>
              </h3>
              <div className="space-y-3">
                {stats.topDias.map(([fecha, total]) => (
                  <div key={fecha} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <span>✅</span>
                      <span className="text-sm font-medium text-gray-600">Completado</span>
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold text-sm text-gray-700">{new Date(fecha).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' })}</p>
                      <p className="text-xs text-gray-500">{total} hábitos completados</p>
                    </div>
                    <span className="text-sm font-bold text-gray-800">{total}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage; 