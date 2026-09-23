import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  globalSearchQuery: "",
  listSearchQuery: "",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setGlobalSearchQuery: (state, action) => {
      state.globalSearchQuery = action.payload;
    },
    setListSearchQuery: (state, action) => {
      state.listSearchQuery = action.payload;
    },
  },
});

export const { setGlobalSearchQuery, setListSearchQuery } = searchSlice.actions;
export default searchSlice.reducer;
