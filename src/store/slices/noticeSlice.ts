import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  notices: [] as {id: string, content: string}[],
};

const NoticeSlice = createSlice({
  name: 'notice',
  initialState,
  reducers: {
    addNotice: (state, action: PayloadAction<{id: string, content: string}>) => {
      state.notices.push({id: action.payload.id, content: action.payload.content});
    },
    removeNotice: (state, action: PayloadAction<{id: string}>) => {
      state.notices = state.notices.filter(notice => notice.id !== action.payload.id);
    },
  },
})

export const { addNotice, removeNotice } = NoticeSlice.actions;
export default NoticeSlice.reducer;