import { createSlice } from "@reduxjs/toolkit";

const readingLeftPanelSlice = createSlice({
  name: "readingLeftPanel",
  initialState: {
    leftPanelState: "file",
  },
  reducers: {
    switchLeftPanelState: (state) => {
      state.leftPanelState = state.leftPanelState === "dictinary" ? "file" : "dictinary";
    },
  },
});

export const { switchLeftPanelState } = readingLeftPanelSlice.actions;
export default readingLeftPanelSlice.reducer;
