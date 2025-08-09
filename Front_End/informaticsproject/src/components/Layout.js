import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../styles/css/bootstrap.min.css";
import "../styles/css/register.css";
import "../styles/css/style.css";
import "../styles/css/tiny-slider.css";


export default function Layout({ children }) {
  return (
    <div>
      <Header />
      
      <main>{children}</main>
      <Footer />
    </div>
  );
}
