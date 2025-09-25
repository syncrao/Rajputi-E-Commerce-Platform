import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/authSlice";
import products from "./slices/productSlice";
import cart from "./slices/cartSlice"; 

const store = configureStore({
  reducer: {
    auth,
    products,
    cart,
  },
});

store.subscribe(() => {
  console.log("Updated state:", store.getState());
});

export default store;
