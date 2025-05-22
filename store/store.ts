import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import categoryReducer from "./categorySlice";
import courseReducer from "./courseSlice";
import lessonReducer from "./lessonSlice";
import mainReducer from "./mainSlice";
import bookReducer from "./bookSlice";
import meetingSlice from "./meetingSlice";

export const store = configureStore({
    reducer: {
      auth: authReducer,
      category: categoryReducer,
      course: courseReducer,
      lesson: lessonReducer,
      interesting: mainReducer,
      book: bookReducer,
      meeting: meetingSlice,
    },
  });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;