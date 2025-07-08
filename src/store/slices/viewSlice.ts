import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ViewState } from '@sharedTypes/appUi';

const initialState = {currentView: 'reading' as ViewState};

const ViewSlice = createSlice({
  name: 'view',
  initialState,
  reducers: {
    setViewState: (state, action: PayloadAction<ViewState>) => {
      state.currentView = action.payload;
    }
  }
});

export const { setViewState } = ViewSlice.actions;
export default ViewSlice.reducer;
