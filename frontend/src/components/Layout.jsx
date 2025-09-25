import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getProducts } from "../slices/productSlice";
import { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  const dispatch = useDispatch();
  
    useEffect(() => {
      console.log("render... ");
      dispatch(getProducts());
    }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
