import React, { useState } from 'react';
import apiClient from '../utils/api';

const EditHabitModal = ({ habit, onClose, onHabitUpdated, folders }) => {
  const [name, setName] = useState(habit.name);
  const [color, setColor] = useState(habit.color);
  const [timesPerDay, setTimesPerDay] = useState(habit.timesPerDay);
  const [folder, setFolder] = useState(habit.folder || (folders && folders[0]?.name) || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put(`/habits/${habit._id}`, { name, color, timesPerDay, folder });
      onHabitUpdated(); 
      onClose(); 
    } catch (error) {
      console.error("Error al actualizar el hábito", error);
    }
  };

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Editar Hábito</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="habit-name" className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            id="habit-name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <label htmlFor="habit-times" className="block text-sm font-medium text-gray-700">Veces por día</label>
          <div className="flex gap-2 mt-2" id="habit-times">
            {[1,2,3,4,5].map(n => (
              <button
                type="button"
                key={n}
                onClick={() => setTimesPerDay(n)}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition ${timesPerDay === n ? 'bg-green-400 border-green-600 text-white scale-110' : 'bg-white border-gray-300 text-gray-500 hover:border-green-400'}`}
                aria-pressed={timesPerDay === n}
                aria-label={`Seleccionar ${n} veces por día`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="habit-color" className="block text-sm font-medium text-gray-700">Color</label>
          <input
            id="habit-color"
            type="color"
            value={color}
            onChange={e => setColor(e.target.value)}
            className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div>
          <label htmlFor="habit-folder" className="block text-sm font-medium text-gray-700">Carpeta</label>
          <select
            id="habit-folder"
            value={folder}
            onChange={e => setFolder(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            {folders && folders.map(f => (
              <option key={f._id} value={f.name}>{f.name}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditHabitModal;