import React, { useEffect, useState } from "react";
import Layout from "./Layout.js";
import axios from "axios";
import { Link } from "react-router-dom";

export default function RecipeSection() {
  //Create states  to store stuff
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState([]);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCustomer, setIsCustomer] = useState(false);


  useEffect(() => {
    const userId = localStorage.getItem("UserId");
    const userRole = localStorage.getItem("userType");

    if (userId) {
      setIsLoggedIn(true);
      setIsCustomer(userRole === "Customer"); // Check if user is a Customer
    }
  }, []);

  //Fecth the recipes from the APi
  useEffect(() => {
    const fetchRecipes = async () => {
      let fitnessId = 0;

      try {

        if (isCustomer) {
          // Fetch fitness ID only if the user is a customer
          const fitnessResponse = await axios.get(
            `http://localhost:58398/Service1.svc/GetFitnessGoalId?cusId=${localStorage.getItem("UserId")}`
          );
          fitnessId = fitnessResponse.data; // Store the fetched fitnessId
        }

        const apiUrl = isCustomer 
          ? `http://localhost:58398/Service1.svc/GetRecipesInGoal?fitnessGoalId=${fitnessId}`  // Use goal-specific endpoint for customers
          : `http://localhost:58398/Service1.svc/GetRecipes`;      // General recipes for other users

        const response = await axios.get(
          apiUrl
        );
        setRecipes(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recipes : ", error);
        setError("Failed to Fetch recipes ");
        setLoading(false);
      }
    };

    fetchRecipes(); //Fecth he recipe when the compnent compiles
  }, [isCustomer]);

  // Display loading message or error
  if (loading) return <div>Loading recipes...</div>;
  if (error) return <div>{error}</div>;

  /*const recipes = [
    {
      id: 1,
      title: "Vanilla Protein Shake",
      description:
        "Vanilla protein shake recipe by Meg Silsby. This recipe is refined sugar-free, can be made gluten-free and...",
      imageUrl: "../images/Pancake-Recipe-2-1200.jpg",
      link: "#",
    },
    {
      id: 2,
      title: "Vanilla Protein Pancakes",
      description:
        "Vanilla protein pancake recipe. Refined sugar-free; can be made gluten-free and vegan with the...",
      imageUrl: "../images/Vanilla-Protein-Shake.jpg",
      link: "#",
    },
    {
      id: 3,
      title: "Vanilla Protein Chia Pudding",
      description:
        "Vanilla protein chia pudding recipe. Gluten-free; refined sugar-free; dairy-free & vegan...",
      imageUrl: "../images/chocShake.jpg",
      link: "#",
    },
  ];

  */

  return (
    <Layout>
      <h1 className="recipe-heading">R E C I P E S</h1>
      <div className="recipe-section">
        <div className="recipe-container">
          {recipes.map((recipe) => (
            <div className="recipe-card" key={recipe.RecipeId}>
              <img
                src={recipe.RecipeImage}
                alt={recipe.RecipeName}
                className="recipe-image"
              />
              <h3>{recipe.RecipeName}</h3>
              <p>{recipe.RecipeDescription}</p>
              {/*Redirection to more info about each recipe */}
              <Link to={`/recipe/${recipe.RecipeId}`} className="read-more">
                Read more
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
