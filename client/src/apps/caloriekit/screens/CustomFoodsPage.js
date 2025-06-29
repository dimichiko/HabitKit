import React, { useState, useEffect } from 'react';
import { getUserFoods, createFood, deleteFood, updateFood } from '../utils/api';

const CustomFoodsPage = () => {
  const [customFoods, setCustomFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [formData, setFormData] = useState({
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
    setLoading(true);
    try {
      const foods = await getUserFoods();
      setCustomFoods(foods);
    } catch (error) {
      console.error('Error loading custom foods:', error);
      setCustomFoods([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      baseAmount: '100',
      unit: 'g'
    });
    setEditingFood(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('El nombre del alimento es requerido');
      return;
    }

    const foodData = {
      name: formData.name.trim(),
      calories: parseFloat(formData.calories) || 0,
      protein: parseFloat(formData.protein) || 0,
      carbs: parseFloat(formData.carbs) || 0,
      fat: parseFloat(formData.fat) || 0,
      baseAmount: parseFloat(formData.baseAmount) || 100,
      unit: formData.unit
    };

    try {
      if (editingFood) {
        await updateFood(editingFood._id, foodData);
        alert('Alimento actualizado correctamente');
      } else {
        await createFood(foodData);
        alert('Alimento creado correctamente');
      }
      resetForm();
      loadCustomFoods();
    } catch (error) {
      console.error('Error saving food:', error);
      alert('Error al guardar el alimento');
    }
  };

  const handleEdit = (food) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      calories: food.calories.toString(),
      protein: food.protein.toString(),
      carbs: food.carbs.toString(),
      fat: food.fat.toString(),
      baseAmount: food.baseAmount.toString(),
      unit: food.unit
    });
    setShowForm(true);
  };

  const handleDelete = async (foodId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este alimento?')) {
      try {
        await deleteFood(foodId);
        alert('Alimento eliminado correctamente');
        loadCustomFoods();
      } catch (error) {
        console.error('Error deleting food:', error);
        alert('Error al eliminar el alimento');
      }
    }
  };

  const filteredFoods = customFoods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800" style={{paddingTop:'80px'}}>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800" style={{paddingTop:'80px'}}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">🍎</span>
                <h1 className="text-3xl font-bold text-orange-700 dark:text-orange-400">
                  Mis Alimentos Personalizados
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Crea y gestiona tus alimentos personalizados para añadirlos fácilmente a tus comidas
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 hover:scale-105"
            >
              + Crear Alimento
            </button>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar alimentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {editingFood ? 'Editar Alimento' : 'Crear Alimento'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="food-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre del Alimento *
                  </label>
                  <input
                    type="text"
                    id="food-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Ej: Pollo a la plancha"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="food-calories" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Calorías
                    </label>
                    <input
                      type="number"
                      id="food-calories"
                      name="calories"
                      value={formData.calories}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label htmlFor="food-protein" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Proteínas (g)
                    </label>
                    <input
                      type="number"
                      id="food-protein"
                      name="protein"
                      value={formData.protein}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label htmlFor="food-carbs" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Carbohidratos (g)
                    </label>
                    <input
                      type="number"
                      id="food-carbs"
                      name="carbs"
                      value={formData.carbs}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label htmlFor="food-fat" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Grasas (g)
                    </label>
                    <input
                      type="number"
                      id="food-fat"
                      name="fat"
                      value={formData.fat}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="food-baseAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cantidad Base
                    </label>
                    <input
                      type="number"
                      id="food-baseAmount"
                      name="baseAmount"
                      value={formData.baseAmount}
                      onChange={handleInputChange}
                      min="1"
                      step="1"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="food-unit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Unidad
                    </label>
                    <select
                      id="food-unit"
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
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
                    {editingFood ? 'Actualizar' : 'Crear'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
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

      {/* Content */}
      <main className="max-w-7xl mx-auto p-6">
        {customFoods.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-7xl mb-6">🍽️</div>
            <h3 className="text-2xl font-medium text-gray-800 dark:text-gray-200 mb-4">
              Aún no tienes alimentos personalizados
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6 text-center">
              Crea tu primer alimento personalizado para añadirlo fácilmente a tus comidas diarias.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 hover:scale-105"
            >
              + Crear Primer Alimento
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredFoods.map((food) => (
              <div key={food._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-700 group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {food.name}
                    </h3>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      Personalizado
                    </span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(food)}
                      className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Editar alimento"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(food._id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Eliminar alimento"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                      {food.calories}
                    </span>
                    <p className="text-xs text-gray-500">Calorías</p>
                  </div>
                  <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {food.protein}g
                    </span>
                    <p className="text-xs text-gray-500">Proteínas</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      {food.carbs}g
                    </span>
                    <p className="text-xs text-gray-500">Carbohidratos</p>
                  </div>
                  <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <span className="text-lg font-bold text-red-600 dark:text-red-400">
                      {food.fat}g
                    </span>
                    <p className="text-xs text-gray-500">Grasas</p>
                  </div>
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                  <p>Porción: {food.baseAmount} {food.unit}</p>
                  {food.createdAt && (
                    <p>Creado: {formatDate(food.createdAt)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {searchTerm && filteredFoods.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No se encontraron alimentos que coincidan con &quot;{searchTerm}&quot;
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomFoodsPage; 