// Updated Footer Component with valid href values or buttons for placeholders
//I put these so that the code does not crash cause no urls exisyt currently
import React from "react";

// Footer functional component
export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="container relative">
     
        {/* Footer content section */}
        <div className="row g-5 mb-5">
          {/* About section */}
          <div className="col-lg-4">
            <div className="mb-4 footer-logo-wrap">
              <a href="/" className="footer-logo">
                Boost<span>.</span>
              </a>
            </div>
            <p className="mb-4">
              Your trusted source for premium protein shakes and wellness
              products. Discover our range and join our community today!
            </p>
           
          </div>

          {/* Footer links */}
          <div className="col-lg-8">
            <div className="row links-wrap">
              <div className="col-6 col-sm-6 col-md-3">
                <ul className="list-unstyled">
                  <li>
                    <a href="/about">About us</a>
                  </li>
                  <li>
                    <a href="/services">Products</a>
                  </li>
                  <li>
                    <a href="/blog">Recipes</a>
                  </li>
                  <li>
                    <a href="/contact">Contact us</a>
                  </li>
                </ul>
              </div>

              <div className="col-6 col-sm-6 col-md-3">
                <ul className="list-unstyled">
                  <li>
                    <a href="/support">Support</a>
                  </li>
                  
                </ul>
              </div>

              <div className="col-6 col-sm-6 col-md-3">
                <ul className="list-unstyled">
                  
                  <li>
                    <a href="/team">Our team</a>
                  </li>
                 
                  <li>
                    <a href="/privacy-policy">Privacy Policy</a>
                  </li>
                </ul>
              </div>

              <div className="col-6 col-sm-6 col-md-3"></div>
            </div>
          </div>
        </div>

        {/* Copyright section */}
        <div className="border-top copyright">
          <div className="row pt-4">
            <div className="col-lg-6">
              <p className="mb-2 text-center text-lg-start">
                Copyright &copy; {new Date().getFullYear()}. All Rights
                Reserved. — Designed with love by{" "}
                <a href="https://untree.co">Untree.co</a> Distributed By{" "}
                <a href="https://themewagon.com">ThemeWagon</a>
              </p>
            </div>

          
          </div>
        </div>
      </div>
    </footer>
  );
}
