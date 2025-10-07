import { createSlice } from "@reduxjs/toolkit";

// Load wishlist from localStorage if exists
const storedWishlist = localStorage.getItem("wishlist")
  ? JSON.parse(localStorage.getItem("wishlist"))
  : [];

const saveWishlist = (wishlist) => {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    products: storedWishlist, // array of product objects or ids
  },
  reducers: {
    addToWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.products.find((p) => p.id === product.id);
      if (!exists) {
        state.products.push(product);
        saveWishlist(state.products);
      }
    },
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.products = state.products.filter((p) => p.id !== productId);
      saveWishlist(state.products);
    },
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.products.find((p) => p.id === product.id);
      if (exists) {
        state.products = state.products.filter((p) => p.id !== product.id);
      } else {
        state.products.push(product);
      }
      saveWishlist(state.products);
    },
    clearWishlist: (state) => {
      state.products = [];
      localStorage.removeItem("wishlist");
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
