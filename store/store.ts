import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import categoryReducer from "./categorySlice";
import courseReducer from "./courseSlice";
import lessonReducer from "./lessonSlice";

export const store = configureStore({
    reducer: {
      auth: authReducer,
      category: categoryReducer,
      course: courseReducer,
      lesson: lessonReducer,
    },
  });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;