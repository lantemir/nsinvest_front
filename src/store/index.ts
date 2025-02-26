import { configureStore } from "@reduxjs/toolkit";
import exampleReducer from "./exampleSlice";
// import userReducer from "./userSlice";


export const store = configureStore({
    reducer: {
      example: exampleReducer,
    //   user: userReducer,
    },
  });
  
  export type RootState = ReturnType<typeof store.getState>;
  export type AppDispatch = typeof store.dispatch;