import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import "../styles/css/AddProduct.css"
import ConfirmationModal from "./ConfirmationModal";
import ManagerDashboardLayout from "./ManagerDashboardLayout";

function AddProduct() {
    //const [loading, setLoading] = useState(true);
    //const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({});

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    const [formData, setFormData] = useState({
        ProductName: "",
        ProductPrice: "",
        ProductDescription: "",
        ProductIngredients: "",
        ProductDirections: "",
        ProductStorage: "",
        ProductStock: "",
        ImageURL: ""
    });

    const navigate = useNavigate();

  // triggered whenever an input field changes
  const handleChange = (event) => {
    // Get the name of the input field
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    // Update the form data: keep everything the same, but update the one field the user is typing in
    setFormData((previousData) => ({
      ...previousData,
      [fieldName]: fieldValue, // Update only the field that the user is currently editing
    }));
  };

  //Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true); //Now set it to true to disable the button

    //Send the form data to the server
    // Construct the URL with query parameters
    const { ProductName, ProductPrice, ProductDescription, ProductIngredients, ProductDirections, ProductStorage, ProductStock, ImageURL } = formData;
    const url = `http://localhost:58398/Service1.svc/AddProduct?prodName=${encodeURIComponent(ProductName)}&price=${encodeURIComponent(
      ProductPrice
    )}&prodDescription=${encodeURIComponent(ProductDescription)}&prodIngredients=${encodeURIComponent(
      ProductIngredients
    )}&prodDirections=${encodeURIComponent(ProductDirections)}&storage=${encodeURIComponent(
      ProductStorage
    )}&numInStock=${encodeURIComponent(ProductStock)}&imageURL=${encodeURIComponent(
      ImageURL
    )}`;

    axios
      .get(url) // Send a GET request with the query parameters
      .then((response) => {
        setMessage("Changes Successfully Implemented");
        setFormData({
            ProductName: "",
            ProductPrice: "",
            ProductDescription: "",
            ProductIngredients: "",
            ProductDirections: "",
            ProductStorage: "",
            ProductStock: "",
            ImageURL: ""
        });

        navigate("/"); // Redirect to homepage after successful registration
      })
      .catch((error) => {
        console.error("Error while adding product:", error); // Log error to console
        setMessage("Product addition failed. Please try again."); // Set error message
      })
      .finally(() => {
        setIsSubmitting(false); // Reset submitting state to false
      });
  };

  //Opens confirmation pop up upon form submission
  const handleSubmitWithConfirmation = (e) => {
    e.preventDefault();

    setModalContent({
      title: 'Confirm Addition',
      message: 'Are you sure you want to add this product?',
      confirmText: 'Proceed',
      onConfirm: () => {
        handleSubmit();
        setIsModalOpen(false);
      }
    });

    setIsModalOpen(true);
  }

  return(
    <ManagerDashboardLayout>
      <div className="content">
      {/* 
          
      <div className="hero">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-5">
              <div className="intro-excerpt">
                <h1>Add To Our Diverse Product Range</h1>
              </div>
            </div>
           
          </div>
        </div>
      </div>
      
      */}

        <div className="ProductDescription">
        <div className="form-container">
        <h1>Product Information</h1>
        <form onSubmit={handleSubmitWithConfirmation}>
            <div className="form-group">
                <label>Name</label>
                <input 
                type="text" 
                name="ProductName" 
                value={formData.ProductName} 
                onChange={handleChange} 
                placeholder="Enter Name" 
                className="form-input"
                required/>
            </div>

            <div className="form-group">
                <label>Price</label>
                <input 
                type="text" 
                name="ProductPrice" 
                value={formData.ProductPrice} 
                onChange={handleChange} 
                placeholder="Enter Price" 
                className="form-input"
                required/>
            </div>

            <div className="form-group">
                <label>Description</label>
                <textarea 
                name="ProductDescription" 
                value={formData.ProductDescription} 
                onChange={handleChange} 
                placeholder="Enter Description" 
                className="form-textarea"
                required/>
            </div>

            <div className="form-group">
                <label>Ingredients</label>
                <input 
                type="text" 
                name="ProductIngredients" 
                value={formData.ProductIngredients} 
                onChange={handleChange} 
                placeholder="Enter Ingredients" 
                className="form-input"
                required/>
            </div>

            <div className="form-group">
                <label>Directions</label>
                <input 
                type="text" 
                name="ProductDirections" 
                value={formData.ProductDirections} 
                onChange={handleChange} 
                placeholder="Enter Use Direction" 
                className="form-input"
                required/>
            </div>

            <div className="form-group">
                <label>Storage</label>
                <input 
                type="text" 
                name="ProductStorage" 
                value={formData.ProductStorage} 
                onChange={handleChange} 
                placeholder="Enter Storage Instructions" 
                className="form-input"
                required/>
            </div>

            <div className="form-group">
                <label>Stock</label>
                <input 
                type="text" 
                name="ProductStock" 
                value={formData.ProductStock} 
                onChange={handleChange} 
                placeholder="Enter Quantity In Stock" 
                className="form-input"
                required/>
            </div>

            <div className="form-group">
                <label>Image URL</label>
                <input 
                type="text" 
                name="ImageURL" 
                value={formData.ImageURL} 
                onChange={handleChange} 
                placeholder="Enter Product Image URL" 
                className="form-input"
                required/>
            </div>

            <button 
            type="submit" 
            className="form-button"
            disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Add Product"}
            </button>
        </form>
        <ConfirmationModal 
                              isOpen={isModalOpen} 
                              onClose={() => setIsModalOpen(false)}
                              {...modalContent}
                              cancelText="Cancel"
                            />
    </div>
        </div>

      </div>
        
    </ManagerDashboardLayout>
    
  )

};

export default AddProduct;