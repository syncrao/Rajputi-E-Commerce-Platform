import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import HomeScreen from "./screens/HomeScreen";
import RegisterScreen from "./screens/RegisterScreen";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomeScreen />} />
        <Route path="register" element={<RegisterScreen />} />
      </Route>
    </Routes>
  );
}
