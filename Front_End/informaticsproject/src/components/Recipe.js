// Recipe.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Layout from "./Layout";
import "../styles/AboutEachRecipe.css";
import Breadcrumb from './Breadcrumb';

const FeaturedProducts = ( ) => {
  const { recipeId } = useParams();
  const [products, setProducts] = useState([]); 
  const [ setRecipe] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
//get featured products
useEffect(() => {
  const fetchFeaturedProduct = async () => {
    try {
      const response = await axios.get(
        `http://localhost:58398/Service1.svc/GetProductsInRecipe?recipeId=${recipeId}` // Fetch the Featured product based on the recipeId
      );
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching feature:", error);
      setError("feature not found");
      setLoading(false);
    }
  };
  fetchFeaturedProduct();
  
}, [recipeId]);


  return (
    <div className="featured-products">
      <div className="featured-products-list">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.ProductId} className="featured-product-card">
              <div className="prodDetails">
                <h3 className="product-title">{product.ProdName}</h3>
              </div>
              <div>
                <img
                  className="prodImage"
                  src={`/${product.ImageURL}`}
                  alt={product.ProdName}
                />
              </div>
              <Link
                className="product-item"
                to={`/product/${product.ProductId}`}
              >
                <p className="order">ORDER NOW</p>
              </Link>
            </div>
          ))
        ) : (
          <p>No featured products found.</p>
        )}
      </div>
    </div>
  );
};
export default function Recipe(){
  const { recipeId } = useParams(); // Get the recipeId from the URL
  const [recipe, setRecipe] = useState(null); // State to hold the recipe
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(
          `http://localhost:58398/Service1.svc/GetRecipe?recipeId=${recipeId}` // Fetch the recipe based on the recipeId
        );
        setRecipe(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recipe:", error);
        setError("Recipe not found");
        setLoading(false);
      }
    };

    fetchRecipe(); // Fetch the recipe when the component mounts
  }, [recipeId]);

 

  if (loading) return <div>Loading recipe...</div>;
  if (error) return <div>{error}</div>;
  if (!recipe) return <div>No recipe found</div>; // Handle case when recipe is not found

  // Dynamically generate the recipe name for breadcrumbs
  //const recipeName = recipe.RecipeName.replace(/\s+/g, '-').toLowerCase(); // Convert to URL-friendly format
  const breadcrumbItems = [
    { name: ' Home ', url: '/' },
    { name: ' Recipes ', url: '/RecipeSection' },
    { name: recipe.RecipeName, url: '' } // Use the actual recipe name
  ];

  return (
    <Layout>
      <div className="breadCrumbItems">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <div className="recipe-page">
        <div className="recipe-content">
          {/* Left Side: Recipe Image and Name */}
          <div className="leftpart">
            <h1 className="recipe-name">{recipe.RecipeName}</h1>
            <img
              className="recipe-image"
              src={recipe.RecipeImage}
              alt={recipe.RecipeName}
            />
          </div>

          {/* Right Side: Ingredients and Instructions */}
          <div className="rightpart">
            <div className="ingredients">
              <h2>Ingredients</h2>
              <p>{recipe.RecipeIngredients}</p>
            </div>
            <div className="directions">
              <h2>Instructions</h2>
              <p>{recipe.RecipeInstructions}</p>
            </div>

            <div className="Featured-product">
              <div className="featured-img">
                <h1>
                  <b>Featured product</b>
                </h1>
                {/* Render the featured products component */}
                <FeaturedProducts recipeId={recipeId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

