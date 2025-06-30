import React, { useState } from 'react';

interface Food {
  _id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: number;
  servingUnit: string;
}

interface MealEntryProps {
  onAddFood: (food: Food) => void;
}

const MealEntry: React.FC<MealEntryProps> = ({ onAddFood }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      // Simular búsqueda
      const mockResults: Food[] = [
        {
          _id: '1',
          name: 'Pollo',
          calories: 165,
          protein: 31,
          carbs: 0,
          fat: 3.6,
          servingSize: 100,
          servingUnit: 'g'
        }
      ];
      setSearchResults(mockResults);
    } catch (error) {
      console.error('Error searching foods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = (food: Food) => {
    onAddFood(food);
    setSearchResults([]);
    setSearchTerm('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Agregar Comida</h2>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar comida..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="mt-2 w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {searchResults.length > 0 && (
        <div className="space-y-2">
          {searchResults.map(food => (
            <div key={food._id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">{food.name}</p>
                <p className="text-sm text-gray-600">
                  {food.calories} cal | {food.protein}g proteína | {food.carbs}g carbos | {food.fat}g grasa
                </p>
              </div>
              <button
                onClick={() => handleAddFood(food)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
              >
                Agregar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MealEntry; 