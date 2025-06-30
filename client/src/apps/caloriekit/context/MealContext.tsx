import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Tipos
interface DailyGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface Food {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  servingSize: number;
  servingUnit: string;
  quantity?: number;
}

interface Meal {
  id: number;
  name: string;
  date: string;
  foods: Food[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  createdAt?: string;
}

interface MealState {
  meals: Meal[];
  dailyGoals: DailyGoals;
  customFoods: Food[];
  loading: boolean;
  error: string | null;
}

// Estado inicial
const initialState: MealState = {
  meals: [],
  dailyGoals: {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65,
    fiber: 25
  },
  customFoods: [],
  loading: false,
  error: null
};

// Tipos de acciones
type MealAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_MEALS'; payload: Meal[] }
  | { type: 'ADD_MEAL'; payload: Meal }
  | { type: 'UPDATE_MEAL'; payload: Meal }
  | { type: 'DELETE_MEAL'; payload: number }
  | { type: 'SET_DAILY_GOALS'; payload: DailyGoals }
  | { type: 'SET_CUSTOM_FOODS'; payload: Food[] }
  | { type: 'ADD_CUSTOM_FOOD'; payload: Food }
  | { type: 'UPDATE_CUSTOM_FOOD'; payload: Food }
  | { type: 'DELETE_CUSTOM_FOOD'; payload: number };

// Reducer
const mealReducer = (state: MealState, action: MealAction): MealState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_MEALS':
      return { ...state, meals: action.payload, loading: false };
    
    case 'ADD_MEAL':
      return { 
        ...state, 
        meals: [...state.meals, action.payload],
        loading: false 
      };
    
    case 'UPDATE_MEAL':
      return {
        ...state,
        meals: state.meals.map(meal => 
          meal.id === action.payload.id ? action.payload : meal
        ),
        loading: false
      };
    
    case 'DELETE_MEAL':
      return {
        ...state,
        meals: state.meals.filter(meal => meal.id !== action.payload),
        loading: false
      };
    
    case 'SET_DAILY_GOALS':
      return { ...state, dailyGoals: action.payload };
    
    case 'SET_CUSTOM_FOODS':
      return { ...state, customFoods: action.payload };
    
    case 'ADD_CUSTOM_FOOD':
      return {
        ...state,
        customFoods: [...state.customFoods, action.payload]
      };
    
    case 'UPDATE_CUSTOM_FOOD':
      return {
        ...state,
        customFoods: state.customFoods.map(food =>
          food.id === action.payload.id ? action.payload : food
        )
      };
    
    case 'DELETE_CUSTOM_FOOD':
      return {
        ...state,
        customFoods: state.customFoods.filter(food => food.id !== action.payload)
      };
    
    default:
      return state;
  }
};

// Contexto
interface MealContextType extends MealState {
  addMeal: (mealData: Partial<Meal>) => Promise<void>;
  updateMeal: (mealId: number, mealData: Partial<Meal>) => Promise<void>;
  deleteMeal: (mealId: number) => Promise<void>;
  addCustomFood: (foodData: Partial<Food>) => Promise<void>;
  updateCustomFood: (foodId: number, foodData: Partial<Food>) => Promise<void>;
  deleteCustomFood: (foodId: number) => Promise<void>;
  updateDailyGoals: (goals: DailyGoals) => void;
  getMealsByDate: (date: string) => Meal[];
  getDailyTotals: (date: string) => DailyGoals;
  getProgressPercentage: (date: string, nutrient: keyof DailyGoals) => number;
  refreshMeals: () => Promise<void>;
  setError: (errorMessage: string) => void;
}

const MealContext = createContext<MealContextType | undefined>(undefined);

// Hook personalizado
export const useMealContext = (): MealContextType => {
  const context = useContext(MealContext);
  if (!context) {
    throw new Error('useMealContext debe ser usado dentro de un MealProvider');
  }
  return context;
};

// Provider
interface MealProviderProps {
  children: ReactNode;
}

