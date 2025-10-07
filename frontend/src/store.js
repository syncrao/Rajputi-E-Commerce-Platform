import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/authSlice";
import products from "./slices/productSlice";
import cart from "./slices/cartSlice"; 
import wishlist from "./slices/wishlistSlice"

const store = configureStore({
  reducer: {
    auth,
    products,
    cart,
    wishlist,
  },
});

store.subscribe(() => {
  console.log("Updated state:", store.getState());
});

export default store;
