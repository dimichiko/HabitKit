import React, { useState } from 'react';

interface WeightEntry {
  weight: number;
  notes: string;
  date: string;
}

const WeightTracker: React.FC = () => {
  const [currentWeight, setCurrentWeight] = useState<WeightEntry | null>(null);
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddWeight = () => {
    if (!newWeight) return;
    
    const weightEntry: WeightEntry = {
      weight: parseFloat(newWeight),
      notes,
      date: new Date().toISOString().split('T')[0]
    };
    
    setCurrentWeight(weightEntry);
    setWeightHistory(prev => [...prev, weightEntry]);
    setNewWeight('');
    setNotes('');
    setShowAddForm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Seguimiento de Peso</h2>
      
      {currentWeight && (
        <div className="mb-6">
          <div className="text-3xl font-bold text-gray-900">{currentWeight.weight} kg</div>
          <div className="text-sm text-gray-500">{currentWeight.date}</div>
        </div>
      )}
      
      <button
        onClick={() => setShowAddForm(true)}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Agregar Peso
      </button>
      
      {showAddForm && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <input
            type="number"
            placeholder="Peso (kg)"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Notas (opcional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddWeight}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Guardar
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeightTracker; 