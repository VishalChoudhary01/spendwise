import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  globalDuplicateToggle: false,
  theme: "light",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleGlobalDuplicate: (state) => {
      state.globalDuplicateToggle = !state.globalDuplicateToggle;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setSettings: (state, action) => {
      return action.payload;
    },
  },
});

export const { toggleGlobalDuplicate, setTheme, setSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
