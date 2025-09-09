import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] sm:mx-6 lg:mx-8 ">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