export const MealProvider: React.FC<MealProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(mealReducer, initialState);

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Simular carga de datos
      const mockMeals: Meal[] = [
        {
          id: 1,
          name: 'Desayuno',
          date: new Date().toISOString().split('T')[0],
          foods: [
            {
              id: 1,
              name: 'Avena',
              calories: 150,
              protein: 6,
              carbs: 27,
              fat: 3,
              fiber: 4,
              servingSize: 100,
              servingUnit: 'g',
              quantity: 1
            }
          ],
          totalCalories: 150,
          totalProtein: 6,
          totalCarbs: 27,
          totalFat: 3,
          totalFiber: 4
        }
      ];

      const mockCustomFoods: Food[] = [
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
        }
      ];

      dispatch({ type: 'SET_MEALS', payload: mockMeals });
      dispatch({ type: 'SET_CUSTOM_FOODS', payload: mockCustomFoods });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  // Funciones para manejar comidas
  const addMeal = async (mealData: Partial<Meal>): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const newMeal: Meal = {
        id: Date.now(),
        name: mealData.name || 'Comida',
        date: mealData.date || new Date().toISOString().split('T')[0],
        foods: mealData.foods || [],
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        totalFiber: 0
      };

      // Calcular totales
      const totals = newMeal.foods.reduce((acc, food) => ({
        calories: acc.calories + (food.calories * (food.quantity || 1)),
        protein: acc.protein + (food.protein * (food.quantity || 1)),
        carbs: acc.carbs + (food.carbs * (food.quantity || 1)),
        fat: acc.fat + (food.fat * (food.quantity || 1)),
        fiber: acc.fiber + (food.fiber * (food.quantity || 1))
      }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

      newMeal.totalCalories = totals.calories;
      newMeal.totalProtein = totals.protein;
      newMeal.totalCarbs = totals.carbs;
      newMeal.totalFat = totals.fat;
      newMeal.totalFiber = totals.fiber;

      dispatch({ type: 'ADD_MEAL', payload: newMeal });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  const updateMeal = async (mealId: number, mealData: Partial<Meal>): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const updatedMeal: Meal = {
        ...mealData,
        id: mealId,
        name: mealData.name || 'Comida',
        date: mealData.date || new Date().toISOString().split('T')[0],
        foods: mealData.foods || [],
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        totalFiber: 0
      };

      // Recalcular totales
      const totals = updatedMeal.foods.reduce((acc, food) => ({
        calories: acc.calories + (food.calories * (food.quantity || 1)),
        protein: acc.protein + (food.protein * (food.quantity || 1)),
        carbs: acc.carbs + (food.carbs * (food.quantity || 1)),
        fat: acc.fat + (food.fat * (food.quantity || 1)),
        fiber: acc.fiber + (food.fiber * (food.quantity || 1))
      }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

      updatedMeal.totalCalories = totals.calories;
      updatedMeal.totalProtein = totals.protein;
      updatedMeal.totalCarbs = totals.carbs;
      updatedMeal.totalFat = totals.fat;
      updatedMeal.totalFiber = totals.fiber;

      dispatch({ type: 'UPDATE_MEAL', payload: updatedMeal });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  const deleteMeal = async (mealId: number): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'DELETE_MEAL', payload: mealId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  // Funciones para manejar alimentos personalizados
  const addCustomFood = async (foodData: Partial<Food>): Promise<void> => {
    try {
      const newFood: Food = {
        id: Date.now(),
        name: foodData.name || '',
        calories: foodData.calories || 0,
        protein: foodData.protein || 0,
        carbs: foodData.carbs || 0,
        fat: foodData.fat || 0,
        fiber: foodData.fiber || 0,
        servingSize: foodData.servingSize || 0,
        servingUnit: foodData.servingUnit || 'g'
      };
      dispatch({ type: 'ADD_CUSTOM_FOOD', payload: newFood });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  const updateCustomFood = async (foodId: number, foodData: Partial<Food>): Promise<void> => {
    try {
      const updatedFood: Food = {
        ...foodData,
        id: foodId,
        name: foodData.name || '',
        calories: foodData.calories || 0,
        protein: foodData.protein || 0,
        carbs: foodData.carbs || 0,
        fat: foodData.fat || 0,
        fiber: foodData.fiber || 0,
        servingSize: foodData.servingSize || 0,
        servingUnit: foodData.servingUnit || 'g'
      };
      dispatch({ type: 'UPDATE_CUSTOM_FOOD', payload: updatedFood });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  const deleteCustomFood = async (foodId: number): Promise<void> => {
    try {
      dispatch({ type: 'DELETE_CUSTOM_FOOD', payload: foodId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  // Funciones para objetivos diarios
  const updateDailyGoals = (goals: DailyGoals): void => {
    dispatch({ type: 'SET_DAILY_GOALS', payload: goals });
  };

  // Funciones de utilidad
  const getMealsByDate = (date: string): Meal[] => {
    return state.meals.filter(meal => meal.date === date);
  };

  const getDailyTotals = (date: string): DailyGoals => {
    const dayMeals = getMealsByDate(date);
    return dayMeals.reduce((acc, meal) => ({
      calories: acc.calories + meal.totalCalories,
      protein: acc.protein + meal.totalProtein,
      carbs: acc.carbs + meal.totalCarbs,
      fat: acc.fat + meal.totalFat,
      fiber: acc.fiber + meal.totalFiber
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  };

  const getProgressPercentage = (date: string, nutrient: keyof DailyGoals): number => {
    const dailyTotals = getDailyTotals(date);
    const goal = state.dailyGoals[nutrient];
    return goal > 0 ? Math.min((dailyTotals[nutrient] / goal) * 100, 100) : 0;
  };

  // Función para refrescar comidas
  const refreshMeals = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await loadInitialData();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  // Función para establecer error
  const setError = (errorMessage: string): void => {
    dispatch({ type: 'SET_ERROR', payload: errorMessage });
  };

  const value: MealContextType = {
    // Estado
    ...state,
    
    // Funciones de comidas
    addMeal,
    updateMeal,
    deleteMeal,
    
    // Funciones de alimentos personalizados
    addCustomFood,
    updateCustomFood,
    deleteCustomFood,
    
    // Funciones de objetivos
    updateDailyGoals,
    
    // Funciones de utilidad
    getMealsByDate,
    getDailyTotals,
    getProgressPercentage,
    
    // Funciones adicionales
    refreshMeals,
    setError
  };

  return (
    <MealContext.Provider value={value}>
      {children}
    </MealContext.Provider>
  );
};

export default MealContext; 