import React, { useState, useEffect } from 'react';
import { addMeal } from '../utils/api';
import FoodSearch from './FoodSearch';

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
}

interface MealEntryProps {
  onMealAdded: (meal: any) => void;
  onClose: () => void;
  mealType?: string;
}

interface FormData {
  foodName: string;
  mealType: string;
  quantity: string;
  unit: string;
}

interface CalculatedValues {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Errors {
  foodName?: string;
  quantity?: string;
  submit?: string;
}

const MealEntry: React.FC<MealEntryProps> = ({ onMealAdded, onClose, mealType }) => {
  const [formData, setFormData] = useState<FormData>({
    foodName: '',
    mealType: mealType || 'lunch',
    quantity: '100', // Nueva cantidad por defecto
    unit: 'g' // Nueva unidad por defecto
  });
  const [loading, setLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [calculatedValues, setCalculatedValues] = useState<CalculatedValues>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  useEffect(() => {
    if (mealType) {
      setFormData(prev => ({ ...prev, mealType }));
    }
  }, [mealType]);

  // Función para calcular valores nutricionales basados en la cantidad
  const calculateNutritionalValues = (food: Food, quantity: number): CalculatedValues => {
    if (!food || !quantity || quantity <= 0) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }

    const baseAmount = food.baseAmount || 100;
    const multiplier = quantity / baseAmount;

    return {
      calories: Math.round((food.calories || 0) * multiplier * 10) / 10,
      protein: Math.round((food.protein || 0) * multiplier * 10) / 10,
      carbs: Math.round((food.carbs || 0) * multiplier * 10) / 10,
      fat: Math.round((food.fat || 0) * multiplier * 10) / 10
    };
  };

  // Actualizar valores calculados cuando cambie el alimento o la cantidad
  useEffect(() => {
    if (selectedFood && formData.quantity) {
      const calculated = calculateNutritionalValues(selectedFood, parseFloat(formData.quantity));
      setCalculatedValues(calculated);
    }
  }, [selectedFood, formData.quantity]);

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    
    if (!formData.foodName.trim()) {
      newErrors.foodName = 'El nombre del alimento es requerido';
    }
    
    const quantity = parseFloat(formData.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      newErrors.quantity = 'La cantidad debe ser un número válido mayor a 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name as keyof Errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFoodSelected = (food: Food) => {
    setSelectedFood(food);
    setFormData(prev => ({
      ...prev,
      foodName: food.name || '',
      unit: food.unit || 'g',
      quantity: '100' // Reset a 100 por defecto
    }));
    
    // Limpiar errores cuando se selecciona un alimento
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Usar los valores calculados automáticamente
      const mealData: any = {
        foodName: formData.foodName.trim(),
        calories: calculatedValues.calories,
        protein: calculatedValues.protein,
        carbs: calculatedValues.carbs,
        fat: calculatedValues.fat,
        mealType: mapMealTypeToEnglish(formData.mealType),
        quantity: parseFloat(formData.quantity) || 100,
        unit: formData.unit,
        servingSize: `${formData.quantity}${formData.unit}` // Para mostrar en la lista
      };

      // Solo agregar foodId si selectedFood existe y tiene _id válido
      if (selectedFood && selectedFood._id && typeof selectedFood._id === 'string') {
        mealData.foodId = selectedFood._id;
      }

      console.log('Enviando datos de comida:', mealData);
      const newMeal = await addMeal(mealData);
      onMealAdded(newMeal);
      onClose();
    } catch (error) {
      console.error('Error adding meal:', error);
      setErrors({ submit: 'Error al agregar la comida. Inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  const mapMealTypeToEnglish = (spanishType: string): string => {
    if (!spanishType) return 'snack';
    const mapping: Record<string, string> = {
      'desayuno': 'breakfast',
      'almuerzo': 'lunch',
      'cena': 'dinner',
      'snack': 'snack'
    };
    return mapping[spanishType.toLowerCase()] || spanishType.toLowerCase();
  };

  const getUnitLabel = (): string => {
    switch (formData.unit) {
      case 'g': return 'gramos';
      case 'ml': return 'mililitros';
      case 'unit': return 'unidades';
      default: return 'gramos';
    }
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            aria-label="Cerrar"
          >
            <span className="text-2xl">✕</span>
          </button>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Agregar Comida
          </h2>
        </div>
      </div>

      <div className="p-6">
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.submit}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Food Search */}
          <div>
            <label htmlFor="foodSearch" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Buscar alimento
            </label>
            <FoodSearch onFoodSelect={handleFoodSelected} />
          </div>

          {/* Food Name */}
          <div>
            <label htmlFor="foodName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              O registra un nombre nuevo
            </label>
            <input
              type="text"
              id="foodName"
              name="foodName"
              value={formData.foodName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 ${
                errors.foodName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Ej: Pollo a la plancha"
              required
            />
            {errors.foodName && (
              <p className="mt-1 text-sm text-red-600">{errors.foodName}</p>
            )}
          </div>

          {/* Cantidad y Unidad */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cantidad
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="0.1"
                step="0.1"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.quantity ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="100"
                required
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Unidad
              </label>
              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="g">Gramos (g)</option>
                <option value="ml">Mililitros (ml)</option>
                <option value="unit">Unidades</option>
              </select>
            </div>
          </div>

          {/* Información nutricional calculada */}
          {selectedFood && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-blue-600 dark:text-blue-400">📊</span>
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Valores nutricionales para {formData.quantity}{formData.unit} de {selectedFood.name}
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Calorías:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{calculatedValues.calories} cal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Proteínas:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{calculatedValues.protein}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Carbohidratos:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{calculatedValues.carbs}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Grasas:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{calculatedValues.fat}g</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !formData.foodName.trim()}
              className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Guardando...
                </span>
              ) : (
                'Guardar Comida'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MealEntry; 