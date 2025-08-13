import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  selectedWord: "",
};

const ReadingSlice = createSlice({
  name: "reading",
  initialState,
  reducers: {
    setSelectedWord: (state, action: PayloadAction<string>) => {
      state.selectedWord = action.payload;
    }
  },
});

export const { setSelectedWord } = ReadingSlice.actions;
export default ReadingSlice.reducer;