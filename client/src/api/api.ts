import { API_URL } from '@/config';
import axios from 'axios';

// Axios instance oluşturma
const api = axios.create({
  baseURL: `${API_URL}/api/`,
  withCredentials: true, // Cookie'leri gönderir
});

// CSRF token'ı backend'den alır
export const fetchCsrfToken = async () => {
  try {
    const response = await api.get('/auth/csrf-token');
    return response.data.csrfToken;
  } catch (error) {
    console.error('CSRF token alınırken hata oluştu:', error);
    return null;
  }
};

// Response interceptor - Hata durumlarını ele alır
/*  api.interceptors.response.use(
  (response) => response,
  async (error) => {
    
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        
        await api.get('/auth/refresh');
        return api(originalRequest);
      } catch (refreshError) {
        await api.get('/auth/logout');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);  */

export default api;
