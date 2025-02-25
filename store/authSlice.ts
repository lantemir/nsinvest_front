import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/axios";

// Интерфейс состояния аутентификации
interface AuthState {
  user: { id: number; username: string } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Начальное состояние
const initialState: AuthState = {
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  loading: false,
  error: null,
};

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
        return thunkAPI.rejectWithValue(error.response?.data?.error  || "Неверный код подтверждения");
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
export const loginUser = createAsyncThunk <
any,
{ username: string; password: string },
{ rejectValue: { error: string; email?: string } }  // <-- Указываем, что в `rejectWithValue` будет объект
> (
  "auth/loginUser",
  async ({ username, password }: { username: string; password: string }, thunkAPI) => {
    try {
      const response = await api.post("api/auth/login/", { username, password });
      
      // ✅ Сохраняем `access token` в памяти, но НЕ `refresh token`
      sessionStorage.setItem("token", response.data.access)
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Ошибка входа";

       // Если аккаунт не подтвержден, достаем email из базы
      if (errorMessage.includes("Подтвердите email перед входом")) {
        try{
          const userResponse = await api.get(`/api/auth/get-user-by-username/${username}/`);
          const userEmail = userResponse.data.email;
          return thunkAPI.rejectWithValue({error: errorMessage, email: userEmail});
        } catch {
          return thunkAPI.rejectWithValue({error: errorMessage})
        }        
      }

      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);



// Slice аутентификации
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      sessionStorage.removeItem("token");
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
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error as string;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
