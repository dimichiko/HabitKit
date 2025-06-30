import React, { useState } from 'react';

import apiClient from '../apps/habitkit/utils/api';

const EditHabitModal = ({ habit, onClose, onHabitUpdated, folders }: { habit: any; onClose: any; onHabitUpdated: any; folders: any }) => {
  const [formData, setFormData] = useState({
    name: habit?.name || '',
    description: habit?.description || '',
    frequency: habit?.frequency || 'daily',
    timeOfDay: habit?.timeOfDay || 'morning',
    folderId: habit?.folderId || '',
    color: habit?.color || '#3B82F6'
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await apiClient.put(`/habits/${habit._id}`, { name: formData.name, color: formData.color, timesPerDay: formData.frequency, folder: formData.folderId });
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
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Veces por día</label>
          <div className="flex gap-2 mt-2">
            {[1,2,3,4,5].map(n => (
              <button
                type="button"
                key={n}
                onClick={() => setFormData({ ...formData, frequency: n })}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition ${formData.frequency === n ? 'bg-green-400 border-green-600 text-white scale-110' : 'bg-white border-gray-300 text-gray-500 hover:border-green-400'}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Color</label>
          <input
            type="color"
            value={formData.color}
            onChange={e => setFormData({ ...formData, color: e.target.value })}
            className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Carpeta</label>
          <select
            value={formData.folderId}
            onChange={e => setFormData({ ...formData, folderId: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            {folders && folders.map((f: any) => (
              <option key={f._id} value={f._id}>{f.name}</option>
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