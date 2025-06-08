import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // ESSENCIAL para enviar e receber cookies
});


// Interceptor de Requisição (continua o mesmo)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Resposta (Lógica de Refresh)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // O corpo da requisição agora é vazio, pois o cookie é enviado automaticamente
        const { data } = await api.post('/auth/refresh'); 
        localStorage.setItem('accessToken', data.accessToken);
        api.defaults.headers.common['Authorization'] = 'Bearer ' + data.accessToken;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;