import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import apiClient from '../utils/api';
import { FaMapMarkerAlt, FaRunning, FaDumbbell, FaSpa } from 'react-icons/fa';
import { motion } from 'framer-motion';

const tipoIcono = {
  'Cardio': <FaRunning className="inline text-blue-500" />,
  'Fuerza': <FaDumbbell className="inline text-red-500" />,
  'Yoga': <FaSpa className="inline text-green-500" />,
};

const tipos = ['Todos', 'Cardio', 'Fuerza', 'Yoga'];

const defaultCenter = [-33.45, -70.6667]; // Santiago, Chile

const MapScreen = ({ onNavigate }) => {
  const [trainings, setTrainings] = useState([]);
  const [tipo, setTipo] = useState('Todos');
  const [center, setCenter] = useState(defaultCenter);

  useEffect(() => {
    apiClient.get('/').then(res => {
      setTrainings(res.data.filter(t => t.location && t.location.lat && t.location.lng));
      if (res.data.length > 0 && res.data[0].location && res.data[0].location.lat) {
        setCenter([res.data[0].location.lat, res.data[0].location.lng]);
      }
    });
  }, []);

  const filtered = tipo === 'Todos' ? trainings : trainings.filter(t => t.type === tipo);
  const lugares = [...new Set(trainings.map(t => t.location?.name).filter(Boolean))];
  const lugarMasFrecuente = lugares.sort((a, b) => trainings.filter(t => t.location?.name === b).length - trainings.filter(t => t.location?.name === a).length)[0];
  const ultimo = trainings.length > 0 ? trainings[0] : null;
  const empty = trainings.length === 0;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2"><FaMapMarkerAlt /> Mapa de Entrenamientos</h2>
        <div className="flex gap-2">
          {tipos.map(t => (
            <motion.button whileHover={{ scale: 1.08 }} key={t} className={`px-3 py-1 rounded-full border ${tipo === t ? 'bg-indigo-500 text-white' : 'bg-white text-indigo-500 border-indigo-500'} transition`} onClick={() => setTipo(t)}>{t}</motion.button>
          ))}
        </div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="h-[500px] rounded-xl shadow-md overflow-hidden mb-6">
        {empty ? (
          <div className="h-full flex flex-col items-center justify-center text-indigo-600 bg-indigo-50 rounded-xl">
            <div className="text-4xl mb-2">📌</div>
            <div className="text-lg font-semibold mb-2">Aún no has registrado entrenamientos con ubicación.</div>
            <div className="mb-4">¡El primer pin te está esperando!</div>
            <motion.button whileHover={{ scale: 1.05 }} className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition" onClick={() => onNavigate('add')}>Registrar Entrenamiento</motion.button>
          </div>
        ) : (
          <MapContainer center={center} zoom={13} className="h-full w-full" scrollWheelZoom={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {filtered.map((t, i) => (
              <Marker key={i} position={[t.location.lat, t.location.lng]}>
                <Popup>
                  <div className="font-bold mb-1 flex items-center gap-1">{tipoIcono[t.type]} {t.type}</div>
                  <div className="text-xs text-gray-600">{new Date(t.date).toLocaleDateString()}</div>
                  <div className="text-xs">{t.location?.name}</div>
                  <div className="text-xs">Duración: {t.duration} min</div>
                  {t.withFriends && t.friends && <div className="text-xs">Con: {t.friends}</div>}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="mb-2">📌 Has entrenado en <b>{lugares.length}</b> lugares distintos</div>
        <div className="mb-2">🔁 Lugar más frecuente: <b>{lugarMasFrecuente || '—'}</b></div>
        <div>📍 Último entrenamiento: <b>{ultimo?.location?.name || '—'}</b> ({ultimo ? new Date(ultimo.date).toLocaleDateString() : '—'})</div>
      </motion.div>
      <motion.button whileHover={{ scale: 1.05 }} className="mt-4 bg-gray-300 px-4 py-2 rounded" onClick={() => onNavigate('dashboard')}>Volver</motion.button>
    </div>
  );
};

export default MapScreen; 