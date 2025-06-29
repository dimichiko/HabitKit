const API_URL = '/api';

const request = async (endpoint, method = 'GET', body = null) => {
  const token = localStorage.getItem('token');
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CalorieKit API Error:', errorText);
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.message || 'API request failed');
      } catch (e) {
        throw new Error(errorText || 'API request failed with non-JSON response');
      }
    }

    if (response.status === 204) {
      return null;
    }
    
    const data = await response.json();
    
    // Permitir respuestas vacías válidas (arrays vacíos, null, etc.)
    return data;
  } catch (error) {
    console.error('CalorieKit API Request Error:', error);
    throw error;
  }
};

// --- API de Autenticación y Perfil ---
export const getProfile = () => request('/auth/profile');
export const getUserProfile = () => request('/auth/profile');
export const updateProfile = (profileData) => request('/auth/profile', 'PUT', profileData);
export const saveProfile = (profileData) => request('/auth/profile', 'POST', profileData);

export const calculateMacros = (profileData) => request('/calories/calculate-macros', 'POST', profileData);

// --- API de Alimentos ---
export const searchFood = (query) => {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    throw new Error('Query de búsqueda inválida');
  }
  return request(`/calories/food/search?q=${encodeURIComponent(query.trim())}`);
};

export const createFood = (foodData) => {
  if (!foodData || !foodData.name || typeof foodData.name !== 'string') {
    throw new Error('Datos de alimento inválidos');
  }
  return request('/calories/food', 'POST', foodData);
};

export const updateFood = (foodId, foodData) => {
  if (!foodId) {
    throw new Error('ID de alimento requerido');
  }
  if (!foodData || !foodData.name || typeof foodData.name !== 'string') {
    throw new Error('Datos de alimento inválidos');
  }
  return request(`/calories/food/${foodId}`, 'PUT', foodData);
};

export const getUserFoods = () => request('/calories/food/user');
export const deleteFood = (foodId) => {
  if (!foodId) {
    throw new Error('ID de alimento requerido');
  }
  return request(`/calories/food/${foodId}`, 'DELETE');
};

// --- API de Comidas ---
export const getTodayMeals = () => {
    const today = new Date().toISOString().split('T')[0];
    return getMealsByDate(today);
};

export const getMealsByDate = (date) => {
  if (!date || typeof date !== 'string') {
    throw new Error('Fecha inválida');
  }
  return request(`/calories/meals/date/${date}`);
};

export const addMeal = (mealData) => {
  if (!mealData || !mealData.foodName || typeof mealData.foodName !== 'string') {
    throw new Error('Datos de comida inválidos');
  }
  
  // Validar valores nutricionales
  const validatedMeal = {
    ...mealData,
    calories: parseFloat(mealData.calories) || 0,
    protein: parseFloat(mealData.protein) || 0,
    carbs: parseFloat(mealData.carbs) || 0,
    fat: parseFloat(mealData.fat) || 0
  };
  
  return request('/calories/meals', 'POST', validatedMeal);
};

export const deleteMeal = (mealId) => {
  if (!mealId) {
    throw new Error('ID de comida requerido');
  }
  return request(`/calories/meals/${mealId}`, 'DELETE');
};

// --- API de Peso ---
export const getLatestWeight = () => request('/calories/weight/latest');
export const addWeightEntry = (entry) => {
  if (!entry || typeof entry.weight !== 'number' || entry.weight <= 0) {
    throw new Error('Peso inválido');
  }
  return request('/calories/weight', 'POST', entry);
};

export const getWeightEntries = () => request('/calories/weight');
export const updateWeightEntry = (id, data) => {
  if (!id) {
    throw new Error('ID de entrada requerido');
  }
  if (!data || typeof data.weight !== 'number' || data.weight <= 0) {
    throw new Error('Datos de peso inválidos');
  }
  return request(`/calories/weight/${id}`, 'PUT', data);
};

export const deleteWeightEntry = (id) => {
  if (!id) {
    throw new Error('ID de entrada requerido');
  }
  return request(`/calories/weight/${id}`, 'DELETE');
};

export const getWeightStats = (days = 30) => {
  if (typeof days !== 'number' || days <= 0) {
    throw new Error('Número de días inválido');
  }
  return request(`/calories/weight/stats?days=${days}`);
};

export const getMealStats = (days = 7) => {
  if (typeof days !== 'number' || days <= 0) {
    throw new Error('Número de días inválido');
  }
  return request(`/calories/stats?days=${days}`);
}; 