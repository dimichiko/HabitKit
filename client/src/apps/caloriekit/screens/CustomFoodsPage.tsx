import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

interface CustomFood {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  servingSize: number;
  servingUnit: string;
}

interface NewFoodForm {
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
  servingSize: string;
  servingUnit: string;
}

const CustomFoodsPage = () => {
  const [customFoods, setCustomFoods] = useState<CustomFood[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFood, setEditingFood] = useState<CustomFood | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const [newFood, setNewFood] = useState<NewFoodForm>({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    servingSize: '',
    servingUnit: 'g'
  });

  useEffect(() => {
    loadCustomFoods();
  }, []);

  const loadCustomFoods = async () => {
    try {
      // Simular carga de alimentos personalizados
      const mockFoods: CustomFood[] = [
        {
          id: 1,
          name: 'Ensalada Personalizada',
          calories: 150,
          protein: 8,
          carbs: 12,
          fat: 6,
          fiber: 4,
          servingSize: 200,
          servingUnit: 'g'
        },
        {
          id: 2,
          name: 'Batido de Proteínas',
          calories: 220,
          protein: 25,
          carbs: 15,
          fat: 3,
          fiber: 2,
          servingSize: 300,
          servingUnit: 'ml'
        }
      ];
      setCustomFoods(mockFoods);
    } catch (error) {
      console.error('Error loading custom foods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = async () => {
    try {
      const foodToAdd: CustomFood = {
        id: Date.now(),
        name: newFood.name,
        calories: parseInt(newFood.calories),
        protein: parseFloat(newFood.protein),
        carbs: parseFloat(newFood.carbs),
        fat: parseFloat(newFood.fat),
        fiber: parseFloat(newFood.fiber),
        servingSize: parseFloat(newFood.servingSize),
        servingUnit: newFood.servingUnit
      };

      setCustomFoods([...customFoods, foodToAdd]);
      setNewFood({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        fiber: '',
        servingSize: '',
        servingUnit: 'g'
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding food:', error);
    }
  };

  const handleEditFood = async () => {
    try {
      if (!editingFood) return;
      
      const updatedFoods = customFoods.map(food =>
        food.id === editingFood.id
          ? {
              ...editingFood,
              calories: parseInt(editingFood.calories.toString()),
              protein: parseFloat(editingFood.protein.toString()),
              carbs: parseFloat(editingFood.carbs.toString()),
              fat: parseFloat(editingFood.fat.toString()),
              fiber: parseFloat(editingFood.fiber.toString()),
              servingSize: parseFloat(editingFood.servingSize.toString())
            }
          : food
      );
      setCustomFoods(updatedFoods);
      setEditingFood(null);
    } catch (error) {
      console.error('Error editing food:', error);
    }
  };

  const handleDeleteFood = async (id: number) => {
    try {
      setCustomFoods(customFoods.filter(food => food.id !== id));
    } catch (error) {
      console.error('Error deleting food:', error);
    }
  };

  const filteredFoods = customFoods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Alimentos Personalizados</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaPlus />
            Agregar Alimento
          </button>
        </div>

        {/* Barra de búsqueda */}
        <div className="mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar alimentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Formulario para agregar/editar alimento */}
        {(showAddForm || editingFood) && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
              {editingFood ? 'Editar Alimento' : 'Agregar Nuevo Alimento'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="foodName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  id="foodName"
                  type="text"
                  value={editingFood ? editingFood.name : newFood.name}
                  onChange={(e) => editingFood 
                    ? setEditingFood({...editingFood, name: e.target.value})
                    : setNewFood({...newFood, name: e.target.value})
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="foodCalories" className="block text-sm font-medium text-gray-700 mb-1">
                  Calorías
                </label>
                <input
                  id="foodCalories"
                  type="number"
                  value={editingFood ? editingFood.calories : newFood.calories}
                  onChange={(e) => editingFood 
                    ? setEditingFood({...editingFood, calories: parseInt(e.target.value) || 0})
                    : setNewFood({...newFood, calories: e.target.value})
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="foodProtein" className="block text-sm font-medium text-gray-700 mb-1">
                  Proteína (g)
                </label>
                <input
                  id="foodProtein"
                  type="number"
                  step="0.1"
                  value={editingFood ? editingFood.protein : newFood.protein}
                  onChange={(e) => editingFood 
                    ? setEditingFood({...editingFood, protein: parseFloat(e.target.value) || 0})
                    : setNewFood({...newFood, protein: e.target.value})
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="foodCarbs" className="block text-sm font-medium text-gray-700 mb-1">
                  Carbohidratos (g)
                </label>
                <input
                  id="foodCarbs"
                  type="number"
                  step="0.1"
                  value={editingFood ? editingFood.carbs : newFood.carbs}
                  onChange={(e) => editingFood 
                    ? setEditingFood({...editingFood, carbs: parseFloat(e.target.value) || 0})
                    : setNewFood({...newFood, carbs: e.target.value})
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="foodFat" className="block text-sm font-medium text-gray-700 mb-1">
                  Grasa (g)
                </label>
                <input
                  id="foodFat"
                  type="number"
                  step="0.1"
                  value={editingFood ? editingFood.fat : newFood.fat}
                  onChange={(e) => editingFood 
                    ? setEditingFood({...editingFood, fat: parseFloat(e.target.value) || 0})
                    : setNewFood({...newFood, fat: e.target.value})
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="foodFiber" className="block text-sm font-medium text-gray-700 mb-1">
                  Fibra (g)
                </label>
                <input
                  id="foodFiber"
                  type="number"
                  step="0.1"
                  value={editingFood ? editingFood.fiber : newFood.fiber}
                  onChange={(e) => editingFood 
                    ? setEditingFood({...editingFood, fiber: parseFloat(e.target.value) || 0})
                    : setNewFood({...newFood, fiber: e.target.value})
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="foodServingSize" className="block text-sm font-medium text-gray-700 mb-1">
                  Tamaño de Porción
                </label>
                <input
                  id="foodServingSize"
                  type="number"
                  step="0.1"
                  value={editingFood ? editingFood.servingSize : newFood.servingSize}
                  onChange={(e) => editingFood 
                    ? setEditingFood({...editingFood, servingSize: parseFloat(e.target.value) || 0})
                    : setNewFood({...newFood, servingSize: e.target.value})
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="foodServingUnit" className="block text-sm font-medium text-gray-700 mb-1">
                  Unidad
                </label>
                <select
                  id="foodServingUnit"
                  value={editingFood ? editingFood.servingUnit : newFood.servingUnit}
                  onChange={(e) => editingFood 
                    ? setEditingFood({...editingFood, servingUnit: e.target.value})
                    : setNewFood({...newFood, servingUnit: e.target.value})
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="g">gramos (g)</option>
                  <option value="ml">mililitros (ml)</option>
                  <option value="oz">onzas (oz)</option>
                  <option value="cup">taza</option>
                  <option value="piece">pieza</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={editingFood ? handleEditFood : handleAddFood}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                {editingFood ? 'Guardar Cambios' : 'Agregar Alimento'}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingFood(null);
                  setNewFood({
                    name: '',
                    calories: '',
                    protein: '',
                    carbs: '',
                    fat: '',
                    fiber: '',
                    servingSize: '',
                    servingUnit: 'g'
                  });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Lista de alimentos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFoods.map((food) => (
            <div key={food.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">{food.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingFood(food)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteFood(food.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Calorías:</span>
                  <span className="font-medium">{food.calories} kcal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Proteína:</span>
                  <span className="font-medium">{food.protein}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Carbohidratos:</span>
                  <span className="font-medium">{food.carbs}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Grasa:</span>
                  <span className="font-medium">{food.fat}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fibra:</span>
                  <span className="font-medium">{food.fiber}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Porción:</span>
                  <span className="font-medium">{food.servingSize} {food.servingUnit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFoods.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm ? 'No se encontraron alimentos con ese nombre.' : 'No hay alimentos personalizados. Agrega tu primer alimento!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomFoodsPage; 