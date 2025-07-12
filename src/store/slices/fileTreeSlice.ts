import { createSlice } from "@reduxjs/toolkit";

const fileTreeSlice = createSlice({
  name: "fileTree",
  initialState: { 
    fileTree: [],
  },
  reducers: {
    setFileTree: (state, action) => {
      state.fileTree = action.payload;
    },
  },
});

export const { setFileTree } = fileTreeSlice.actions;
export default fileTreeSlice.reducer;
