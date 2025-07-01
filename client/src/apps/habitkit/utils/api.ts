// src/api.js
import axios from 'axios';

// Usamos el proxy configurado en package.json
// No necesitamos interceptores aquí porque ya están en UserContext
const apiClient = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor de request para agregar token automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('apiClient request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de response para debug
apiClient.interceptors.response.use(
  (response) => {
    console.log('apiClient response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('apiClient error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default apiClient;