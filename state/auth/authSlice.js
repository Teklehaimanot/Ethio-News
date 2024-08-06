import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  token: null,
  isAuthenticated: false,
  loading: true,
  user: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
