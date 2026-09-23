import { createSlice } from "@reduxjs/toolkit";
import { deleteList } from "./listsSlice";

const initialState = {
  byId: {},
  allIds: [],
};

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { id, listId, name, quantity, unit, isPurchased, priceSources } = action.payload;
      state.byId[id] = {
        id,
        listId,
        name,
        quantity: Number(quantity) || 1,
        unit: unit || "piece",
        isPurchased: !!isPurchased,
        priceSources: priceSources || [],
      };
      state.allIds.push(id);
    },
    editItem: (state, action) => {
      const { id, name, quantity, unit, priceSources } = action.payload;
      if (state.byId[id]) {
        state.byId[id].name = name;
        state.byId[id].quantity = Number(quantity) || 1;
        state.byId[id].unit = unit || "piece";
        state.byId[id].priceSources = priceSources || [];
      }
    },
    toggleItemPurchased: (state, action) => {
      const id = action.payload;
      if (state.byId[id]) {
        state.byId[id].isPurchased = !state.byId[id].isPurchased;
      }
    },
    deleteItem: (state, action) => {
      const id = action.payload;
      delete state.byId[id];
      state.allIds = state.allIds.filter((itemId) => itemId !== id);
    },
    setItems: (state, action) => {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(deleteList, (state, action) => {
      const listId = action.payload;
      const idsToRemove = [];
      for (const id of state.allIds) {
        if (state.byId[id] && state.byId[id].listId === listId) {
          idsToRemove.push(id);
        }
      }
      for (const id of idsToRemove) {
        delete state.byId[id];
      }
      state.allIds = state.allIds.filter((id) => !idsToRemove.includes(id));
    });
  },
});

export const { addItem, editItem, toggleItemPurchased, deleteItem, setItems } = itemsSlice.actions;
export default itemsSlice.reducer;
