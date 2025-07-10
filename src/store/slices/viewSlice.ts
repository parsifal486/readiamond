import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ViewState } from '@sharedTypes/appGeneral';

const initialState = {currentView: 'reading' as ViewState};

const ViewSlice = createSlice({
  name: 'view',
  initialState,
  reducers: {
    setCurrentView: (state, action: PayloadAction<ViewState>) => {
      state.currentView = action.payload;
    }
  }
});

export const { setCurrentView } = ViewSlice.actions;
export default ViewSlice.reducer;
