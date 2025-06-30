import React, { useState } from 'react';
import apiClient from '../utils/api';

const AddTrainingScreen = ({ onNavigate }: { onNavigate: any }) => {
  const [form, setForm] = useState({
    date: '',
    type: '',
    duration: '',
    location: '',
    withFriends: false,
    friends: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/', form);
      onNavigate('dashboard');
    } catch (err) {
      alert('Error al guardar entrenamiento');
    }
    setLoading(false);
  };

  const handleInputChange = (e: any) => {
    // ... existing code ...
  };

  return (
    <form className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-4">Nuevo Entrenamiento</h2>
      <label className="block mb-2">Fecha
        <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full border rounded p-2" required />
      </label>
      <label className="block mb-2">Tipo de entrenamiento
        <input type="text" name="type" value={form.type} onChange={handleChange} className="w-full border rounded p-2" placeholder="Ej: Running, Gym, Yoga..." required />
      </label>
      <label className="block mb-2">Duración (minutos)
        <input type="number" name="duration" value={form.duration} onChange={handleChange} className="w-full border rounded p-2" required />
      </label>
      <label className="block mb-2">Ubicación
        <input type="text" name="location" value={form.location} onChange={handleChange} className="w-full border rounded p-2" placeholder="Parque, Gimnasio..." required />
      </label>
      <label className="block mb-2 flex items-center">
        <input type="checkbox" name="withFriends" checked={form.withFriends} onChange={handleChange} className="mr-2" />
        ¿Entrenaste con amigos?
      </label>
      {form.withFriends && (
        <label className="block mb-2">¿Con quién?
          <input type="text" name="friends" value={form.friends} onChange={handleChange} className="w-full border rounded p-2" placeholder="Nombres de amigos" />
        </label>
      )}
      <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
      <button type="button" className="mt-4 ml-2 bg-gray-300 px-4 py-2 rounded" onClick={() => onNavigate('dashboard')}>Cancelar</button>
    </form>
  );
};

export default AddTrainingScreen; 