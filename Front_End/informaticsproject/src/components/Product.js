import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import axios from "axios";
import "./ProductCarousel.css"; // Import the CSS for the carousel
import {
  handleAddToCart,
  handleQuantityChange,
  isInCart,
  getProductQuantity,
} from "../utils";
import Breadcrumb from "./Breadcrumb";
import { FiShoppingCart } from "react-icons/fi";

// Individual Product Component for Carousel
const Product = ({
  image,
  name,
  price,
  originalPrice,
  discount,
  rating,
  reviews,
  buttonText,
  isManager, // New prop for user type check
}) => {
  return (
    <div className="product">
      {discount && <div className="discount-tag">{discount} OFF</div>}
      <img src={image} alt={name} className="product-image" />
      <div className="product-details">
        <h3>{name}</h3>
        <div className="product-price">
          <span>R {price}</span>
          {originalPrice && (
            <span className="original-price">R {originalPrice}</span>
          )}
        </div>
        <div className="product-rating">
          <span>
            ⭐ {rating} ({reviews})
          </span>
        </div>
         {/* A dd to Cart Button */}
        <button className="product-button" disabled={isManager}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

// Product Carousel Component
const ProductCarousel = ({ products }) => {
  return (
    <div className="product-carousel">
      <div className="carousel-container">
        {products.map((product, index) => (
          <Product key={index} {...product} />
        ))}
      </div>
    </div>
  );
};

// Main Products Page Component
export default function Products() {
  const [products, setProducts] = useState([]); // Store the fetched products
  const [cartStatus, setCartStatus] = useState({});
  const [carouselProducts, setCarouselProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(products); // Store the products arfter applying the filter
  const [filter, setFilter] = useState("all"); // Store the current filter selection
  const [categoryId, setCategoryId] = useState("all");
  const [cartProducts, setCartProducts] = useState([]);

  const userType = localStorage.getItem("userType"); // Fetch user tyype from local stornage
  const isManager = userType === "manager"; // Check if the user is a manager hre so change accorsingly

  // Fetch products data from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let response;

        //Fetch the products based on the category
        if (categoryId != "all") {
          //If a specific actegory is called them ,call that specific method i have
          response = await axios.get(
            `http://localhost:58398/Service1.svc/GetProductsInCategory?categoryId=${categoryId}`
          );
        } else {
          response = await axios.get(
            "http://localhost:58398/Service1.svc/GetProducts"
          );
        }

        setProducts(response.data); //Set the fetched products
        setCarouselProducts(response.data.slice(0, 5)); // Taking the first 5 products for the carousel
        setFilteredProducts(response.data); //This is for the filtered producted but at fisrt hand we show all products
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  // Apply the selected filter whever the filter or products change
  useEffect(() => {
    //create a new array and populate with the previous one
    let sortedProducts = [...products]; //Og products rray

    //Sorting according to filter
    if (filter === "lowToHigh") {
      sortedProducts.sort((a, b) => a.Price - b.Price);
    } else if (filter === "highToLow") {
      sortedProducts.sort((a, b) => b.Price - a.Price);
    } else if (filter === "rating") {
      sortedProducts.sort((a, b) => b.rating - a.rating);
    } else if (filter === "category") {
      sortedProducts.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(sortedProducts); //update the state

    const userId = localStorage.getItem("UserId");

    if (userId) {
      // User is logged in, fetch their cart from the WCF service
      axios
        .get(
          `http://localhost:58398/Service1.svc/GetProductsInCart?customerId=${userId}`
        )
        .then((response) => {
          setCartProducts(response.data); // Assuming response contains an array of product objects in the cart
        })
        .catch((error) => {
          console.error("Error fetching cart products:", error);
        });
    } else {
      // User is not logged in, check the cart in localStorage
      let cart = localStorage.getItem("cart");
      let cartArray = cart ? JSON.parse(cart) : [];
      setCartProducts(cartArray);
    }
  }, [filter, products]); // Re-run the effect whenever  the filter or products change

  //Function to handle the filrting change
  const handleFilterChange = (e) => {
    const value = e.target.value;

    //Determine if its category or sorting
    if (value === "lowToHigh" || value === "highToLow" || value === "rating") {
      setFilter(value);
    } else {
      setCategoryId(value);
    }
  };

  const handleCategoryChange = (e) => {
    setCategoryId(e.target.value);
  };
  // Display a loading message or error
  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  //  breadcrumb items based on selected category
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    {
      name: categoryId !== "all" ? `Category: ${categoryId}` : "All Products",
      url: "",
    },
  ];

  return (
    <Layout>
      <div className="communicationBanner">
        Spend over R2000 and get 15% OFF
      </div>
      <div className="product-section">
      
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-lg-3 mb-5 mb-lg-0">
              <h2 className="mb-4 section-title1">Our Products</h2>
              <p>
                Discover our range of products designed to support your fitness
                journey.
              </p>
            </div>

            <div className="col-md-12 col-lg-9">
              {/* Filter Dropdown */}
              <div className="mb-4">
                <select onChange={handleFilterChange} className="form-select">
                  <option value="all">All Products</option>
                  <option value="lowToHigh">Price: Low to High</option>
                  <option value="highToLow">Price: High to Low</option>
                  <option value="rating">Highest Rating</option>
                  <option value="1">Protein Powders</option>
                  <option value="3">Shakers</option>
                  <option value="2">Energy Bars</option>{" "}
                  <option value="4">measuring spoons</option>
                  <option value="5">Supplemental Products</option>
                </select>
              </div>
            </div>

            {/* Main Products Section */}
            {/* Here i replaced the normal  products with the filterd version of the results */}

            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  className="col-12 col-md-4 col-lg-3 mb-5 mb-md-0"
                  key={product.ProductId}
                >
                  <div className="indiProduct">
                    <Link
                      className="product-item"
                      to={`/product/${product.ProductId}`}
                    >
                      <img
                        src={product.ImageURL}
                        className="img-fluid product-thumbnail"
                        alt={product.ProdName}
                      />
                      <div className="prodDetails">
                        <h3 className="product-title">{product.ProdName}</h3>
                        <strong className="product-price">
                          R{product.Price.toFixed(2)}
                        </strong>
                      </div>
                    </Link>

                    <div className="d-flex flex-column align-items-start mt-2">
                      {/* Add to Cart Button */}
                      <div className="ml-3" style={{ width: "100%" }}>
                        {isInCart(product.ProductId, cartProducts) ? (
                          <button className="btnpAddToCart" disabled>
                            <FiShoppingCart /> Added
                          </button>
                        ) : (
                          <button
                            className="btnAddToCart"
                            onClick={() => {
                              if (!isManager) {
                                handleAddToCart(
                                  product.ProductId,
                                  cartProducts,
                                  setCartProducts
                                );
                              }
                            }}
                            disabled={isManager} // Disable button if the user is a manager
                          >
                            <FiShoppingCart /> Add to Cart
                          </button>
                        )}
                      </div>
                      {/* Quantity Controller */}
                      <div className="pquantity-controller">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              product.ProductId,
                              product.NumInStock,
                              -1,
                              cartProducts,
                              setCartProducts
                            )
                          }
                          disabled={
                            getProductQuantity(
                              product.ProductId,
                              cartProducts
                            ) === 1
                          }
                        >
                          −
                        </button>
                        <span className="mx-2">
                          {getProductQuantity(product.ProductId, cartProducts)}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              product.ProductId,
                              product.NumInStock,
                              1,
                              cartProducts,
                              setCartProducts
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No products available</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
