import { Outlet } from "react-router-dom";
import ScrollToTop from "../component/common/ScrollToTop";
import Navbar from "../component/common/Navbar";
import Footer from "../component/common/Footer";

export const Layout = () => {
    return (
      <>
      <ScrollToTop/>
        <Navbar />
        <div className="pt-[80px]">
        <Outlet />
        </div>
        <Footer/>
              
      </>
    );
  };