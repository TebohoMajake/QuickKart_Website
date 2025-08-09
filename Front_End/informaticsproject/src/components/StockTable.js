import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import axios from "axios";
import { handleAddToCart, handleQuantityChange, isInCart, getProductQuantity } from '../utils';
import { FiShoppingCart } from "react-icons/fi";
import ManagerDashboardLayout from "./ManagerDashboardLayout";

export default function StockTable() {
    const [products, setProducts] = useState([]); // Store the fetched products
  const [cartStatus, setCartStatus] = useState({});
  const [carouselProducts, setCarouselProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(products); // Store the products arfter applying the filter
  const [filter, setFilter] = useState("all"); // Store the current filter selection
  const [categoryId, setCategoryId] = useState("all");
  const [cartProducts, setCartProducts] = useState([]);
  const navigate = useNavigate();

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


  const DeleteProduct = (productId) => 
  {

    axios.get(`http://localhost:58398/Service1.svc/DeleteProduct?productId=${productId}`)
    .then((response) => {

      if(response.data)
      {
        console.log("Product deleted successfully");
        window.location.reload()
      }
      else
      {
        console.error("Failed to delete product");
      }

    })
    .catch((error) => {

      console.error("Error deleting product ", error);

    });

  }

    return(
        <ManagerDashboardLayout>
            <h1><b>Stock table</b></h1>

            <div className="sTable">
            <table className="invoices-table">
                    <thead>
                        <tr>
                            <th>Product Id</th>
                            <th>Product image</th>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Delete Product</th>
                        </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.ProductId}>
                        <td className="product-id">
                            <h2 className="h5 text-black">{product.ProductId}</h2>
                          </td>
                          <td className="product-Ithumbnail">                    
                            <img src={product.ImageURL} alt={product.ProdName} className="img-fluid" />
                          </td>
                          <td className="product-name">
                            <h2 className="h5 text-black">{product.ProdName}</h2>
                          </td>
                          <td className="product-quantity">
                            <h2 className="h5 text-black">{product.NumInStock}</h2>
                          </td>
                          <td>R{product.Price.toFixed(2)}</td>                          
                          <td>
                            <a className="btn btn-black btn-sm"
                              //call delete product function 
                              onClick={() => {DeleteProduct(product.ProductId)}} 
                            >X</a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                </table>
            </div>
        </ManagerDashboardLayout>




    );
}