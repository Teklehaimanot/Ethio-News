import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./auth/authSlice";

import { newsApi } from "../services";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [newsApi.reducerPath]: newsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(newsApi.middleware),
});

setupListeners(store.dispatch);
export default store;
