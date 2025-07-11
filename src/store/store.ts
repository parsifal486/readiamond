import { configureStore } from '@reduxjs/toolkit';
import viewReducer from './slices/viewSlice';
import readingLeftPanelReducer from './slices/readingLefPanel';

export const store = configureStore({
  reducer: {
    view: viewReducer,
    readingLeftPanel: readingLeftPanelReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
