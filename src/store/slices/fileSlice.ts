import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { File } from '@sharedTypes/fileOperat';

const initialState = {
  currentFile: null as File | null,
  currentFileContent: null as string | null,
};

const FileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    setCurrentFile: (state, action: PayloadAction<File>) => {
      state.currentFile = action.payload;
    },
    setFileContent: (state, action: PayloadAction<string>) => {
      state.currentFileContent = action.payload;
    },
  },
});

export const { setCurrentFile, setFileContent } = FileSlice.actions;
export default FileSlice.reducer;
