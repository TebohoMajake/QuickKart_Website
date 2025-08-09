import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import "../styles/css/AddProduct.css"
import ConfirmationModal from "./ConfirmationModal";
import ManagerDashboardLayout from "./ManagerDashboardLayout";

function AddRecipe() {
    //const [loading, setLoading] = useState(true);
    //const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({});

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    const [formData, setFormData] = useState({
        RecipeName: "",
            RecipeDescription: "",
            RecipeIngredients: "",
            RecipeInstructions: "",
            RecipeImage: ""
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
    const { RecipeName, RecipeDescription, RecipeInstructions, RecipeIngredients, RecipeImage } = formData;
    const url = `http://localhost:58398/Service1.svc/AddRecipe?recipeName=${encodeURIComponent(RecipeName)}&recipeDescription=${encodeURIComponent(
        RecipeDescription
    )}&recipeInstructions=${encodeURIComponent(RecipeInstructions)}&recipeIngredients=${encodeURIComponent(
        RecipeIngredients
    )}&recipeImage=${encodeURIComponent(RecipeImage)}`;

    axios
      .get(url) // Send a GET request with the query parameters
      .then((response) => {
        setMessage("Changes Successfully Implemented");
        setFormData({
            RecipeName: "",
            RecipeDescription: "",
            RecipeIngredients: "",
            RecipeInstructions: "",
            RecipeImage: ""
        });

        navigate("/"); // Redirect to homepage after successful registration
      })
      .catch((error) => {
        console.error("Error while adding recipe:", error); // Log error to console
        setMessage("Recipe addition failed. Please try again."); // Set error message
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
      message: 'Are you sure you want to add this recipe?',
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
        {/* Start Hero Section
      <div className="hero">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-5">
              <div className="intro-excerpt">
                <h1>Add To Our Delicious, Healthy Recipes</h1>
              </div>
            </div>
           
          </div>
        </div>
      </div>
      End Hero Section */}

        <div className="ProductDescription">
        <div className="form-container">
        <h1>Recipe Information</h1>
        <form onSubmit={handleSubmitWithConfirmation}>
            <div className="form-group">
                <label>Name</label>
                <input 
                type="text" 
                name="RecipeName" 
                value={formData.RecipeName} 
                onChange={handleChange} 
                placeholder="Enter Recipe Name" 
                className="form-input"
                required/>
            </div>

            <div className="form-group">
                <label>Description</label>
                <textarea 
                name="RecipeDescription" 
                value={formData.RecipeDescription} 
                onChange={handleChange} 
                placeholder="Enter Recipe Description" 
                className="form-textarea"
                required/>
            </div>

            <div className="form-group">
                <label>Ingredients</label>
                <input 
                type="text" 
                name="RecipeIngredients" 
                value={formData.RecipeIngredients} 
                onChange={handleChange} 
                placeholder="Enter Recipe Ingredients" 
                className="form-input"
                required/>
            </div>

            <div className="form-group">
                <label>Instructions</label>
                <textarea 
                type="text" 
                name="RecipeInstructions" 
                value={formData.RecipeInstructions} 
                onChange={handleChange} 
                placeholder="Enter Recipe Preparation Instructions" 
                className="form-textarea"
                required/>
            </div>

            <div className="form-group">
                <label>Image URL</label>
                <input 
                type="text" 
                name="RecipeImage" 
                value={formData.RecipeImage} 
                onChange={handleChange} 
                placeholder="Enter Recipe Image URL" 
                className="form-input"
                required/>
            </div>

            <button 
            type="submit" 
            className="form-button"
            disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Add Recipe"}
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
        
    </ManagerDashboardLayout>
    
  )

};

export default AddRecipe;