import { createRoot } from "react-dom/client";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <>
    <Navbar />
    <div className="min-h-[80vh]  my-1 sm:mx-6 lg:mx-8 ">
        Website under Developing page Coming Soon. . .
    </div>
    <Footer />
  </>
);
