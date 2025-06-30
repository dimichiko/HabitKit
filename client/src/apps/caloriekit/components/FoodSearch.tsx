import React, { useState, useEffect } from 'react';
import { searchFood, getUserFoods, createFood } from '../utils/api';

interface Food {
  _id?: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  baseAmount?: number;
  unit?: string;
}

interface FoodSearchProps {
  onFoodSelect: (food: Food) => void;
}

interface CreateFormData {
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  baseAmount: string;
  unit: string;
}

const FoodSearch = ({ onFoodSelect }: FoodSearchProps) => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Food[]>([]);
  const [customFoods, setCustomFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [createFormData, setCreateFormData] = useState<CreateFormData>({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    baseAmount: '100',
    unit: 'g'
  });

  useEffect(() => {
    loadCustomFoods();
  }, []);

  const loadCustomFoods = async () => {
    try {
      const foods = await getUserFoods();
      setCustomFoods(foods);
    } catch (error) {
      console.error('Error loading custom foods:', error);
    }
  };

  const searchFoods = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      const searchResults = await searchFood(searchQuery);
      setResults(searchResults || []);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching foods:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim()) {
      searchFoods(value);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  const handleFoodSelect = (food: Food) => {
    onFoodSelect(food);
    setQuery(food.name);
    setShowResults(false);
    setShowCreateForm(false);
  };

  const handleCreateFood = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!createFormData.name.trim()) {
      alert('El nombre del alimento es requerido');
      return;
    }

    const foodData = {
      name: createFormData.name.trim(),
      calories: parseFloat(createFormData.calories) || 0,
      protein: parseFloat(createFormData.protein) || 0,
      carbs: parseFloat(createFormData.carbs) || 0,
      fat: parseFloat(createFormData.fat) || 0,
      baseAmount: parseFloat(createFormData.baseAmount) || 100,
      unit: createFormData.unit
    };

    try {
      const newFood = await createFood(foodData);
      await loadCustomFoods(); // Recargar alimentos personalizados
      handleFoodSelect(newFood);
      setCreateFormData({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        baseAmount: '100',
        unit: 'g'
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating food:', error);
      alert('Error al crear el alimento');
    }
  };

  const handleCreateFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCreateFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const allResults = [...customFoods, ...results];
  const filteredResults = allResults.filter(food => 
    food.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowResults(true)}
          placeholder="Buscar alimento o crear uno nuevo..."
          className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          🔍
        </span>
        {loading && (
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
          </span>
        )}
      </div>

      {/* Results Dropdown */}
      {showResults && (query.trim() || customFoods.length > 0) && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {/* Create New Food Button */}
          {query.trim() && (
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setCreateFormData(prev => ({ ...prev, name: query }));
                  setShowCreateForm(true);
                  setShowResults(false);
                }}
                className="w-full text-left p-2 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-orange-500">➕</span>
                  <span className="font-medium">Crear &quot;{query}&quot;</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Añadir como alimento personalizado
                </p>
              </button>
            </div>
          )}

          {/* Custom Foods Section */}
          {customFoods.length > 0 && (
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mis Alimentos Personalizados
              </h3>
              {customFoods
                .filter(food => food.name.toLowerCase().includes(query.toLowerCase()))
                .map((food) => (
                  <button
                    key={food._id}
                    onClick={() => handleFoodSelect(food)}
                    className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {food.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {food.calories} cal • {food.protein}g P • {food.carbs}g C • {food.fat}g G
                        </div>
                      </div>
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                        Personalizado
                      </span>
                    </div>
                  </button>
                ))}
            </div>
          )}

          {/* Database Foods Section */}
          {results.length > 0 && (
            <div className="p-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Base de Datos
              </h3>
              {results.map((food) => (
                <button
                  key={food._id || food.name}
                  onClick={() => handleFoodSelect(food)}
                  className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {food.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {food.calories} cal • {food.protein}g P • {food.carbs}g C • {food.fat}g G
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {filteredResults.length === 0 && query.trim() && !loading && (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No se encontraron alimentos que coincidan con &quot;{query}&quot;
            </div>
          )}
        </div>
      )}

      {/* Create Food Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Crear Alimento Personalizado
                </h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateFood} className="space-y-4">
                <div>
                  <label htmlFor="create-food-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre del Alimento *
                  </label>
                  <input
                    type="text"
                    id="create-food-name"
                    name="name"
                    value={createFormData.name}
                    onChange={handleCreateFormInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="create-food-calories" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Calorías
                    </label>
                    <input
                      type="number"
                      id="create-food-calories"
                      name="calories"
                      value={createFormData.calories}
                      onChange={handleCreateFormInputChange}
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="create-food-protein" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Proteínas (g)
                    </label>
                    <input
                      type="number"
                      id="create-food-protein"
                      name="protein"
                      value={createFormData.protein}
                      onChange={handleCreateFormInputChange}
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="create-food-carbs" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Carbohidratos (g)
                    </label>
                    <input
                      type="number"
                      id="create-food-carbs"
                      name="carbs"
                      value={createFormData.carbs}
                      onChange={handleCreateFormInputChange}
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="create-food-fat" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Grasas (g)
                    </label>
                    <input
                      type="number"
                      id="create-food-fat"
                      name="fat"
                      value={createFormData.fat}
                      onChange={handleCreateFormInputChange}
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="create-food-baseAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cantidad Base
                    </label>
                    <input
                      type="number"
                      id="create-food-baseAmount"
                      name="baseAmount"
                      value={createFormData.baseAmount}
                      onChange={handleCreateFormInputChange}
                      min="1"
                      step="1"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="create-food-unit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Unidad
                    </label>
                    <select
                      id="create-food-unit"
                      name="unit"
                      value={createFormData.unit}
                      onChange={handleCreateFormInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="g">gramos (g)</option>
                      <option value="ml">mililitros (ml)</option>
                      <option value="unidad">unidad</option>
                      <option value="taza">taza</option>
                      <option value="cucharada">cucharada</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    Crear y Seleccionar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodSearch; 