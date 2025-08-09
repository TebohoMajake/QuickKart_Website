import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import ManagerDashboardLayout from "./ManagerDashboardLayout";

const EditRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all recipes from the WCF service
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:58398/Service1.svc/GetRecipes"
        );
        setRecipes(response.data); // Set the fetched recipes
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setError("Failed to fetch recipes.");
      }
    };

    fetchRecipes();
  }, []);

  if (error) return <div>{error}</div>;

  return (
    <ManagerDashboardLayout>
      <h1>Edit Recipes</h1>
      <table className="invoices-table">
        <thead>
          <tr>
            <th>Recipe ID</th>
            <th>Recipe Name</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((recipe) => (
            <tr key={recipe.RecipeId}>
              <td>{recipe.RecipeId}</td>
              <td>{recipe.RecipeName}</td>
              <td>
                <Link to={`/EditRecipe/${recipe.RecipeId}`}>
                  <button className="btn btn-black btn-sm">Edit</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ManagerDashboardLayout>
  );
};

export default EditRecipes;
