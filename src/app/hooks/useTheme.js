"use client";

import { useDispatch, useSelector } from "react-redux";
import { setTheme, toggleTheme } from "@/app/features/themeSlice"


export const useTheme = () => {
    const dark = useSelector((state) => state.theme.dark)
    const dispatch = useDispatch()

    return {
        dark,
        toggleTheme: () => dispatch(toggleTheme()),
        setTheme: (value) => dispatch(setTheme(value))
    }


}  