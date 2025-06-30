import React, { useState, useEffect } from 'react';
import { getUserFoods, deleteFood } from '../utils/api';

// Tipos
interface Food {
  _id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  baseAmount: number;
  unit: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CustomFoodsManagerProps {
  userProfile?: any; // Puedes definir el tipo real si lo tienes
  isPage?: boolean;
}

const CustomFoodsManager: React.FC<CustomFoodsManagerProps> = ({ userProfile, isPage = false }) => {
  const [customFoods, setCustomFoods] = useState<Food[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isPage || isOpen) {
      loadCustomFoods();
    }
  }, [isOpen, isPage]);

  const loadCustomFoods = async () => {
    setLoading(true);
    try {
      const foods = await getUserFoods();
      setCustomFoods(foods as Food[]);
    } catch (error) {
      console.error('Error loading custom foods:', error);
      setCustomFoods([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFood = async (foodId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este alimento personalizado?')) {
      try {
        await deleteFood(foodId);
        loadCustomFoods(); // Recargar la lista
      } catch (error) {
        console.error('Error deleting food:', error);
        alert('Error al eliminar el alimento');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Si es página completa, renderizar contenido completo
  if (isPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800" style={{paddingTop:'80px'}}>
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-md py-8 px-6">
          <div className="max-w-7xl mx-auto flex flex-col items-start gap-2">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-4xl">🍎</span>
              <h1 className="text-3xl font-bold text-orange-700 dark:text-orange-400">
                Mis Alimentos Personalizados
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-base">
              Guarda aquí tus alimentos personalizados y agrégalos fácilmente en futuras comidas.
            </p>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-7xl mx-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : customFoods.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="text-7xl mb-6">🍽️</div>
              <h3 className="text-2xl font-medium text-gray-800 dark:text-gray-200 mb-4">
                Aún no tienes alimentos personalizados
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                Cuando agregues uno desde el registro de comidas, aparecerá aquí.
              </p>
              <button
                className="px-6 py-3 bg-orange-500 hover:bg-orange-400 focus:bg-orange-600 text-white font-bold rounded-xl shadow-lg ring-2 ring-orange-200 focus:ring-4 focus:outline-none transition-all duration-200 scale-100 hover:scale-105 focus:scale-105"
                aria-label="Crear Alimento Personalizado"
                tabIndex={0}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.target as HTMLElement).click()}
                onClick={() => alert('Funcionalidad de crear alimento personalizado próximamente')}
              >
                + Crear Alimento Personalizado
              </button>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {customFoods.map((food) => (
                <div key={food._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-700 group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{food.name}</h3>
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          Personalizado
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="p-2 text-gray-400 hover:text-blue-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                        title="Editar alimento"
                        aria-label={`Editar ${food.name}`}
                        tabIndex={0}
                        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.target as HTMLElement).click()}
                        onClick={() => alert('Funcionalidad de editar próximamente')}
                      >
                        <span role="img" aria-label="Editar">🖉</span>
                      </button>
                      <button
                        onClick={() => handleDeleteFood(food._id)}
                        className="p-2 text-red-500 hover:text-red-700 rounded-full focus:outline-none focus:ring-2 focus:ring-red-300"
                        title="Eliminar alimento"
                        aria-label={`Eliminar ${food.name}`}
                        tabIndex={0}
                        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.target as HTMLElement).click()}
                      >
                        <span role="img" aria-label="Eliminar">🗑</span>
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <span className="text-2xl font-bold text-orange-600">{food.calories}</span>
                      <p className="text-sm text-gray-500">Calorías</p>
                    </div>
                    <div className="text-center">
                      <span className="text-2xl font-bold text-blue-600">{food.protein}g</span>
                      <p className="text-sm text-gray-500">Proteínas</p>
                    </div>
                    <div className="text-center">
                      <span className="text-2xl font-bold text-green-600">{food.carbs}g</span>
                      <p className="text-sm text-gray-500">Carbohidratos</p>
                    </div>
                    <div className="text-center">
                      <span className="text-2xl font-bold text-red-600">{food.fat}g</span>
                      <p className="text-sm text-gray-500">Grasas</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    <p>Porción: {food.baseAmount} {food.unit}</p>
                    {food.createdAt && (
                      <p>Creado: {formatDate(food.createdAt)}</p>
                    )}
                    {food.updatedAt && food.updatedAt !== food.createdAt && (
                      <p>Actualizado: {formatDate(food.updatedAt)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }

  // Si no es página, renderizar como modal (comportamiento original)
  return (
    <>
      {/* Button to open manager */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-orange-700 bg-orange-100 rounded-lg hover:bg-orange-200 transition"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        Mis Alimentos ({customFoods.length})
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Mis Alimentos Personalizados
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {customFoods.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    No tienes alimentos personalizados
                  </h3>
                  <p className="text-gray-600">
                    Los alimentos que agregues como &quot;personalizados&quot; aparecerán aquí para uso futuro.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {customFoods.map((food) => (
                    <div key={food._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium text-gray-900">{food.name}</h3>
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                              Personalizado
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-4 text-sm mb-2">
                            <div>
                              <span className="font-semibold text-orange-600">{food.calories} cal</span>
                              <p className="text-gray-500">Calorías</p>
                            </div>
                            <div>
                              <span className="font-semibold text-blue-600">{food.protein}g</span>
                              <p className="text-gray-500">Proteínas</p>
                            </div>
                            <div>
                              <span className="font-semibold text-green-600">{food.carbs}g</span>
                              <p className="text-gray-500">Carbohidratos</p>
                            </div>
                            <div>
                              <span className="font-semibold text-red-600">{food.fat}g</span>
                              <p className="text-gray-500">Grasas</p>
                            </div>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            <p>Porción: {food.baseAmount} {food.unit}</p>
                            {food.createdAt && (
                              <p>Creado: {formatDate(food.createdAt)}</p>
                            )}
                            {food.updatedAt && food.updatedAt !== food.createdAt && (
                              <p>Actualizado: {formatDate(food.updatedAt)}</p>
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleDeleteFood(food._id)}
                          className="text-red-500 hover:text-red-700 transition p-2"
                          title="Eliminar alimento"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomFoodsManager; 