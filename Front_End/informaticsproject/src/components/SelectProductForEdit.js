import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Layout from "./Layout";
import ManagerDashboardLayout from "./ManagerDashboardLayout";

export default function SelectProductForEdit() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products data from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:58398/Service1.svc/GetProducts"
        );
        setProducts(response.data);
      } catch (err) {
        setError("Error fetching products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  return (
    <ManagerDashboardLayout>
      <h1>Select a Product to Edit</h1>
      <div className="sTable">
        <table className="invoices-table">
          <thead>
            <tr>
              <th>Product Id</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.ProductId}>
                <td>{product.ProductId}</td>
                <td>{product.ProdName}</td>
                <td>R{product.Price.toFixed(2)}</td>
                <td>
                  <Link
                    to={`/EditProduct/${product.ProductId}`}
                    className="btn btn-black btn-sm"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ManagerDashboardLayout>
  );
}
