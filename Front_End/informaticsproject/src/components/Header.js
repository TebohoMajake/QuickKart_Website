import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isManager, setIsManager] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const userId = localStorage.getItem("UserId");
    const userRole = localStorage.getItem("userType"); // Change this to lowercase

    // Log userRole to debug
    console.log("User Role:", userRole); // Debug to check the value of userRole
    console.log("User ID:", userId); // Debug to check if userId is set correctly

    if (userId) {
      setIsLoggedIn(true);
      setIsManager(userRole === "manager"); // Check if user is a Manager
    }
  }, []);

  return (
    <nav
      className="custom-navbar navbar navbar-expand-md navbar-dark bg-dark sticky-header"
      aria-label="Furni navigation bar"
    >
      <div className="container">
        <Link to="/">
          <a className="navbar-brand">
            Boost<span>.</span>
          </a>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarsFurni"
          aria-controls="navbarsFurni"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarsFurni">
          <ul className="custom-navbar-nav navbar-nav ms-auto mb-2 mb-md-0">
            <li className={`nav-item ${isActive("/") ? "active" : ""}`}>
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className={`nav-item ${isActive("/Product") ? "active" : ""}`}>
              <Link className="nav-link" to="/Product">
                Products
              </Link>
            </li>
            <li className={`nav-item ${isActive("/about") ? "active" : ""}`}>
              <Link className="nav-link" to="/about">
                About Us
              </Link>
            </li>
            <li
              className={`nav-item ${
                isActive("/RecipeSection") ? "active" : ""
              }`}
            >
              <Link className="nav-link" to="/RecipeSection">
                Recipes
              </Link>
            </li>
          </ul>

          <ul className="custom-navbar-cta navbar-nav mb-2 mb-md-0 ms-5">
            <li className="nav-item">
              {!isManager && (
                <Link className="nav-link" to="/ShoppingCart">
                  <img src="/images/cart.svg" alt="Cart Icon" />
                </Link>
              )}
            </li>

            <li className="nav-item">
              <div className="user-dropdown" onClick={toggleDropdown}>
                <img src="/images/user.svg" alt="User Icon" />
                <ul className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}>
                  {!isLoggedIn ? (
                    <>
                      <Link to="/Login">
                        <li>
                          Login
                        </li>
                      </Link>
                      <Link to="/Register">
                        <li>
                          Register
                        </li>
                      </Link>
                    </>
                  ) : (
                    <>
                      {isManager ? (
                        <>
                          <Link to="/ManagerDashboard">
                            <li>
                              Manager Dashboard
                            </li>
                          </Link>
                         
                        </>
                      ) : (
                        <>
                          <Link to="/Invoices">
                            <li>
                              My Invoices
                            </li>
                          </Link>
                        </>
                      )}
                      <Link to="/logout">
                        <li>
                          Logout
                        </li>
                      </Link>
                    </>
                  )}
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
