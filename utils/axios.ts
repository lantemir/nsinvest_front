import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Создаем экземпляр axios с настройками
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,  // ✅ Обязательно добавь
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 Создаем `axios` без интерсепторов (чтобы `refreshToken()` работал корректно)
const axiosWithoutInterceptor = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Функция для обновления `access_token`
let isRefreshing = false;
const refreshToken = async () => {
  if(isRefreshing) return null;
  isRefreshing = true;

  try {
    const response = await axiosWithoutInterceptor.post("/api/auth/refresh/", null, {
      withCredentials: true, // ✅ ОБЯЗАТЕЛЬНО для отправки httpOnly куки
    }); // `refresh_token` берётся из cookie
    sessionStorage.setItem("token", response.data.access); // ✅ Обновляем `access_token`
    return response.data.access;
  } catch (error) {
    console.error("Ошибка обновления токена:", error);
    sessionStorage.removeItem("token"); // ✅ Удаляем `access_token`
    return null;
  }
};

// ✅ Интерсептор запросов (перед отправкой)
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

  // Пути, которые **не требуют авторизации**
  const noAuthRoutes = ["/api/auth/register/", "/api/auth/verify-email/"];

  if (token && !noAuthRoutes.includes(config.url || "")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//✅ Интерсептор ответов (если 401, пробуем обновить токен)
api.interceptors.response.use(
  (response) => response, // ✅ Если ответ успешный, возвращаем как есть
  async (error) => {
    const originalRequest = error.config;

    // Если ошибка 401 (Unauthorized) и запрос еще не повторялся
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // ✅ Флаг, чтобы не зациклить запрос

      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        // ✅ Обновляем заголовок запроса и повторяем его
        sessionStorage.setItem("token", newAccessToken);
        api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default api;