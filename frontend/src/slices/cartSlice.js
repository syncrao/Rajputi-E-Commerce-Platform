import { createSlice } from "@reduxjs/toolkit";

const storedCart = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : [];

const initialState = {
  cartItems: storedCart, 
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload; 
      const existItem = state.cartItems.find(
        (x) =>
          x.product.id === item.product.id &&
          x.selectedSize === item.selectedSize &&
          x.selectedColor === item.selectedColor
      );

      if (existItem) {
        existItem.quantity += item.quantity;
      } else {
        state.cartItems.push(item);
      }

      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },

    removeFromCart: (state, action) => {
      const { productId, selectedSize, selectedColor } = action.payload;
      state.cartItems = state.cartItems.filter(
        (x) =>
          !(
            x.product.id === productId &&
            x.selectedSize === selectedSize &&
            x.selectedColor === selectedColor
          )
      );
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },

    updateQuantity: (state, action) => {
      const { productId, selectedSize, selectedColor, quantity } = action.payload;
      const item = state.cartItems.find(
        (x) =>
          x.product.id === productId &&
          x.selectedSize === selectedSize &&
          x.selectedColor === selectedColor
      );
      if (item) {
        item.quantity = quantity;
      }
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },

    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cart");
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
