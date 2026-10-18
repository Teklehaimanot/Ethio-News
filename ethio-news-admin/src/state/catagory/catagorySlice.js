import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  catagory: "Dashboard",
};
const catagorySlcie = createSlice({
  name: "catagory",
  initialState,
  reducers: {
    setCatagory: (state, action) => {
      state.catagory = action.payload.catagory;
    },
  },
});
export const { setCatagory } = catagorySlcie.actions;
export default catagorySlcie.reducer;
