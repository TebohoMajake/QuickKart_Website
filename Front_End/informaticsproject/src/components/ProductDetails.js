import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Layout from "./Layout";
import "../styles/css/About.css"; // Ensure the path is correct
import { handleAddToCart, handleQuantityChange, isInCart, getProductQuantity } from '../utils';
import Breadcrumb from './Breadcrumb';

const ProductDetails = () => {
  const { id } = useParams();
  const productId = parseInt(id, 10);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          "http://localhost:58398/Service1.svc/GetProducts"
        );
        const products = response.data;
        const foundProduct = products.find((p) => p.ProductId === productId);
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError("Error fetching product");
      }
    };

    fetchProduct();

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
  }, [productId]);

  if (error) return <div>{error}</div>;
  if (!product) return <div>Loading...</div>;

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'All Products', url: '/Product' },
    { name: product.ProdName, url: '' },
    
  ];
  return (
    <Layout>
      <div className="product-container">
        <div className="leftpart">
        <Breadcrumb items={breadcrumbItems} />
          <img src={`${product.ImageURL}`} alt={product.ProdName} />
        </div>
        <div className="ProductDescription">
          <h1 className="productname">{product.ProdName}</h1>
          <p className="price">
            <strong>R{product.Price.toFixed(2)}</strong>
          </p>
          <p>{product.ProdDescription}</p>
          <p className="Ingredients">
            <strong>Ingredients:</strong> {product.ProdIngredients}
          </p>
          <p className="Work">
            <strong>Directions:</strong> {product.ProductDirections}
          </p>
          <p className="Work">
            <strong>Storage:</strong> {product.Storage}
          </p>

          <div className="d-flex align-items-center mt-2">
            {/* Quantity Controller */}
            <div className="quantity-controller d-flex align-items-center">
              <button
                onClick={() =>
                  handleQuantityChange(product.ProductId, product.NumInStock, -1, cartProducts, setCartProducts)
                }
                disabled={getProductQuantity(product.ProductId, cartProducts) === 1}
              >
                −
              </button>
              <span className="mx-2">
                {getProductQuantity(product.ProductId, cartProducts)}
              </span>
              <button
                onClick={() =>
                  handleQuantityChange(product.ProductId, product.NumInStock, 1, cartProducts, setCartProducts)
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
                    handleAddToCart(product.ProductId, cartProducts, setCartProducts)
                  }
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
