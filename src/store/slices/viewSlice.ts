import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ViewState, LeftPanelState } from '@sharedTypes/appGeneral';

const initialState = {currentView: 'reading' as ViewState,
  leftPanelState: 'dictinary' as LeftPanelState,
};

const ViewSlice = createSlice({
  name: 'view',
  initialState,
  reducers: {
    setCurrentView: (state, action: PayloadAction<ViewState>) => {
      state.currentView = action.payload;
    },
    switchLeftPanelState: (state) => {
      state.leftPanelState = state.leftPanelState === 'dictinary' ? 'file' : 'dictinary';
    }
  }
});

export const { setCurrentView, switchLeftPanelState } = ViewSlice.actions;
export default ViewSlice.reducer;
