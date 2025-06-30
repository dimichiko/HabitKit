// src/components/AddHabitForm.js
import React, { useState } from 'react';
import apiClient from '../utils/api';

const AddHabitForm = ({ onHabitAdded, habitError }) => {
  const [name, setName] = useState('');
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [timeOfDay, setTimeOfDay] = useState('08:00');
  const [color, setColor] = useState('#4ade80');
  const weekDays = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];

  const handleSubmit = async (e) => {
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

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Ej: Leer 10 páginas"
        required
      />
      {habitError && <div style={{color:'red',marginTop:4}}>{habitError}</div>}
      <input
        type="time"
        value={timeOfDay}
        onChange={e => setTimeOfDay(e.target.value)}
        required
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {weekDays.map((day, index) => (
          <label key={index} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <input
              type="checkbox"
              checked={daysOfWeek.includes(index)}
              onChange={() => {
                setDaysOfWeek(prev =>
                  prev.includes(index)
                    ? prev.filter(d => d !== index)
                    : [...prev, index]
                );
              }}
            />
            {day.substring(0, 3)}
          </label>
        ))}
      </div>
      <input
        type="color"
        value={color}
        onChange={e => setColor(e.target.value)}
        style={{ height: '30px', width: '40px', padding: '2px', border: 'none', background: 'none' }}
      />
      <button type="submit">Añadir Hábito</button>
    </form>
  );
};

export default AddHabitForm;