import { configureStore } from '@reduxjs/toolkit';
import viewReducer from './slices/viewSlice';
import fileReducer from './slices/fileSlice';
import readingReducer from './slices/readingSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    view: viewReducer,
    file: fileReducer,
    reading: readingReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
