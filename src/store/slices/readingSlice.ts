import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  selectedWord: '',
  selectedSentence: '',
  databaseVersion: 0, //database version, when the database version is changed（some data was added or deleted）, the database will be re-initialized
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
    triggerWordDatabaseUpdate: state => {
      state.databaseVersion += 1;
    },
  },
});

export const {
  setSelectedWord,
  setSelectedSentence,
  triggerWordDatabaseUpdate,
} = ReadingSlice.actions;
export default ReadingSlice.reducer;
