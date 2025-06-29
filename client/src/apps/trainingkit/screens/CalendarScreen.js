import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient, { statsClient } from '../utils/api';
import { FaPlus, FaEdit, FaTrash, FaRunning, FaDumbbell, FaSpa, FaFire } from 'react-icons/fa';

const tipoIcono = {
  'Cardio': <FaRunning className="inline text-blue-500" />,
  'Fuerza': <FaDumbbell className="inline text-red-500" />,
  'Yoga': <FaSpa className="inline text-green-500" />,
};
const tipoColor = {
  'Cardio': 'bg-blue-100',
  'Fuerza': 'bg-red-100',
  'Yoga': 'bg-green-100',
};

const CalendarScreen = ({ onNavigate }) => {
  const [date, setDate] = useState(new Date());
  const [trainings, setTrainings] = useState([]);
  const [selectedDayTrainings, setSelectedDayTrainings] = useState([]);
  const [streak, setStreak] = useState(0);
  const [weekTrainings, setWeekTrainings] = useState([]);
  const [showWeek, setShowWeek] = useState(false);

  useEffect(() => {
    apiClient.get('/').then(res => setTrainings(res.data));
    statsClient.get('/streaks').then(res => setStreak(res.data.currentStreak));
  }, []);

  const handleDayClick = async (value) => {
    setDate(value);
    setShowWeek(false);
    const ymd = value.toISOString().slice(0, 10);
    const { data } = await apiClient.get(`/?date=${ymd}`);
    setSelectedDayTrainings(data);
  };

  const handleDelete = async (id) => {
    await apiClient.delete(`/${id}`);
    handleDayClick(date);
    apiClient.get('/').then(res => setTrainings(res.data));
  };

  const getTileContent = ({ date }) => {
    const ymd = date.toISOString().slice(0, 10);
    const dayTrainings = trainings.filter(t => t.date.slice(0, 10) === ymd);
    if (dayTrainings.length === 0) return null;
    return (
      <span className="ml-1 flex gap-0.5">
        {dayTrainings.map((t, i) => (
          <span key={t._id || `tile-${i}`}>
            {tipoIcono[t.type] || <span className="text-indigo-500 text-xs">●</span>}
          </span>
        ))}
      </span>
    );
  };

  const getTileClassName = ({ date }) => {
    const ymd = date.toISOString().slice(0, 10);
    const dayTrainings = trainings.filter(t => t.date.slice(0, 10) === ymd);
    if (dayTrainings.length === 0) return '';
    return 'ring-2 ring-indigo-400';
  };

  const handleShowWeek = () => {
    setShowWeek(true);
    const current = new Date(date);
    const first = current.getDate() - current.getDay() + 1;
    const monday = new Date(current.setDate(first));
    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const ymd = d.toISOString().slice(0, 10);
      week.push(...trainings.filter(t => t.date.slice(0, 10) === ymd));
    }
    setWeekTrainings(week);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold">Calendario de Entrenamientos</h2>
        <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-md inline-flex items-center gap-2">
          <FaFire className="animate-bounce" /> Racha actual: <strong>{streak} días seguidos</strong>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-4">
        <Calendar
          onChange={handleDayClick}
          value={date}
          tileContent={getTileContent}
          tileClassName={getTileClassName}
          className="react-calendar !bg-white !rounded-xl !p-4 !shadow-md"
        />
      </div>
      <div className="bg-white rounded-xl shadow-md p-6 mt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
          <h3 className="text-lg font-semibold">Entrenamientos del día</h3>
          <button className="text-sm text-indigo-600 underline" onClick={handleShowWeek}>Ver semana actual</button>
        </div>
        <AnimatePresence>
          {showWeek ? (
            <motion.ul initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {weekTrainings.length === 0 ? <li className="text-gray-500">No hay entrenamientos esta semana.</li> : weekTrainings.map((t, i) => (
                <li key={t._id || `week-${i}`} className={`mb-2 p-3 rounded-xl flex justify-between items-center ${tipoColor[t.type] || 'bg-gray-100'}`}>
                  <span>{tipoIcono[t.type] || '✅'} <b>{t.type}</b> - {t.duration} min {t.location && `- ${t.location}`} {t.withFriends && t.friends && `con ${t.friends}`}</span>
                  <span className="flex gap-2">
                    <button onClick={() => onNavigate('edit', t)} className="text-blue-500"><FaEdit /></button>
                    <button onClick={() => handleDelete(t._id)} className="text-red-500"><FaTrash /></button>
                  </span>
                </li>
              ))}
            </motion.ul>
          ) : (
            <motion.ul initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {selectedDayTrainings.length === 0 ? (
                <li className="text-gray-500 flex flex-col items-center">
                  No hay entrenamientos.<br />
                  <button className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition flex items-center gap-2" onClick={() => onNavigate('add')}><FaPlus /> Registrar Entrenamiento</button>
                </li>
              ) : selectedDayTrainings.map(t => (
                <li key={t._id} className={`mb-2 p-3 rounded-xl flex justify-between items-center ${tipoColor[t.type] || 'bg-gray-100'}`}>
                  <span>{tipoIcono[t.type] || '✅'} <b>{t.type}</b> - {t.duration} min {t.location && `- ${t.location}`} {t.withFriends && t.friends && `con ${t.friends}`}</span>
                  <span className="flex gap-2">
                    <button onClick={() => onNavigate('edit', t)} className="text-blue-500"><FaEdit /></button>
                    <button onClick={() => handleDelete(t._id)} className="text-red-500"><FaTrash /></button>
                  </span>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
      <button className="mt-4 bg-gray-300 px-4 py-2 rounded" onClick={() => onNavigate('dashboard')}>Volver</button>
    </div>
  );
};

export default CalendarScreen; 