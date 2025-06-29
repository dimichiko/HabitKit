// src/api.js
import axios from 'axios';

// Usamos el proxy configurado en package.json
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Usamos un "interceptor" para modificar todas las peticiones ANTES de que se envíen.
apiClient.interceptors.request.use(config => {
  // 1. Obtenemos el token del localStorage
  const token = localStorage.getItem('token');

  // 2. Si el token existe, lo añadimos a las cabeceras (headers)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Interceptor de respuesta para manejar errores 401 automáticamente
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si es un error 401 y no hemos intentado refrescar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Intentar refrescar el token
        const response = await apiClient.post('/auth/refresh');
        
        if (response.data && response.data.success && response.data.data.token) {
          const newToken = response.data.data.token;
          
          // Guardar el nuevo token
          localStorage.setItem('token', newToken);
          
          // Actualizar el header de la petición original
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          // Reintentar la petición original
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error al refrescar token:', refreshError);
        
        // Si falla el refresh, limpiar datos de sesión
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_plan');
        localStorage.removeItem('session_id');
        localStorage.removeItem('last_activity');
        
        // Redirigir al login si estamos en el navegador
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;