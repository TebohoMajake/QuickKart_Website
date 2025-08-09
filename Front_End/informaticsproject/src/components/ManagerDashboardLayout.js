import React from "react";
import "../styles/css/dashboard.css";

export default function ManagerDashboardLayout({ children }) {
    return (
        <div className="dashboard-container">
            <nav className="sidebar">
                <a className="navbar-brand" href="/">Boost<span>.</span></a>
                <ul>
                    <li><a href="/ManagerDashboard">View Reports</a></li>
                    <li><a href="/RegisterManager">Register Manager</a></li>
                    <li><a href="/StockTable">Product Stock</a></li>
                    <li><a href="/AddProduct">Add Product</a></li>
                    <li><a href="/SelectProductForEdit">Edit Product</a></li>
                    <li><a href="/AddRecipe">Add Recipe</a></li>
                    <li><a href="/EditRecipes">Edit Recipe</a></li>
                </ul>
            </nav>

            <main className="content">{children}</main>

        </div>
    );
  }