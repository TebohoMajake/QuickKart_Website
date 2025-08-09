import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import "../styles/css/About.css";
import ConfirmationModal from "./ConfirmationModal";
import ManagerDashboardLayout from "./ManagerDashboardLayout";

function EditRecipe() {
    const { id } = useParams();
  const recipeId = parseInt(id, 10);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});

  const [formData, setFormData] = useState({
    RecipeName: "",
    RecipeDescription: "",
    RecipeIngredients: "",
    RecipeInstructions: "",
    RecipeImage: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  //  A State to display success or error messages
  const [message, setMessage] = useState("");

  //Hook to navigate to other routes
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
    const {RecipeName, RecipeDescription, RecipeIngredients, RecipeInstructions, RecipeImage } = formData;
    const url = `http://localhost:58398/Service1.svc/EditRecipe?recipeId=${encodeURIComponent(
      recipeId
    )}&recipeName=${encodeURIComponent(RecipeName)}&recipeDescription=${encodeURIComponent(
        RecipeDescription
    )}&recipeInstructions=${encodeURIComponent(
      RecipeInstructions
    )}&recipeIngredients=${encodeURIComponent(RecipeIngredients)}&recipeImage=${encodeURIComponent(
      RecipeImage
    )}`;

    axios
      .get(url) // Send a GET request with the query parameters
      .then((response) => {
        setMessage("Changes Successfully Implemented");

        navigate("/EditRecipes"); // Redirect to homepage after successful registration
      })
      .catch((error) => {
        console.error("Error while altering recipe:", error); // Log error to console
        setMessage("Recipe alteration failed. Please try again."); // Set error message
      })
      .finally(() => {
        setIsSubmitting(false); // Reset submitting state to false
      });
  };

  //Gets specific product for the page
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(
          `http://localhost:58398/Service1.svc/GetRecipe?recipeId=${recipeId}`
        ); // Fetch the recipe based on the recipeId
        setRecipe(response.data);
        const r = response.data;

        if(r) {
          setFormData({
            RecipeName: r.RecipeName,
            RecipeDescription: r.RecipeDescription,
            RecipeIngredients: r.RecipeIngredients,
            RecipeInstructions: r.RecipeInstructions,
            RecipeImage: r.RecipeImage
          });
        }
        setLoading(false);
        
      } catch (error) {
        console.error("Error fetching recipe:", error);
        setError("Recipe not found");
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  //logic for handling removal of a product
  const handleDeleteRecipe = async () => {
    try
    {
      const response = await axios.get(`http://localhost:58398/Service1.svc/DeleteRecipe?recipeId=${recipeId}`);

      if(response.status === 200)
      {
        alert('Recipe successfully removed.');
        navigate('/EditRecipes');
      }
      else
      {
        setError(`Failed to remove recipe: ${response.data.message}`);
      }
    }
    catch(err)
    {
      setError('An error occured while removing the recipe');
    }
  }

  //opens the confirmation pop up and assigns its contents values that apply to the button
  const openModalForAction = (action) => {
    if(action === 'remove')
    {
      setModalContent({
        title: 'Confirm Delete',
        message: 'Changes may be permanent. Proceed with this action?',
        confirmText: 'Delete',
        onConfirm: () => {
          handleDeleteRecipe();
          setIsModalOpen(false);
        }
      });
    }

    setIsModalOpen(true);
  };

  //Opens confirmation pop up upon form submission
  const handleSubmitWithConfirmation = (e) => {
    e.preventDefault();

    setModalContent({
      title: 'Confirm Edit',
      message: 'Are you sure you want to save these changes?',
      confirmText: 'Save Changes',
      onConfirm: () => {
        handleSubmit();
        setIsModalOpen(false);
      }
    });

    setIsModalOpen(true);
  }
  
  if (loading) return <div>Loading recipe...</div>;
  if (error) return <div>{error}</div>;
  if (!recipe) return <div>No recipe found</div>;

  return (
    <ManagerDashboardLayout>
      <div className="product-container">
        <div className="leftpart">
          <img src={recipe.RecipeImage} alt={recipe.RecipeName} />
        </div>
        <div className="ProductDescription">
        <h1 className="productname">Editing: {recipe.RecipeName}</h1>
            {/* Start of Form*/}
            <div className="Form">
                  <div className="Formcontainer">
                    <div className="row">
                      <div className="col-md-12 col-lg-3 mb-5 mb-lg-0">
                      

                        <form onSubmit={handleSubmitWithConfirmation} className="row g-3">
                          <div className="col-auto">
                          <label>Name</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder={"Name: " + recipe.RecipeName}
                              name="RecipeName"
                              value={formData.RecipeName}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="col-auto">
                          <label>Description</label>
                            <textarea
                              className="form-control"
                              placeholder={"Description: " + recipe.RecipeDescription}
                              name="RecipeDescription"
                              value={formData.RecipeDescription}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div className="col-auto">
                          <label>Ingredients</label>
                            <textarea
                              className="form-control"
                              placeholder={"Ingredients: " + recipe.RecipeIngredients}
                              name="RecipeIngredients"
                              value={formData.RecipeIngredients}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div className="col-auto">
                          <label>Instructions</label>
                            <textarea
                              type="text"
                              className="form-control"
                              placeholder={"Instructions: " + recipe.RecipeInstructions}
                              name="RecipeInstructions"
                              value={formData.RecipeInstructions}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div className="col-auto">
                            <label>Image URL</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder={"Recipe Image URL: " + recipe.RecipeImage}
                              name="RecipeImage"
                              value={formData.RecipeImage}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          
                            <button
                              type="submit"
                              className="button"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Submitting..." : "Confirm"}
                            </button>

                            <button onClick={(e) => {
                              e.preventDefault();
                              openModalForAction('remove');}
                              } 
                              className="delete-button">
                              Remove Recipe
                            </button>
                            
                        </form>
                        
                      </div>
                    </div>
                  </div>
                </div>
                {/* End Form */}

                {/* confirmation pop up window */}
                <ConfirmationModal 
                              isOpen={isModalOpen} 
                              onClose={() => setIsModalOpen(false)}
                              {...modalContent}
                              cancelText="Cancel"
                            />
        </div>
      </div>
    </ManagerDashboardLayout>
  );
}

export default EditRecipe;