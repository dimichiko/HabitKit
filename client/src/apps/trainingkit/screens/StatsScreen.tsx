import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { statsClient } from '../utils/api';

interface Summary {
  byType: Record<string, number>;
  byWeek: Record<string, number>;
  byMonth: Record<string, number>;
  totalDuration: number;
}

interface Streaks {
  currentStreak: number;
  maxStreak: number;
}

interface StatsScreenProps {
  onNavigate: (path: string) => void;
}

interface PieDataItem {
  name: string;
  value: number;
  color: string;
}

interface BarDataItem {
  name: string;
  value: number;
}

interface FilterOption {
  label: string;
  value: string;
}

const colores = ['#6366f1', '#4ade80', '#fbbf24', '#f472b6', '#60a5fa', '#a78bfa'];
const frases = [
  '¡Vas mejorando semana a semana! 💪',
  'Racha reiniciada, pero nunca es tarde para volver.',
  '¡Sigue así, tu constancia es clave!',
  '¡Increíble progreso, no pares!',
];

const filtros: FilterOption[] = [
  { label: 'Mes actual', value: 'mes' },
  { label: 'Últimos 30 días', value: '30d' },
  { label: 'Todo el año', value: 'año' },
];

function filtrarDatos(summary: Summary | null, filtro: string): Summary | null {
  if (!summary) return summary;
  if (filtro === 'mes') {
    const mes = new Date().getMonth() + 1;
    const año = new Date().getFullYear();
    const byWeek = Object.fromEntries(Object.entries(summary.byWeek).filter(([k]) => k.startsWith(`${año}-W`)));
    const byMonth = Object.fromEntries(Object.entries(summary.byMonth).filter(([k]) => k === `${año}-${mes}`));
    return { ...summary, byWeek, byMonth };
  }
  if (filtro === '30d') {
    // No implementado, se puede mejorar con fechas reales
    return summary;
  }
  return summary;
}

const StatsScreen: React.FC<StatsScreenProps> = ({ onNavigate }) => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [streaks, setStreaks] = useState<Streaks | null>(null);
  const [filtro, setFiltro] = useState<string>('mes');
  const [frase, setFrase] = useState<string>(frases[0]);

  useEffect(() => {
    statsClient.get('/summary').then(res => setSummary(res.data));
    statsClient.get('/streaks').then(res => setStreaks(res.data));
    setFrase(frases[Math.floor(Math.random() * frases.length)]);
  }, []);

  const datos = filtrarDatos(summary, filtro);

  if (!summary || !streaks) return <div className="p-6">Cargando estadísticas...</div>;

  const pieData: PieDataItem[] = Object.keys(datos?.byType || {}).map((k, i) => ({ 
    name: k, 
    value: datos!.byType[k], 
    color: colores[i % colores.length] 
  }));
  const barData: BarDataItem[] = Object.keys(datos?.byWeek || {}).map((k, i) => ({ 
    name: k, 
    value: datos!.byWeek[k] 
  }));

  const emptyStats = streaks.currentStreak === 0 && streaks.maxStreak === 0 && summary.totalDuration === 0;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <div className="text-xl font-bold mb-2">{frase}</div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <motion.div whileHover={{ scale: 1.04 }} className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
            <span className="text-3xl text-orange-500 mb-2">🔥</span>
            <p className="text-sm text-gray-500">Racha actual</p>
            <p className="text-xl font-bold">{streaks.currentStreak > 0 ? `${streaks.currentStreak} días` : '—'}</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
            <span className="text-3xl text-indigo-500 mb-2">⏰</span>
            <p className="text-sm text-gray-500">Tiempo total entrenado</p>
            <p className="text-xl font-bold">{summary.totalDuration > 0 ? `${summary.totalDuration} min` : '—'}</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
            <span className="text-3xl text-yellow-500 mb-2">🏆</span>
            <p className="text-sm text-gray-500">Racha máxima</p>
            <p className="text-xl font-bold">{streaks.maxStreak > 0 ? `${streaks.maxStreak} días` : '—'}</p>
          </motion.div>
        </motion.div>
        {emptyStats && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-indigo-50 text-indigo-700 rounded-xl p-6 text-center mb-6">
            📌 Aún no tienes estadísticas. ¡El primer entrenamiento te está esperando!
          </motion.div>
        )}
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Estadísticas</h2>
        <select className="border rounded-lg px-3 py-2" value={filtro} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFiltro(e.target.value)}>
          {filtros.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-semibold mb-2">Entrenamientos por tipo</h3>
          {pieData.length === 0 ? (
            <div className="text-gray-400 text-center">No hay datos aún.</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-semibold mb-2">Entrenamientos por semana</h3>
          {barData.length === 0 ? (
            <div className="text-gray-400 text-center">No hay datos aún.</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>
      <motion.button whileHover={{ scale: 1.05 }} className="mt-6 bg-gray-300 px-4 py-2 rounded" onClick={() => onNavigate('dashboard')}>Volver</motion.button>
    </div>
  );
};

export default StatsScreen; 