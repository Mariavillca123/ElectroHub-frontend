import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL || "https://electrohub-backend-ejdt.onrender.com";

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
});

// Interceptor para agregar el token automáticamente a todas las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
