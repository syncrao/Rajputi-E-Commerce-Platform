import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/authSlice";
import products from "./slices/productSlice";
import cart from "./slices/cartSlice"; 
import address from "./slices/addressSlice"

const store = configureStore({
  reducer: {
    auth,
    products,
    cart,
    address,
  },
});

store.subscribe(() => {
  console.log("Updated state:", store.getState());
});

export default store;
