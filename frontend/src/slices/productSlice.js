import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRequest } from "../utils/request";

const storedProducts = localStorage.getItem("products")
  ? JSON.parse(localStorage.getItem("products"))
  : [];

const storedLastUpdated = localStorage.getItem("productsLastUpdated") || null;
const storedCount = localStorage.getItem("productsCount")
  ? parseInt(localStorage.getItem("productsCount"), 10)
  : 0;

const saveProducts = (products, lastUpdated, count) => {
  localStorage.setItem("products", JSON.stringify(products));
  localStorage.setItem("productsLastUpdated", lastUpdated);
  localStorage.setItem("productsCount", count);
};

export const getProducts = createAsyncThunk(
  "products/getProducts",
  async ({ force = false } = {}, { getState, rejectWithValue }) => {
    try {
      const localLastUpdated = localStorage.getItem("productsLastUpdated");
      const localCount = localStorage.getItem("productsCount");

      if (!force && localLastUpdated && localCount) {
        const { last_updated, count } = await getRequest("products/last-updated/");

        if (last_updated === localLastUpdated && parseInt(localCount, 10) === count) {
          return getState().products.products;
        }
      }

      const products = await getRequest("products/");
      const { last_updated, count } = await getRequest("products/last-updated/");
      saveProducts(products, last_updated, count);

      return products;
    } catch (err) {
      return rejectWithValue(
        err.detail || "Failed to fetch products" 
      );
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: storedProducts,
    lastUpdated: storedLastUpdated,
    count: storedCount,
    loading: false,
    error: null,
  },
  reducers: {
    clearProducts: (state) => {
      state.products = [];
      state.lastUpdated = null;
      state.count = 0;
      localStorage.removeItem("products");
      localStorage.removeItem("productsLastUpdated");
      localStorage.removeItem("productsCount");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch products";
      });
  },
});

export const { clearProducts } = productSlice.actions;
export default productSlice.reducer;
