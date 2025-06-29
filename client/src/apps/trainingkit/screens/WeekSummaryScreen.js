import React, { useEffect, useState } from 'react';
import apiClient from '../utils/api';

const WeekSummaryScreen = ({ onNavigate }) => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await apiClient.get('/week');
        setTrainings(data);
      } catch (err) {
        alert('Error al cargar entrenamientos');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Resumen Semanal</h2>
      {loading ? <p>Cargando...</p> : (
        <ul>
          {trainings.map((t, i) => (
            <li key={i} className="mb-4 p-4 bg-white rounded shadow">
              <div><b>Fecha:</b> {new Date(t.date).toLocaleDateString()}</div>
              <div><b>Tipo:</b> {t.type}</div>
              <div><b>Duración:</b> {t.duration} min</div>
              <div><b>Ubicación:</b> {t.location}</div>
              <div><b>Con amigos:</b> {t.withFriends ? `Sí (${t.friends})` : 'No'}</div>
            </li>
          ))}
        </ul>
      )}
      <button className="mt-4 bg-gray-300 px-4 py-2 rounded" onClick={() => onNavigate('dashboard')}>Volver</button>
    </div>
  );
};

export default WeekSummaryScreen; 