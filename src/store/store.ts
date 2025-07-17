import { configureStore } from '@reduxjs/toolkit';
import viewReducer from './slices/viewSlice';
import fileReducer from './slices/fileSlice';


export const store = configureStore({
  reducer: {
    view: viewReducer,
    file: fileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
