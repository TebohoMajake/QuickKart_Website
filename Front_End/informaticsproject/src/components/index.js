import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import axios from "axios";
import { handleAddToCart, handleQuantityChange, isInCart, getProductQuantity, mergeLocalCartWithServerCart } from '../utils';

export default function HomePage() {
  const [cartStatus, setCartStatus] = useState({});
  const [products, setProducts] = useState([]);
  const [heroImage, setHeroImage] = useState("");
  const [cartProducts, setCartProducts] = useState([]);



  const userType = localStorage.getItem("userType"); // Get the userType from localStorage
  const isaManager = userType === "manager";

  // Fetch products data from API
  useEffect(() => {
    axios
      .get("http://localhost:58398/Service1.svc/GetProducts")
      .then((response) => {
        setProducts(response.data);

        // Set the hero image based on the first product
        if (response.data.length > 0) {
          const FamousProduct = response.data[0].ImageURL;
          setHeroImage(FamousProduct);
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });

    const userId = localStorage.getItem("UserId");

    if (userId) {
      //Merge cart
      mergeLocalCartWithServerCart(setCartProducts);

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
  }, []);

 



  // Filter products by their IDs for different categories
  const proteinShakes = products.filter(
    (product) => product.ProductId >= 1 && product.ProductId <= 3
  );
  const energyBars = products.filter(
    (product) => product.ProductId >= 4 && product.ProductId <= 8
  );
  const Shakers = products.filter(
    (product) => product.ProductId >= 9 && product.ProductId <= 11
  );

  return (
    <Layout>
      {/* Start Hero Section */}
      <div className="hero">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-5">
              <div className="intro-excerpt">
                <h1>
                  Boost your Fitness Journey<span className="d-block"></span>
                </h1>

                <p>
                  <Link to="/Product" className="btn btn-secondary me-2">
                    Shop Now
                  </Link>
                  {products.length > 0 && (
                    <Link
                      to={`/product/${products[0].ProductId}`} // Fixed template literal
                      className="btn btn-white-outline"
                    >
                      Explore
                    </Link>
                  )}
                </p>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="hero-img-wrap">
                <img
                  src="images/product2.png" // Update with new image
                  className="img-fluid hero-overlay-image-1"
                  alt="Overlay Image 1"
                />

                <img
                  src="images/product3.png" // Update with new image
                  className="img-fluid hero-overlay-image-2"
                  alt="Overlay Image 2"
                />

                {products.length > 0 && (
                  <Link to={`/product/${products[0].ProductId}`}>
                    <img
                      src={heroImage} // Use the heroImage state for the main image
                      className="img-fluid main-image"
                      alt="Hero Product"
                    />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Hero Section */}

      {/* Start Protein Powders Section */}
      <div className="product-section">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-lg-3 mb-5 mb-lg-0">
              <h2 className="mb-4 section-title">Protein Powders</h2>
              <p>
                Discover our range of natural and organic plant-based protein
                powders designed to support your health and fitness goals. Our
                protein powders are low-calorie, low-carb, and high-protein,
                perfect for muscle growth and recovery.
              </p>
              <p>
                <Link to="/Product" className="btn">
                  Explore
                </Link>
              </p>
            </div>
            {proteinShakes.length > 0 ? (
              proteinShakes.map((product) => (
                <div
                  className="col-12 col-md-4 col-lg-3 mb-5 mb-md-0"
                  key={product.ProductId}
                >
                  <Link
                    className="product-item"
                    to={`/product/${product.ProductId}`} // Corrected Link
                  >
                    <img
                      src={product.ImageURL}
                      className="img-fluid product-thumbnail"
                      alt={product.ProdName}
                    />
                    <h3 className="product-title">{product.ProdName}</h3>
                    <strong className="product-price">
                      R{product.Price.toFixed(2)}
                    </strong>
                  </Link>
                  <div className="d-flex align-items-center mt-2">
                    {/* Quantity Controller */}
                    <div className="quantity-controller d-flex align-items-center">
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

                    {/* Add to Cart Button */}
                    <div className="ml-3">
                      {isInCart(product.ProductId, cartProducts) ? (
                        <button className="btnAddToCart" disabled>
                          Added
                        </button>
                      ) : (
                        <button
                          className="btnAddToCart"
                          onClick={() =>
                            handleAddToCart(
                              product.ProductId,
                              cartProducts,
                              setCartProducts
                            )
                          }
                          disabled={isaManager} // Disable for managers
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No Protein Powders available</p>
            )}
          </div>
        </div>
      </div>
      {/* End Protein Powders Section */}

      {/* Start Energy Bars Section */}
      <div className="product-section">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-lg-3 mb-5 mb-lg-0">
              <h2 className="mb-4 section-title">Energy Bars</h2>
              <p>
                Fuel your workouts with our energy bars made from high-quality,
                natural ingredients. Packed with protein and essential
                nutrients, these bars provide the perfect snack to keep you
                energized throughout the day.
              </p>
              <p>
                <Link to="/Product" className="btn">
                  Explore
                </Link>
              </p>
            </div>
            {energyBars.length > 0 ? (
              energyBars.map((product) => (
                <div
                  className="col-12 col-md-4 col-lg-3 mb-5 mb-md-0"
                  key={product.ProductId}
                >
                  <Link
                    className="product-item"
                    to={`/product/${product.ProductId}`} // Corrected Link
                  >
                    <img
                      src={product.ImageURL}
                      className="img-fluid product-thumbnail"
                      alt={product.ProdName}
                    />
                    <h3 className="product-title">{product.ProdName}</h3>
                    <strong className="product-price">
                      R{product.Price.toFixed(2)}
                    </strong>
                  </Link>
                  <div className="d-flex align-items-center mt-2">
                    {/* Quantity Controller */}
                    <div className="quantity-controller d-flex align-items-center">
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

                    {/* Add to Cart Button */}
                    <div className="ml-3">
                      {isInCart(product.ProductId, cartProducts) ? (
                        <button className="btnAddToCart" disabled>
                          Added
                        </button>
                      ) : (
                        <button
                          className="btnAddToCart"
                          onClick={() =>
                            handleAddToCart(
                              product.ProductId,
                              cartProducts,
                              setCartProducts
                            )
                          }
                          disabled={isaManager}
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No energy bars available</p>
            )}
          </div>
        </div>
      </div>
      {/* End Energy Bars Section */}

      {/* Start Shakers Section */}
      <div className="product-section">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-lg-3 mb-5 mb-lg-0">
              <h2 className="mb-4 section-title">Shakers</h2>
              <p>
                Our premium shakers are designed for convenience and style.
                Perfect for mixing your favorite protein powders and shakes,
                they make staying hydrated and fueled on the go effortless.
              </p>
              <p>
                <Link to="/Product" className="btn">
                  Explore
                </Link>
              </p>
            </div>
            {Shakers.length > 0 ? (
              Shakers.map((product) => (
                <div
                  className="col-12 col-md-4 col-lg-3 mb-5 mb-md-0"
                  key={product.ProductId}
                >
                  <Link
                    className="product-item"
                    to={`/product/${product.ProductId}`} // Correctd Link to redirect to the about page
                  >
                    <img
                      src={product.ImageURL}
                      className="img-fluid product-thumbnail"
                      alt={product.ProdName}
                    />
                    <h3 className="product-title">{product.ProdName}</h3>
                    <strong className="product-price">
                      R{product.Price.toFixed(2)}
                    </strong>
                  </Link>
                  <div className="d-flex align-items-center mt-2">
                    {/* Quantity Controller */}
                    <div className="quantity-controller d-flex align-items-center">
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

                    {/* Add to Cart Button */}
                    <div className="ml-3">
                      {isInCart(product.ProductId, cartProducts) ? (
                        <button className="btnAddToCart" disabled>
                          Added
                        </button>
                      ) : (
                        <button
                          className="btnAddToCart"
                          onClick={() =>
                            handleAddToCart(
                              product.ProductId,
                              cartProducts,
                              setCartProducts
                            )
                          }
                          disabled={isaManager}
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No shakers available</p>
            )}
          </div>
        </div>
      </div>
      {/* End Shakers Section */}

      {/* Start Why Choose Us Section */}
      <div className="why-choose-section">
        <div className="container">
          <div className="row justify-content-between align-items-center">
            <div className="col-lg-6">
              <h2 className="section-title">
                Why Choose Boost Products for your fitness journey ?
              </h2>
              <p>
                Whether you are looking to build muscle, gain strength or lose
                weight, the protein in Boost products is the fuel your body
                needs. It keeps your metabolism firing, your muscles singing and
                you feeling in great shape.
              </p>

              <div className="row my-5">
                <div className="col-6 col-md-6">
                  <div className="feature">
                    <div className="icon">
                      <img
                        src="images/sugar.png"
                        height="50px"
                        width="50px"
                        alt="Sugar free products"
                        className="img-fluid"
                      />
                    </div>
                    <h3>Sugar Free </h3>
                    <p>Products are sweetened with stevia.</p>
                  </div>
                </div>

                <div className="col-6 col-md-6">
                  <div className="feature">
                    <div className="icon">
                      <img
                        src="images/recycled.jpg"
                        alt="Recycled materials"
                        height="40px"
                        width="40px"
                        className="img-fluid"
                      />
                    </div>
                    <h3>Plastic Free</h3>
                    <p>
                      Packaging canisters are made from 90% recycled cardboard.
                    </p>
                  </div>
                </div>

                <div className="col-6 col-md-6">
                  <div className="feature">
                    <div className="icon">
                      <img
                        src="images/muscle1.png"
                        alt="24/7 Support"
                        height="40px"
                        width="40px"
                        className="img-fluid"
                      />
                    </div>
                    <h3>Lean Muscle tone </h3>
                    <p>
                      Protein consumption coupled with resistance training
                      stimulates the process of new muscle protein synthesis
                      (MPS). Supplementing your daily protein requirements with
                      Boost protein powder will not only make it easier to build
                      and maintain lean muscle mass but increase overall resting
                      metabolic rate assisting with fat loss.
                    </p>
                  </div>
                </div>

                <div className="col-6 col-md-6">
                  <div className="feature">
                    <div className="icon">
                      <img
                        src="images/energy1.jpg"
                        alt="Energy"
                        height="50px"
                        width="40px"
                        className="img-fluid"
                      />
                    </div>
                    <h3>Exercise Recovery</h3>
                    <p>
                      Fast absorbing nutrients work quickly to kickstart protein
                      synthesis by replenishing muscle fibres and reducing
                      muscle fatigue and soreness. A high protein profile
                      promotes nutrient absorption for improved muscle recovery
                      and growth proven to take place 30 - 45 minutes prior to
                      physical exercise.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="img-wrap">
                <img src="images/running.jpg" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Why Choose Us Section */}
    </Layout>
  );
}
