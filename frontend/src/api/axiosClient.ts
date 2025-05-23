// Cliente Axios centralizado para CajaPyme
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT si existe
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('cajapyme-jwt');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar expiración de sesión
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('cajapyme-jwt');
      localStorage.removeItem('cajapyme-auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
