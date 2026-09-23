import { createSlice } from "@reduxjs/toolkit";



const themeSlice = createSlice({
    name: "theme",
    initialState: {
        dark: false,
    },
    reducers: {
        toggleTheme: (state) => {
            state.dark = !state.dark;
        },
        setTheme: (state, action) => {
            state.dark = action.payload;
        },
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;