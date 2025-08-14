// utils/axios.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/** ===== Хранилище access в памяти (не дергать sessionStorage по 100 раз) ===== */
let ACCESS: string | null =
  typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

const setAccess = (t: string | null) => {
  ACCESS = t;
  if (typeof window !== "undefined") {
    if (t) sessionStorage.setItem("token", t);
    else {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    }
  }
};
export const getAccess = () => ACCESS;

/** ===== Инстансы ===== */
// 1) Боевой инстанс с интерсепторами — используешь ВЕЗДЕ в приложении
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// 2) ПЛОСКИЙ инстанс без интерсепторов — только для withAuth/refresh/me
export const axiosPlain = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/** ===== Refresh c мьютексом (защита от параллельных refresh) ===== */
let refreshing = false;
let waiters: ((t: string | null) => void)[] = [];

export async function refreshToken(): Promise<string | null> {
  if (refreshing) {
    return new Promise((res) => waiters.push(res));
  }
  refreshing = true;
  try {
    const r = await axiosPlain.post("/api/auth/refresh/", null); // httpOnly cookie отправится из-за withCredentials:true
    const access = r.data?.access ?? null;
    setAccess(access);
    return access;
  } catch (_e) {
    setAccess(null);
    return null; // не бросаем — вызывающая сторона решит, что делать
  } finally {
    refreshing = false;
    waiters.forEach((fn) => fn(ACCESS));
    waiters = [];
  }
}

/** ===== Интерсепторы на боевом инстансе ===== */

// request: проставляем Bearer
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccess();
  // пути, где токен не нужен
  const noAuth = ["/api/auth/register/", "/api/auth/verify-email/", "/api/auth/login/"];
  // config.url может быть как относительным, так и абсолютным — страхуемся:
  const url = (config.url || "").replace(API_URL, "");
  if (token && !noAuth.some((p) => url.startsWith(p))) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// response: на 401 — один refresh и повтор запроса
api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as any;
    const status = error.response?.status;

    // не трогаем явные auth-роуты, чтобы не зациклить
    const url = (original?.url || "").toString().replace(API_URL, "");
    const isAuthRoute = url.startsWith("/api/auth/login/") || url.startsWith("/api/auth/register/");

    if (status === 401 && !isAuthRoute && !original?._retry) {
      original._retry = true;
      const newAccess = await refreshToken(); // ← НЕ бросает
      if (newAccess) {
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original); // повторяем запрос с новым токеном
      }
    }
    // дальше — пусть обработает вызывающий код (без красного overlay, если там try/catch)
    return Promise.reject(error);
  }
);

export default api;
