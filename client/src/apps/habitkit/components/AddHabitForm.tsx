// src/components/AddHabitForm.tsx
import React, { useState } from 'react';
import apiClient from '../utils/api';

interface Habit {
  _id: string;
  name: string;
  color: string;
  daysOfWeek: number[];
  timeOfDay: string;
  createdAt: string;
  updatedAt: string;
}

interface AddHabitFormProps {
  onHabitAdded: (habit: Habit) => void;
  habitError?: string;
}

const AddHabitForm: React.FC<AddHabitFormProps> = ({ onHabitAdded, habitError }) => {
  const [name, setName] = useState<string>('');
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);
  const [timeOfDay, setTimeOfDay] = useState<string>('08:00');
  const [color, setColor] = useState<string>('#4ade80');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const weekDays: string[] = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!name.trim()) {
      setError('El título no puede estar vacío.');
      return;
    }
    if (daysOfWeek.length === 0) {
      setError('Selecciona al menos un día.');
      return;
    }
    setLoading(true);
    try {
      const response = await apiClient.post('/api/habits', {
        name: name.trim(),
        color,
        daysOfWeek,
        timeOfDay
      });
      setName('');
      setDaysOfWeek([]);
      setTimeOfDay('08:00');
      setColor('#4ade80');
      setSuccess('¡Hábito creado!');
      onHabitAdded(response.data);
      setTimeout(() => setSuccess(null), 2000);
    } catch (error: any) {
      setError(error?.response?.data?.error || 'Error al crear el hábito');
      setTimeout(() => setError(null), 2500);
    } finally {
      setLoading(false);
    }
  };

  const handleDayToggle = (index: number) => {
    setDaysOfWeek(prev =>
      prev.includes(index)
        ? prev.filter(d => d !== index)
        : [...prev, index]
    );
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <input
        type="text"
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        placeholder="Ej: Leer 10 páginas"
        required
        disabled={loading}
      />
      <input
        type="time"
        value={timeOfDay}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTimeOfDay(e.target.value)}
        required
        disabled={loading}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {weekDays.map((day, index) => (
          <label key={index} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <input
              type="checkbox"
              checked={daysOfWeek.includes(index)}
              onChange={() => handleDayToggle(index)}
              disabled={loading}
            />
            {day.substring(0, 3)}
          </label>
        ))}
      </div>
      <input
        type="color"
        value={color}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setColor(e.target.value)}
        style={{ height: '30px', width: '40px', padding: '2px', border: 'none', background: 'none' }}
        disabled={loading}
      />
      <button type="submit" disabled={loading} style={{ minWidth: 120 }}>
        {loading ? 'Creando...' : 'Añadir Hábito'}
      </button>
      {error && <div style={{color:'red',marginTop:4,marginLeft:8}}>{error}</div>}
      {success && <div style={{color:'green',marginTop:4,marginLeft:8}}>{success}</div>}
      {habitError && <div style={{color:'red',marginTop:4,marginLeft:8}}>{habitError}</div>}
    </form>
  );
};

export default AddHabitForm;