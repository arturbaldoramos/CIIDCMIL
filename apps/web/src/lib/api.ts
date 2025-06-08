import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor de REQUISIÇÃO (adiciona o token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  // A primeira função lida com respostas de sucesso, apenas as repassa
  (response) => {
    return response;
  },
  // A segunda função lida com erros
  (error) => {
    // Verifica se o erro é 401 (Não Autorizado)
    if (error.response && error.response.status === 401) {
      // Limpa o token inválido/expirado
      localStorage.removeItem('accessToken');
      
      // Redireciona o usuário para a página de login
      // Usamos window.location para garantir o redirecionamento mesmo fora de um componente React
      window.location.href = '/login';
    }

    // Para outros erros, apenas rejeita a promise para que possam ser tratados localmente
    return Promise.reject(error);
  }
);


export default api;