import { createSlice } from "@reduxjs/toolkit";

const initialState={
    loaderCompleted:false,
}


const uiSlice=createSlice({
    name:"ui",
    initialState,
    reducers:{
        loaderFinished:(state)=>{
            state.loaderCompleted=true;

        },
        resetLoader:(state)=>{
            state.loaderCompleted=false;

        }
    }
})

export const {loaderFinished,resetLoader}=uiSlice.actions;
export default uiSlice.reducer