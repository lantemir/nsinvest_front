import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/axios";

interface Profile {
  avatar: string | null,
  phone_number: string | null
}

// Интерфейс состояния аутентификации
interface AuthState {
  user: { id: number; username: string; email: string | null; profile: Profile } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  status: 'checking' | 'authenticated' | 'unauthenticated';
}

// ✅ Читаем `token` и `user` из `sessionStorage`, если есть
// const storedToken = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
// const storedUser = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("user") || "null") : null;

// Начальное состояние
const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  status: 'checking', // стартуем в режиме проверки
};

// ✅ Функция загрузки пользователя из `sessionStorage`
export const loadUserFromSession = createAsyncThunk("auth/loadUser", async () => {

  if (typeof window === "undefined") return null;

  const token = sessionStorage.getItem("token");
  const user = sessionStorage.getItem("user");

  if (token && user) {
    return { token, user: JSON.parse(user) };
  }
  return null;

});

// Регистрация пользователя
// Регистрация пользователя
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ username, email, password }: { username: string; email: string; password: string }, thunkAPI) => {
    try {
      const response = await api.post("api/auth/register/", { username, email, password });
      return response.data;
    } catch (error: any) {
      //console.error("Ошибка регистрации:", error.response?.data); // Логируем ошибки

      let errorMessage = "Ошибка регистрации"; // Значение по умолчанию

      // Если сервер вернул объект с ошибками валидации
      if (error.response?.data) {
        if (typeof error.response.data === "object") {
          errorMessage = Object.values(error.response.data).flat().join(" "); // Объединяем все ошибки в одну строку
        } else {
          errorMessage = error.response.data.detail || "Ошибка регистрации";
        }
      }

      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const verifyEmail = createAsyncThunk<
  any,
  { email: string; code: string },
  { rejectValue: { error: string } }
>(
  "auth/verifyEmail",
  async ({ email, code }: { email: string; code: string }, thunkAPI) => {
    try {
      const response = await api.post("api/auth/verify-email/", { email, code });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.error || "Неверный код подтверждения");
    }
  }
);

export const resendVerifyEmail = createAsyncThunk(
  "auth/resendVerificationCode",
  async ({ email }: { email: string }, thunkAPI) => {
    try {
      const response = await api.post("api/auth/resend-verification-code/", { email });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.detail || "Неверный код подтверждения");
    }
  }
);

// Авторизация пользователя
export const loginUser = createAsyncThunk<
  any,
  { username: string; password: string },
  { rejectValue: { error: string; email?: string } }  // <-- Указываем, что в `rejectWithValue` будет объект
>(
  "auth/loginUser",
  async ({ username, password }: { username: string; password: string }, thunkAPI) => {
    try {
      const response = await api.post("api/auth/login/", { username, password });

      // ✅ Сохраняем `access token` в памяти, но НЕ `refresh token`
      sessionStorage.setItem("token", response.data.access)
      sessionStorage.setItem("user", JSON.stringify(response.data.user));

      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Ошибка входа";

      // Если аккаунт не подтвержден, достаем email из базы
      if (errorMessage.includes("Подтвердите email перед входом")) {
        try {
          const userResponse = await api.get(`/api/auth/get-user-by-username/${username}/`);
          const userEmail = userResponse.data.email;
          return thunkAPI.rejectWithValue({ error: errorMessage, email: userEmail });
        } catch {
          return thunkAPI.rejectWithValue({ error: errorMessage })
        }
      }

      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const refreshUser = createAsyncThunk(
  "auth/refresh",
  async (_, thunkAPI) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.get("api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      sessionStorage.setItem("user", JSON.stringify(response.data));
      return { user: response.data, token }

    } catch (error: any) {
      return thunkAPI.rejectWithValue("не удалось обновить данные пользователя")
    }
  }
)

export const changePassword = createAsyncThunk<
  any,
  { username: string; password: string },
  { rejectValue: { error: string } }
>(
  "auth/password",
  async ({ username, password }: { username: string; password: string }, thunkAPI) => {
    try {
      const response = await api.post("api/auth/password/", { username, password });
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.error || "password не изменён")
    }

  }
)

export const forgotPassword = createAsyncThunk<
  any,
  { email: string; },
  { rejectValue: { error: string } }
>(
  "auth/forgot-password",
  async ({ email }: { email: string }, thunkAPI) => {
    try {
      const response = await api.post("api/auth/forgot-password/", { email });
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.error || "Не получилось изменить password")
    }
  }
)

export const resetPassword = createAsyncThunk<
  any,
  { uid: string, token: string, password: string },
  { rejectValue: { error: string } }
>(
  "auth/reset-password",
  async ({ uid, token, password }: { uid: string, token: string, password: string }, thunkAPI) => {
    try {
      const response = await api.post("/api/auth/reset-password-confirm/", { uid, token, password })
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.respons?.data?.error || "Ошибка сброса пароля")
    }
  }
)




// Slice аутентификации
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = 'unauthenticated';
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.loading = false;
        s.token = a.payload.access;
        s.user = a.payload.user;
        s.status = 'authenticated';
      })
      .addCase(loginUser.rejected, (s, a) => {
        s.loading = false;
        s.error = (a.payload as any)?.error;
        s.status = 'unauthenticated';
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.token = action.payload.token
        state.user = action.payload.user
      })
      .addCase(loadUserFromSession.fulfilled, (s, a) => {
        if (a.payload) {
          s.token = a.payload.token;
          s.user = a.payload.user;
          s.status = 'authenticated';
        } else {
          s.status = 'unauthenticated';
        }
      })
      .addCase(loadUserFromSession.pending, (s) => { s.status = 'checking'; })
      .addCase(loadUserFromSession.rejected, (s) => { s.status = 'unauthenticated'; })
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
