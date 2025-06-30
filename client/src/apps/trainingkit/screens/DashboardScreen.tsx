import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaCalendarAlt, FaChartBar } from 'react-icons/fa';
import apiClient, { statsClient } from '../utils/api';

const frases = [
  '¡Vamos por otra racha!',
  'Hoy es un gran día para entrenar 💪',
  'No pares, tu mejor versión te espera',
  'Cada día cuenta, ¡sigue así!',
];

const DashboardScreen = ({ onNavigate }) => {
  const [stats, setStats] = useState(null);
  const [lastTraining, setLastTraining] = useState(null);
  const [frase, setFrase] = useState(frases[0]);

  useEffect(() => {
    statsClient.get('/summary').then(res => setStats(res.data));
    apiClient.get('/').then(res => {
      if (res.data && res.data.length > 0) {
        setLastTraining(res.data[0]);
      }
    });
    setFrase(frases[Math.floor(Math.random() * frases.length)]);
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl font-bold text-purple-800 mb-2 flex items-center gap-2">
          {frase}
        </h2>
        <p className="text-gray-600 mb-6">Bienvenido a TrainingKit</p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
          <span className="text-5xl mb-2 text-purple-500"><FaPlus /></span>
          <p className="font-bold text-lg mb-2">Registrar Entrenamiento</p>
          <button className="mt-2 border border-purple-500 text-purple-700 px-4 py-2 rounded-full w-full hover:bg-purple-50 transition" onClick={() => onNavigate('add')}>➕ Agregar</button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
          <span className="text-5xl mb-2 text-blue-500"><FaCalendarAlt /></span>
          <p className="font-bold text-lg mb-2">Calendario</p>
          <button className="mt-2 border border-blue-500 text-blue-700 px-4 py-2 rounded-full w-full hover:bg-blue-50 transition" onClick={() => onNavigate('calendar')}>Ver calendario</button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
          <span className="text-5xl mb-2 text-green-500"><FaChartBar /></span>
          <p className="font-bold text-lg mb-2">Estadísticas</p>
          <button className="mt-2 border border-green-500 text-green-700 px-4 py-2 rounded-full w-full hover:bg-green-50 transition" onClick={() => onNavigate('stats')}>Ver estadísticas</button>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
          <span className="text-2xl mb-1">🔥</span>
          <p className="font-bold">Entrenamientos esta semana</p>
          <div className="text-3xl text-purple-700 font-extrabold">{stats?.byWeek ? Object.values(stats.byWeek).slice(-1)[0] : 0}</div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
          <span className="text-2xl mb-1">⏳</span>
          <p className="font-bold">Racha actual</p>
          <div className="text-3xl text-purple-700 font-extrabold">{stats?.currentStreak || 0}</div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
          <span className="text-2xl mb-1">🏁</span>
          <p className="font-bold">Último entrenamiento</p>
          <div className="text-md text-gray-700 font-semibold">{lastTraining ? `${lastTraining.type} (${lastTraining.duration} min)` : '—'}</div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardScreen; 