import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { handleAddToCart, handleQuantityChange1, isInCart, getProductQuantity, mergeLocalCartWithServerCart, removeProductInCart1 } from '../utils';
import html2pdf from 'html2pdf.js';

function ShoppingCart() {
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const [productInCart, setProductsInCart] = useState([]);
  const invoiceRef = useRef();
  const cartTotal = 0;


  useEffect(() => {
    // Check if the user is logged in
    const storedUserId = localStorage.getItem("UserId");
    if (storedUserId) {
      // Set userId from localStorage
      setUserId(storedUserId);

      // Fetch products if userId is available
      axios.get(`http://localhost:58398/Service1.svc/GetProductsInCart?customerId=${storedUserId}`)
        .then((response) => {
         // Assuming the response is an array of product objects
          setProducts(response.data);
          console.error("UserId: ", storedUserId);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        
        });
    }
    else {
      //If the user is not logged in get the products from the temporary cart
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      
      

      //Get product details for all the items in the cart
      Promise.all(cart.map(item =>
        axios.get(`http://localhost:58398/Service1.svc/GetProduct?productId=${item.ProductId}`)
          .then(response => ({ ...response.data, Quantity: item.Quantity}))
          .catch((error) => {

            console.error('Error fetching product', error);
            return null;

          })
      ))
      .then((fetchedProducts) => {

        //Filter out any nulls
        const validProducts = fetchedProducts.filter(product => product != null);
        setProducts(validProducts);

      });

    }

    
  }, [navigate]);

  const generatePDF = (invoiceId) => {
    /*
    const element = invoiceRef.current;
    html2pdf().from(element).save('invoice.pdf');
    */

    if(invoiceId != 0)
    {
      localStorage.setItem("invoiceId", invoiceId);
    }

    navigate("/Invoice");



  };

  // Function to update the product quantity
  function updateProductQuantity(productId, newQuantity) {
    if (newQuantity < 1) return; // Prevent setting quantity below 1

    // Update the product's quantity in the products array
    setProducts(
      products.map((product) =>
        product.ProductId === productId
          ? { ...product, Quantity: newQuantity } // Update the product with the new quantity
          : product // Keep other products unchanged
      )
    );
  }

  const removePIC = (prodId, cartProds, setCartProds) => {

    removeProductInCart1(prodId, cartProds, setCartProds);
    navigate(0);

  };

  const calculateTotal = () => {
    return products.reduce((acc, product) => acc + (product.Price * product.Quantity), 0);
  };

  //Function to save html code
  const saveHTMLToDatabase = (totalAmount) => {

    // Check if the user is logged in
    const userId = localStorage.getItem("UserId");

    if(userId) {

      // Clone the current div
      const clonedDiv = invoiceRef.current.cloneNode(true);

      // Find all buttons and remove their functionality
      const buttons = clonedDiv.querySelectorAll('button');
      buttons.forEach((button) => {
        button.innerText = ''; // Replace button text (optional)
        button.disabled = true; // Disable the button
        button.removeAttribute('onClick'); // Remove the onClick event
      });

      // Get the inner HTML of the modified clone
      const htmlString = clonedDiv.innerHTML;

      // Encode the HTML string to safely include it in the URL
      const encodedHtml = encodeURIComponent(htmlString);

      let invoiceId = 0;
      // Send invoice data to database
      axios
        .get(`http://localhost:58398/Service1.svc/AddInvoice?customerId=${userId}&totalAmount=${totalAmount}`)
        .then((response) => {

          if (response.data > 0) {
            invoiceId = response.data;
            console.log("InvoiceId: ", response.data);


            //Send the products in the database too
            products.forEach((product) => {
              console.log("InvoiceId: ", invoiceId);
              axios
                .get(`http://localhost:58398/Service1.svc/AddProductInInvoice?invoiceId=${invoiceId}&productId=${product.ProductId}&prodName=${product.ProdName}&price=${product.Price}&qty=${product.Quantity}&total=${product.Quantity * product.Price}`)
                .then((response) => {

                  if (response.data === true) {
                    console.log("invoice product saved successfully");

                    
                  }
                  else {
                    console.error("invoice product not saved T0T")
                  }

                })
                .catch((error) => {
                  console.error("Error saving product: ", error);
                });

            });

            //Check for a discount and then add it
            if(calculateTotal() > 2000)
            {

              var discountName = "Discount (15%)";
              var discountPrice = (calculateTotal() * 0.15) * -1;
              axios
                .get(`http://localhost:58398/Service1.svc/AddProductInInvoice?invoiceId=${invoiceId}&prodName=${discountName}&price=${discountPrice}&qty=1&total=${discountPrice}`)
                .then((response) => {

                  if (response.data === true) {
                    console.log("invoice discount saved successfully");

                    
                  }
                  else {
                    console.error("invoice discount not saved T0T")
                  }

                })
                .catch((error) => {
                  console.error("Error saving discount: ", error);
                });

            }

            //Add the shipping
            var shippingName = "Shipping";
            axios
                .get(`http://localhost:58398/Service1.svc/AddProductInInvoice?invoiceId=${invoiceId}&prodName=${shippingName}&price=${75}&qty=1&total=${75}`)
                .then((response) => {

                  if (response.data === true) {
                    console.log("invoice shipping saved successfully");

                    
                  }
                  else {
                    console.error("invoice shipping not saved T0T")
                  }

                })
                .catch((error) => {
                  console.error("Error saving shipping: ", error);
                });

            //Generate the invoice as PDF
            generatePDF(invoiceId);


          }
          else {
            console.error("invoice not saved T0T")
          }

        })
        .catch((error) => {
          console.error("Error saving invoice: ", error);
        });

      
        
      
        
      //Purchase all the products from the cart
      axios
        .get(
          `http://localhost:58398/Service1.svc/PurchaseProdsInCart?customerId=${userId}`
        )
        .then((response) => {
          
          if(response.data === true) {
            console.log("products purchased successfully");
          }
          else
          {
            console.error("Products were not purchased")
          }

        })
        .catch((error) => {
          console.error("Error purchasing: ", error);
        });

        
    }
    else
    {
      navigate("/Login");
    }

  }

  return (
    <Layout>
      <div>
        {/* Start Hero Section */}
        <div className="hero">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h1 className="hero-heading">Shopping Cart</h1>
            </div>
          </div>
        </div>
        {/* End Hero Section */}

        <div className="untree_co-section before-footer-section">
          <div className="container" ref={invoiceRef} style={{ padding: 20 }}>
            <div className="row mb-5">
              <form className="col-md-12" method="post">
                <div className="site-blocks-table">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="product-thumbnail">Image</th>
                        <th className="product-name">Product</th>
                        <th className="product-price">Price</th>
                        <th className="product-quantity">Quantity</th>
                        <th className="product-total">Total</th>
                        <th className="product-remove">Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.ProductId}>
                          <td className="product-thumbnail">
                            <img src={product.ImageURL} alt={product.ProdName} className="img-fluid" />
                          </td>
                          <td className="product-name">
                            <h2 className="h5 text-black">{product.ProdName}</h2>
                          </td>
                          <td>R{product.Price.toFixed(2)}</td>
                          <td>
                            <div className="input-group mb-3 d-flex align-items-center quantity-container" style={{ maxWidth: "120px" }}>
                              
                              <div className="input-group-append">
                                <button className="btn btn-outline-black decrease" type="button" onClick={ () =>
                                  handleQuantityChange1(product.ProductId, product.NumInStock, -1, products, setProducts)
                                }>&minus;</button>
                              </div>
                              <input type="text" className="form-control text-center quantity-amount" value={product.Quantity} readOnly />
                              <div className="input-group-append">
                                <button className="btn btn-outline-black increase" type="button" onClick={ () =>
                                  handleQuantityChange1(product.ProductId, product.NumInStock, 1, products, setProducts)
                                }>+</button>
                              </div>
                            </div>
                          </td>
                          <td>R{(product.Price * product.Quantity).toFixed(2)}</td>
                          <td>
                            <a className="btn btn-black btn-sm" onClick={ () =>
                              //removeProductInCart1(product.ProductId, products, setProducts)
                              removePIC(product.ProductId, products, setProducts)
                            }>X</a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </form>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="row mb-5">
                  {/*
                  <div className="col-md-6 mb-3 mb-md-0">
                    <button className="btn btn-custom btn-sm btn-block">Update Cart</button>
                  </div>
                  */}
                  <div className="col-md-6">
                    <Link className="nav-link" to="/Product">
                    <button className="btn btn-outline-custom btn-sm btn-block" >Continue Shopping</button>
                    </Link>
                  </div>
                  
                </div>
                {/*
                <div className="row">
                    <div className="col-md-12">
                      <label className="text-black h4" for="coupon">Coupon</label>
                      <p>Enter your coupon code if you have one.</p>
                    </div>
                    <div class="col-md-8 mb-3 mb-md-0">
                    <input type="text" className="form-control py-3" id="coupon" placeholder="Coupon Code"  />

                    </div>
                    <div class="col-md-4">
                    <button className="btn btn-black" style={{ marginLeft: '40px' }}>Apply Coupon</button>

                    </div>
                  </div>
                  */}
              </div>
              <div className="col-md-6 pl-5">
                <div className="row justify-content-end">
                  <div className="col-md-7">
                    <div className="row">
                      <div className="col-md-12 text-right border-bottom mb-5">
                        <h3 className="text-black h4 text-uppercase">Cart Totals</h3>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <span className="text-black">Subtotal</span>
                      </div>
                      <div className="col-md-6 text-right">
                      {calculateTotal() > 2000 ? (
                        <span className="text-black" style={{ textDecoration: 'line-through' }}>
                          R{calculateTotal().toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-black">R{calculateTotal().toFixed(2)}</span>
                      )}
                    </div>
                    </div>
                    {calculateTotal() > 2000 && (
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <span className="text-black">Discount (15%)</span>
                      </div>
                      <div className="col-md-6 text-right">
                        <span className="text-black">- R{(calculateTotal() * 0.15).toFixed(2)}</span>
                      </div>
                      
                    </div>
                    
                  )}
                      
                    <div className="row mb-5">
                      <div className="col-md-6">
                        {/*<span className="text-black">VAT (included)</span>*/}
                      </div>
                      <div className="col-md-6 text-right">
                        <span className="text-black"></span>
                      </div>
                      <div className="col-md-6">
                        <span className="text-black">Shipping fee</span>
                      </div>
                      <div className="col-md-6 text-right">
                        <span className="text-black">R75</span>
                      </div>
                    </div>
                    
                    <div className="row mb-5">
                  
                    <div className="col-md-6">
                      <span className="text-black">Total</span>
                    </div>
                    <div className="col-md-6 text-right">
                      <span className="text-black" style={{ fontWeight: 'bold', fontSize: '1.5em' }}>
                        R{(calculateTotal() > 2000 ? calculateTotal() * 0.8 + 75: calculateTotal()).toFixed(2) }
                      </span>
                    </div>
                  </div>

                    <div className="row">
                      <div className="col-md-12">
                        <button className="btn btn-custom btn-lg py-3 btn-block" onClick={() => {saveHTMLToDatabase((calculateTotal() > 2000 ? calculateTotal() - (calculateTotal() * 0.15) + 75: calculateTotal() + 75))}}>Proceed To Checkout</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End Content Section */}
      </div>
    </Layout>
  );
}


export default ShoppingCart;
