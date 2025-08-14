import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  selectedWord: '',
  selectedSentence: '',
};

const ReadingSlice = createSlice({
  name: 'reading',
  initialState,
  reducers: {
    setSelectedWord: (state, action: PayloadAction<string>) => {
      state.selectedWord = action.payload;
    },
    setSelectedSentence: (state, action: PayloadAction<string>) => {
      state.selectedSentence = action.payload;
    },
  },
});

export const { setSelectedWord, setSelectedSentence } = ReadingSlice.actions;
export default ReadingSlice.reducer;
