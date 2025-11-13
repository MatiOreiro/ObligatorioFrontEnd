import axios from 'axios'

const api = axios.create({
    baseURL: 'https://obligatorio-five.vercel.app/v1',
    headers: {
        'Content-Type': 'application/json'
    }
})

// Interceptor de request
api.interceptors.request.use(
    (config) => {
        // Agregar headers requeridos siempre
        config.headers["Content-type"] = "application/json; charset=UTF-8";
        // Evitar añadir token en login/registro
        if (config.skipAuth) return config;
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de response (ejemplo: manejar expiración de token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Token inválido o expirado");
      // Podés redirigir al login, limpiar storage, etc.
    }
    return Promise.reject(error);
  }
);

export default api;

/*
https://obligatorio-five.vercel.app/v1
http://localhost:3000/v1
*/