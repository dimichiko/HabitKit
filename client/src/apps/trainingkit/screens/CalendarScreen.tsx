import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient, { statsClient } from '../utils/api';


interface Training {
  _id: string;
  type: 'Cardio' | 'Fuerza' | 'Yoga';
  date: string;
  duration: number;
  location?: string;
  withFriends?: boolean;
  friends?: string;
}

interface CalendarScreenProps {
  onNavigate: (route: string, training?: Training) => void;
}

interface TileContentProps {
  date: Date;
}

interface TileClassNameProps {
  date: Date;
}

interface StatsResponse {
  currentStreak: number;
}

const tipoIcono: Record<string, React.ReactElement> = {
  'Cardio': <span className="inline text-blue-500">🏃</span>,
  'Fuerza': <span className="inline text-red-500">🏋️</span>,
  'Yoga': <span className="inline text-green-500">🧘</span>,
};

const tipoColor: Record<string, string> = {
  'Cardio': 'bg-blue-100',
  'Fuerza': 'bg-red-100',
  'Yoga': 'bg-green-100',
};

const CalendarScreen = ({ onNavigate }: CalendarScreenProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [selectedDayTrainings, setSelectedDayTrainings] = useState<Training[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [weekTrainings, setWeekTrainings] = useState<Training[]>([]);
  const [showWeek, setShowWeek] = useState<boolean>(false);

  useEffect(() => {
    apiClient.get('/').then(res => setTrainings(res.data));
    statsClient.get('/streaks').then((res: { data: StatsResponse }) => setStreak(res.data.currentStreak));
  }, []);

  const handleDayClick = async (value: any) => {
    if (value instanceof Date) {
      setDate(value);
      setShowWeek(false);
      const ymd = value.toISOString().slice(0, 10);
      const { data } = await apiClient.get(`/?date=${ymd}`);
      setSelectedDayTrainings(data);
    }
  };

  const handleDelete = async (id: string) => {
    await apiClient.delete(`/${id}`);
    handleDayClick(date);
    apiClient.get('/').then(res => setTrainings(res.data));
  };

  const getTileContent = ({ date }: TileContentProps) => {
    const ymd = date.toISOString().slice(0, 10);
    const dayTrainings = trainings.filter((t: Training) => t.date.slice(0, 10) === ymd);
    if (dayTrainings.length === 0) return null;
    return (
      <span className="ml-1 flex gap-0.5">
        {dayTrainings.map((t: Training, i: number) => (
          <span key={t._id || `tile-${i}`}>
            {tipoIcono[t.type] || <span className="text-indigo-500 text-xs">●</span>}
          </span>
        ))}
      </span>
    );
  };

  const getTileClassName = ({ date }: TileClassNameProps) => {
    const ymd = date.toISOString().slice(0, 10);
    const dayTrainings = trainings.filter((t: Training) => t.date.slice(0, 10) === ymd);
    if (dayTrainings.length === 0) return '';
    return 'ring-2 ring-indigo-400';
  };

  const handleShowWeek = () => {
    setShowWeek(true);
    const current = new Date(date);
    const first = current.getDate() - current.getDay() + 1;
    const monday = new Date(current.setDate(first));
    const week: Training[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const ymd = d.toISOString().slice(0, 10);
      week.push(...trainings.filter((t: Training) => t.date.slice(0, 10) === ymd));
    }
    setWeekTrainings(week);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold">Calendario de Entrenamientos</h2>
        <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-md inline-flex items-center gap-2">
          <span className="animate-bounce">🔥</span> Racha actual: <strong>{streak} días seguidos</strong>
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
              {weekTrainings.length === 0 ? <li className="text-gray-500">No hay entrenamientos esta semana.</li> : weekTrainings.map((t: Training, i: number) => (
                <li key={t._id || `week-${i}`} className={`mb-2 p-3 rounded-xl flex justify-between items-center ${tipoColor[t.type] || 'bg-gray-100'}`}>
                  <span>{tipoIcono[t.type] || '✅'} <b>{t.type}</b> - {t.duration} min {t.location && `- ${t.location}`} {t.withFriends && t.friends && `con ${t.friends}`}</span>
                  <span className="flex gap-2">
                    <button onClick={() => onNavigate('edit', t)} className="text-blue-500"><span>✏️</span></button>
                    <button onClick={() => handleDelete(t._id)} className="text-red-500"><span>🗑️</span></button>
                  </span>
                </li>
              ))}
            </motion.ul>
          ) : (
            <motion.ul initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {selectedDayTrainings.length === 0 ? (
                <li className="text-gray-500 flex flex-col items-center">
                  No hay entrenamientos.<br />
                  <button className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition flex items-center gap-2" onClick={() => onNavigate('add')}><span>➕</span> Registrar Entrenamiento</button>
                </li>
              ) : selectedDayTrainings.map((t: Training) => (
                <li key={t._id} className={`mb-2 p-3 rounded-xl flex justify-between items-center ${tipoColor[t.type] || 'bg-gray-100'}`}>
                  <span>{tipoIcono[t.type] || '✅'} <b>{t.type}</b> - {t.duration} min {t.location && `- ${t.location}`} {t.withFriends && t.friends && `con ${t.friends}`}</span>
                  <span className="flex gap-2">
                    <button onClick={() => onNavigate('edit', t)} className="text-blue-500"><span>✏️</span></button>
                    <button onClick={() => handleDelete(t._id)} className="text-red-500"><span>🗑️</span></button>
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