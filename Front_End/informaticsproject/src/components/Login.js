import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import axios from "axios";

export default function Login() {
  // Variables to hold the input
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });

  // State to manage form submission status/to track if form is being submitted
  const [isSubmitting, setIsSubmitting] = useState(false);
  // State to display success or error messages
  const [message, setMessage] = useState("");

  // Hook to navigate to other routes
  const navigate = useNavigate();

  // Ref to handle form submission
  const formRef = useRef(null);

  // Triggered whenever an input field changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Update the specific field
    }));
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitting(true); // Set to true to disable the button

    // Send the form data to the server/service
    const { Email, Password } = formData;
    const Apiurl = `http://localhost:58398/Service1.svc/Login?email=${encodeURIComponent(
      Email
    )}&password=${encodeURIComponent(Password)}`;

axios
  .get(Apiurl)
  .then((response) => {
    console.log("API Response:", response.data); // Log full response
    if (response.data) {
      const { UserId, UserType, userName } = response.data; // Make sure to use the correct key names

      console.log("UserType from response:", UserType); // Log userType

      // Store the userType in localStorage
      localStorage.setItem("UserId", UserId);
      localStorage.setItem("userName", userName);
      localStorage.setItem("userType", UserType); // Make sure the key matches what you are using in Header.js

      setMessage("Login Successful");
      setFormData({
        Email: "",
        Password: "",
      });

      navigate("/"); // Redirect to homepage after successful login
    } else {
      setMessage("Invalid credentials. Please try again.");
    }
  })
  .catch((error) => {
    console.error("Error during login:", error);
    setMessage("Login failed. Please try again.");
  })
  .finally(() => {
    setIsSubmitting(false);
  });

    

  };

  // Handle login button click action
  //Use request submit
  const handleButtonClick = () => {
    if (formRef.current) {
      formRef.current.requestSubmit(); // Manually trigger form submission
    }
  };

  return (
    <Layout>
      {/* Start Hero Section */}
      <div className="hero">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-5">
              <div className="intro-excerpt">
                <h1>
                  Log In to Your Account. <span className="d-block"></span>
                </h1>
                <p className="mb-4">
                  Discover the benefits of Boost, where premium protein shakes
                  support your fitness journey. Crafted with top-quality
                  ingredients, our shakes offer the perfect mix of flavor and
                  nutrition to help you achieve your health goals. Become part
                  of our community and enjoy the taste of success with every
                  shake.
                </p>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="form-container">
                <form ref={formRef} onSubmit={handleSubmit} className="row g-3">
                  <div className="col-auto">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      name="Email"
                      value={formData.Email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-auto">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      name="Password"
                      value={formData.Password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </form>
                <div className="col-auto">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleButtonClick}
                    disabled={isSubmitting}
                  >
                    Login
                  </button>
                </div>
                {message && <p>{message}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Hero Section */}
    </Layout>
  );
}
