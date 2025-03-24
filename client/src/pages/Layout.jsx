import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="w-full h-auto overflow-y-auto overflow-x-hidden">
      {/* Navbar will be shown on all pages */}
      <Navbar />
      <Outlet /> {/* Ensures content changes without removing Navbar */}
    </div>
  );
};

export default Layout;
