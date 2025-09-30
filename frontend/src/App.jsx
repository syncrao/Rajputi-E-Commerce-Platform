import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import HomeScreen from "./screens/HomeScreen";

import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import VerifyOTP from "./screens/VerifyOTP";
import ResetPassword from "./screens/ResetPassword";


import ProfileScreen from "./screens/ProfileScreen";
import EditProfileScreen from "./screens/EditProfileScreen";

import ProductsScreen from "./screens/ProductsScreen";
import ProductScreen from "./screens/ProductScreen";

import CartScreen from "./screens/CartScreen";
import AddressScreen from "./screens/AddressScreen";
import CheckoutScreen from "./screens/CheckoutScreen";
import PaymentScreen from "./screens/PaymentScreen";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomeScreen />} />
        <Route path="register" element={<RegisterScreen />} />
        <Route path="login" element={<LoginScreen />} />
        <Route path="verifyOTP" element={<VerifyOTP />} />
        <Route path="reset-password" element={<ResetPassword />} />

        <Route path="profile" element={<ProfileScreen />} />
        <Route path="editProfile" element={<EditProfileScreen />} />

        <Route path="products" element={<ProductsScreen />} />
        <Route path="product/:id" element={<ProductScreen />} />

        <Route path="cart" element={<CartScreen />} />
        <Route path="address" element={<AddressScreen />} />
        <Route path="checkout" element={<CheckoutScreen />} />
        <Route path="payment/:id" element={<PaymentScreen />} />
      </Route>
    </Routes>
  );
}
