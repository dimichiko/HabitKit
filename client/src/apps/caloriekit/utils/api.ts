const API_URL = '/api';

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
  targetWeight?: number;
}

interface UserProfile extends ProfileData {
  _id: string;
  dailyCalories?: number;
  dailyProtein?: number;
  dailyCarbs?: number;
  dailyFat?: number;
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

interface Food extends FoodData {
  _id: string;
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

interface Meal extends MealData {
  _id: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
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

interface WeightStats {
  entries: Array<{
    weight: number;
    date: string;
  }>;
}

interface AuthResponse {
  token: string;
  user: UserProfile;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Función request tipada
const request = async <T>(endpoint: string, method: string = 'GET', body: any = null): Promise<T> => {
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
export const login = (credentials: { email: string; password: string }): Promise<AuthResponse> => 
  request<AuthResponse>('/auth/login', 'POST', credentials);

export const register = (userData: { name: string; email: string; password: string }): Promise<AuthResponse> => 
  request<AuthResponse>('/auth/register', 'POST', userData);

export const getProfile = (): Promise<UserProfile> => request<UserProfile>('/auth/profile');

export const updateProfile = (profileData: ProfileData): Promise<UserProfile> => request<UserProfile>('/auth/profile', 'PUT', profileData);
export const saveProfile = (profileData: ProfileData): Promise<UserProfile> => request<UserProfile>('/auth/profile', 'POST', profileData);

// Funciones de cálculo de macros
export const calculateMacros = (profileData: ProfileData): Promise<{ dailyCalories: number; dailyProtein: number; dailyCarbs: number; dailyFat: number }> => 
  request<{ dailyCalories: number; dailyProtein: number; dailyCarbs: number; dailyFat: number }>('/calories/calculate-macros', 'POST', profileData);

// Funciones de búsqueda y gestión de alimentos
export const searchFood = (query: string): Promise<Food[]> => {
  const params = new URLSearchParams({ q: query });
  return request<Food[]>(`/calories/foods/search?${params}`);
};

export const createFood = (foodData: FoodData): Promise<Food> => {
  return request<Food>('/calories/foods', 'POST', foodData);
};

export const getFoods = (): Promise<Food[]> => request<Food[]>('/calories/foods');

export const updateFood = (foodId: string, foodData: FoodData): Promise<Food> => {
  return request<Food>(`/calories/foods/${foodId}`, 'PUT', foodData);
};

export const deleteFood = (foodId: string): Promise<{ message: string }> => {
  return request<{ message: string }>(`/calories/foods/${foodId}`, 'DELETE');
};

// Funciones de gestión de comidas
export const getMealsByDate = (date: string): Promise<Meal[]> => {
  const params = new URLSearchParams({ date });
  return request<Meal[]>(`/calories/meals?${params}`);
};

export const addMeal = (mealData: MealData): Promise<Meal> => {
  return request<Meal>('/calories/meals', 'POST', mealData);
};

export const getMeals = (): Promise<Meal[]> => request<Meal[]>('/calories/meals');

export const deleteMeal = (mealId: string): Promise<{ message: string }> => {
  return request<{ message: string }>(`/calories/meals/${mealId}`, 'DELETE');
};

// Funciones de seguimiento de peso
export const addWeightEntry = (entry: WeightEntry): Promise<WeightEntry & { _id: string }> => {
  return request<WeightEntry & { _id: string }>('/calories/weight', 'POST', entry);
};

export const getWeightEntries = (): Promise<WeightEntry[]> => request<WeightEntry[]>('/calories/weight');

export const getWeightStats = (days: number): Promise<WeightStats> => {
  const params = new URLSearchParams({ days: days.toString() });
  return request<WeightStats>(`/calories/weight/stats?${params}`);
};

export const updateWeightEntry = (id: string, data: WeightUpdateData): Promise<WeightEntry & { _id: string }> => {
  return request<WeightEntry & { _id: string }>(`/calories/weight/${id}`, 'PUT', data);
};

export const deleteWeightEntry = (id: string): Promise<{ message: string }> => {
  return request<{ message: string }>(`/calories/weight/${id}`, 'DELETE');
};

export const getLatestWeight = () => request('/calories/weight/latest');

export const getTodayMeals = () => {
    const today = new Date().toISOString().split('T')[0];
    return getMealsByDate(today);
};

export const getMealStats = (days = 7) => {
  if (typeof days !== 'number' || days <= 0) {
    throw new Error('Número de días inválido');
  }
  return request(`/calories/stats?days=${days}`);
}; 