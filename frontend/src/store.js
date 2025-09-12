import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import products from "./slices/productSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    products,
  },
});

store.subscribe(() => {
  console.log("Updated state:", store.getState());
});

export default store;
