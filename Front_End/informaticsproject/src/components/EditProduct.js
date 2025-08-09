import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import "../styles/css/About.css";
import ConfirmationModal from "./ConfirmationModal";
import ManagerDashboardLayout from "./ManagerDashboardLayout";

function EditProduct() {
  const { id } = useParams();
  const productId = parseInt(id, 10);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});

  //Change so that intial values are there
  // Initialize form data state
  const [formData, setFormData] = useState({
    ProductName: "",
    ProductPrice: "",
    ProductDescription: "",
    ProductIngredients: "",
    ProductDirections: "",
    ProductStorage: "",
    ProductStock: "",
    ImageURL: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Fetch specific product
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
          // Set form data with the product's existing values
          setFormData({
            ProductName: foundProduct.ProdName,
            ProductPrice: foundProduct.Price.toFixed(2), // Format price to two decimal places
            ProductDescription: foundProduct.ProdDescription,
            ProductIngredients: foundProduct.ProdIngredients,
            ProductDirections: foundProduct.ProductDirections,
            ProductStorage: foundProduct.Storage,
            ProductStock: foundProduct.NumInStock,
            ImageURL: foundProduct.ImageURL,
          });
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError("Error fetching product");
      }
    };

    fetchProduct();
  }, [productId]);

  // Handle input changes
  const handleChange = (event) => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    setFormData((previousData) => ({
      ...previousData,
      [fieldName]: fieldValue,
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Construct the URL with query parameters
    const {
      ProductName,
      ProductPrice,
      ProductDescription,
      ProductIngredients,
      ProductDirections,
      ProductStorage,
      ProductStock,
      ImageURL,
    } = formData;
    const url = `http://localhost:58398/Service1.svc/EditProduct?productId=${encodeURIComponent(
      productId
    )}&prodName=${encodeURIComponent(ProductName)}&price=${encodeURIComponent(
      ProductPrice
    )}&prodDescription=${encodeURIComponent(
      ProductDescription
    )}&prodIngredients=${encodeURIComponent(
      ProductIngredients
    )}&prodDirections=${encodeURIComponent(
      ProductDirections
    )}&storage=${encodeURIComponent(
      ProductStorage
    )}&numInStock=${encodeURIComponent(
      ProductStock
    )}&imageURL=${encodeURIComponent(ImageURL)}`;

    axios
      .get(url)
      .then((response) => {
        setMessage("Changes Successfully Implemented");
        navigate("/SelectProductForEdit"); // Redirect to edit product selection after successful submission
      })
      .catch((error) => {
        console.error("Error while altering product:", error);
        setMessage("Product alteration failed. Please try again.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  // Logic for product deletion
  const handleDeleteProduct = async () => {
    try {
      const response = await axios.get(
        `http://localhost:58398/Service1.svc/DeleteProduct?productId=${productId}`
      );
      if (response.status === 200) {
        alert("Product successfully removed.");
        navigate("/SelectProductForEdit");
      } else {
        setError(`Failed to remove product: ${response.data.message}`);
      }
    } catch (err) {
      setError("An error occurred while removing the product");
    }
  };

  // Open confirmation modal
  const openModalForAction = (action) => {
    if (action === "remove") {
      setModalContent({
        title: "Confirm Delete",
        message: "Changes may be permanent. Proceed with this action?",
        confirmText: "Delete",
        onConfirm: () => {
          handleDeleteProduct();
          setIsModalOpen(false);
        },
      });
    }

    setIsModalOpen(true);
  };

  // Open confirmation modal for form submission
  const handleSubmitWithConfirmation = (e) => {
    e.preventDefault();

    setModalContent({
      title: "Confirm Edit",
      message: "Are you sure you want to save these changes?",
      confirmText: "Save Changes",
      onConfirm: () => {
        handleSubmit();
        setIsModalOpen(false);
      },
    });

    setIsModalOpen(true);
  };

  if (error) return <div>{error}</div>;
  if (!product) return <div>Loading...</div>;

  return (
    <ManagerDashboardLayout>
      <div className="product-container">
        <div className="leftpart">
          <img src={product.ImageURL} alt={product.ProdName} />
        </div>
        <div className="ProductDescription">
          <h1 className="productname">Editing: {product.ProdName}</h1>
          <div className="Form">
            <form onSubmit={handleSubmitWithConfirmation} className="row g-3">
              <div className="col-auto">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={"Name: " + product.ProdName}
                  name="ProductName"
                  value={formData.ProductName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-auto">
              <label>Price</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={"Price: R" + product.Price.toFixed(2)}
                  name="ProductPrice"
                  value={formData.ProductPrice}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-auto">
              <label>Description</label>
                <textarea
                  className="form-control"
                  placeholder={"Description: " + product.ProdDescription}
                  name="ProductDescription"
                  value={formData.ProductDescription}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-auto">
              <label>Ingredients</label>
                <textarea
                  className="form-control"
                  placeholder={"Ingredients: " + product.ProdIngredients}
                  name="ProductIngredients"
                  value={formData.ProductIngredients}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-auto">
              <label>Use Directions</label>
                <textarea
                  className="form-control"
                  placeholder={"Directions: " + product.ProductDirections}
                  name="ProductDirections"
                  value={formData.ProductDirections}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-auto">
              <label>Storage</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={"Storage: " + product.Storage}
                  name="ProductStorage"
                  value={formData.ProductStorage}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-auto">
              <label>Number In Stock</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={"Number In Stock: " + product.NumInStock}
                  name="ProductStock"
                  value={formData.ProductStock}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-auto">
              <label>Image URL</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={"Image URL: " + product.ImageURL}
                  name="ImageURL"
                  value={formData.ImageURL}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="button" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Confirm"}
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  openModalForAction("remove");
                }}
                className="delete-button"
              >
                Remove Product
              </button>
            </form>

            {/* confirmation pop upwindow */}
            <ConfirmationModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              {...modalContent}
              cancelText="Cancel"
            />
          </div>
        </div>
      </div>
    </ManagerDashboardLayout>
  );
}

export default EditProduct;
