import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="bg-rajputi-ivory min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Page content */}
      <main className="flex-1 min-h-[60vh] px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
