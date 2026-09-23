import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  byId: {},
  allIds: [],
};

const listsSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {
    addList: (state, action) => {
      const { id, name, duplicateToggle } = action.payload;
      state.byId[id] = { id, name, duplicateToggle: !!duplicateToggle };
      state.allIds.push(id);
    },
    editList: (state, action) => {
      const { id, name, duplicateToggle } = action.payload;
      if (state.byId[id]) {
        state.byId[id].name = name;
        state.byId[id].duplicateToggle = !!duplicateToggle;
      }
    },
    deleteList: (state, action) => {
      const id = action.payload;
      delete state.byId[id];
      state.allIds = state.allIds.filter((listId) => listId !== id);
    },
    setLists: (state, action) => {
      return action.payload;
    },
  },
});

export const { addList, editList, deleteList, setLists } = listsSlice.actions;
export default listsSlice.reducer;
