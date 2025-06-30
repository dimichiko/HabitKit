// Interfaces para los tipos de datos
interface ProfileData {
  name: string;
  email: string;
  age: number;
  gender: string;
  weight: number;
  height: number;
  activityLevel: string;
  goal: string;
}

interface FoodData {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

interface MealData {
  type: string;
  foods: Array<{
    foodId: string;
    quantity: number;
  }>;
  date: string;
  totalCalories: number;
}

interface WeightEntry {
  weight: number;
  date: string;
  notes?: string;
}

interface WeightUpdateData {
  weight: number;
  notes?: string;
}

// Función request tipada
const request = async (endpoint: string, method: string = 'GET', body: any = null) => {
  const token = localStorage.getItem('token');
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en la petición');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Funciones de autenticación
export const login = (credentials: { email: string; password: string }) => 
  request('/auth/login', 'POST', credentials);

export const register = (userData: { name: string; email: string; password: string }) => 
  request('/auth/register', 'POST', userData);

export const getProfile = () => request('/auth/profile');

export const updateProfile = (profileData: ProfileData) => request('/auth/profile', 'PUT', profileData);
export const saveProfile = (profileData: ProfileData) => request('/auth/profile', 'POST', profileData);

// Funciones de cálculo de macros
export const calculateMacros = (profileData: ProfileData) => request('/calories/calculate-macros', 'POST', profileData);

// Funciones de búsqueda y gestión de alimentos
export const searchFood = (query: string) => {
  const params = new URLSearchParams({ q: query });
  return request(`/calories/foods/search?${params}`);
};

export const createFood = (foodData: FoodData) => {
  return request('/calories/foods', 'POST', foodData);
};

export const getFoods = () => request('/calories/foods');

export const updateFood = (foodId: string, foodData: FoodData) => {
  return request(`/calories/foods/${foodId}`, 'PUT', foodData);
};

export const deleteFood = (foodId: string) => {
  return request(`/calories/foods/${foodId}`, 'DELETE');
};

// Funciones de gestión de comidas
export const getMealsByDate = (date: string) => {
  const params = new URLSearchParams({ date });
  return request(`/calories/meals?${params}`);
};

export const addMeal = (mealData: MealData) => {
  return request('/calories/meals', 'POST', mealData);
};

export const getMeals = () => request('/calories/meals');

export const deleteMeal = (mealId: string) => {
  return request(`/calories/meals/${mealId}`, 'DELETE');
};

// Funciones de seguimiento de peso
export const addWeightEntry = (entry: WeightEntry) => {
  return request('/calories/weight', 'POST', entry);
};

export const getWeightEntries = () => request('/calories/weight');

export const updateWeightEntry = (id: string, data: WeightUpdateData) => {
  return request(`/calories/weight/${id}`, 'PUT', data);
};

export const deleteWeightEntry = (id: string) => {
  return request(`/calories/weight/${id}`, 'DELETE');
}; 