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
  const weekDays: string[] = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || daysOfWeek.length === 0) return;

    try {
      const response = await apiClient.post('/habits', {
        name,
        color,
        daysOfWeek,
        timeOfDay
      });
      setName('');
      setDaysOfWeek([]);
      setTimeOfDay('08:00');
      setColor('#4ade80');
      onHabitAdded(response.data);
    } catch (error) {
      console.error('Error al crear el hábito', error);
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
      />
      {habitError && <div style={{color:'red',marginTop:4}}>{habitError}</div>}
      <input
        type="time"
        value={timeOfDay}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTimeOfDay(e.target.value)}
        required
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {weekDays.map((day, index) => (
          <label key={index} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <input
              type="checkbox"
              checked={daysOfWeek.includes(index)}
              onChange={() => handleDayToggle(index)}
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
      />
      <button type="submit">Añadir Hábito</button>
    </form>
  );
};

export default AddHabitForm;