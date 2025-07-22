import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ViewState, LeftPanelState, MainPanelState } from '@sharedTypes/appGeneral';

const initialState = {
  currentView: 'reading' as ViewState,
  leftPanelState: 'file' as LeftPanelState,
  mainViewState: 'editing' as MainPanelState,
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
    },
    switchMainViewState: (state) => {
      state.mainViewState = state.mainViewState === 'editing' ? 'reading' : 'editing';
    }
  }
});

export const { setCurrentView, switchLeftPanelState, switchMainViewState } = ViewSlice.actions;
export default ViewSlice.reducer;
