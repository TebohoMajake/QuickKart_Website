import "./App.css";
import HomePage from "./components";
import About from "./components/about";
import Login from "./components/Login";
import Products from "./components/Product";
import Register from "./components/Register";
import RegisterManager from "./components/RegisterManager";
import RecipeSection from "./components/RecipeSection";
import Recipe from "./components/Recipe";
import ShoppingCart from "./components/ShoppingCart";
import ProductDetails from "./components/ProductDetails";
import Invoices from "./components/Invoices";
import Layout from "./components/Layout";
import EditProduct from "./components/EditProduct";
import EditRecipe from "./components/EditRecipe";
import ManagerDashboard from "./components/ManagerDashboard";
import SelectProductForEdit from "./components/SelectProductForEdit";
import EditRecipes from "./components/EditRecipes";

import AddProduct from "./components/AddProduct";
import AddRecipe from "./components/AddRecipe";
import Logout from "./components/Logout"; // Adjust the path as necessary

//import Banner from "./components/Banner";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import InvoiceDisplay from "./components/InvoiceDisplay";
import StockTable from "./components/StockTable";

//this is a function component
function App() {
  useEffect(() => {
    //Clear loacalStorage on Startup
    //localStorage.clear();
  });

  return (
    //Use route path to redirect
    // <Route path="/product/:id" component={ProductDetails} /> use route for dynamic routing
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/RegisterManager" element={<RegisterManager />} />
        <Route path="/RecipeSection" element={<RecipeSection />} />
        <Route path="/recipe/:recipeId" element={<Recipe />} />
        <Route path="/Product" element={<Products />} />
        {/* Route for the Product Details page */}
        <Route path="/product/:id" element={<ProductDetails />} />

        <Route path="/logout" element={<Logout />} />

        <Route path="/ShoppingCart" element={<ShoppingCart />} />
        <Route path="/Invoices" element={<Invoices />} />

        <Route
          path="/SelectProductForEdit"
          element={<SelectProductForEdit />}
        />
        <Route path="/EditProduct/:id" element={<EditProduct />} />

        <Route path="/EditRecipe/:id" element={<EditRecipe />} />
        <Route path="/ManagerDashboard" element={<ManagerDashboard />} />
        <Route path="/StockTable" element={<StockTable />} />
        <Route path="/AddProduct" element={<AddProduct />} />
        <Route path="/AddRecipe" element={<AddRecipe />} />
        <Route path="/EditRecipes" element={<EditRecipes />} />

        <Route path="/Invoice" element={<InvoiceDisplay />} />
      </Routes>
    </Router>
  );
}

export default App;
