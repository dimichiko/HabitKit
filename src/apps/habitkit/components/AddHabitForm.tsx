import React, { useState } from 'react';

interface AddHabitFormProps {
  onHabitAdded: (habitData: {
    name: string;
    description: string;
    folderId: string;
    daysOfWeek: number[];
  }) => void;
  habitError: string | null;
}

const AddHabitForm: React.FC<AddHabitFormProps> = ({ onHabitAdded, habitError }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [folderId, setFolderId] = useState('');
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return;
    }

    onHabitAdded({
      name: name.trim(),
      description: description.trim(),
      folderId,
      daysOfWeek,
    });

    // Reset form
    setName('');
    setDescription('');
    setFolderId('');
    setDaysOfWeek([]);
  };

  const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del hábito *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ej: Hacer ejercicio"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe tu hábito..."
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Días de la semana
        </label>
        <div className="flex flex-wrap gap-2">
          {dayNames.map((day, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setDaysOfWeek(prev =>
                  prev.includes(index)
                    ? prev.filter(d => d !== index)
                    : [...prev, index]
                );
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                daysOfWeek.includes(index)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {habitError && (
        <div className="text-red-600 text-sm">{habitError}</div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Crear Hábito
      </button>
    </form>
  );
};

export default AddHabitForm; 