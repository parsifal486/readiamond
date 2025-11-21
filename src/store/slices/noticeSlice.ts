import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  notices: [] as string[],
};

const NoticeSlice = createSlice({
  name: 'notice',
  initialState,
  reducers: {
    addNotice: (state, action: PayloadAction<string>) => {
      state.notices.push(action.payload);
    },
    removeNotice: (state, action: PayloadAction<string>) => {
      state.notices = state.notices.filter(notice => notice !== action.payload);
    },
  },
})

export const { addNotice, removeNotice } = NoticeSlice.actions;
export default NoticeSlice.reducer;