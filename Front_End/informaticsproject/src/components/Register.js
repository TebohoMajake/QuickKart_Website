import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import "../styles/css/register.css";
import axios from "axios";

export default function Register() {
  //State variables to hold the input from the forms  and also the submisiion status
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Password: "",
    FGoal: ""
  });
  // State to manage form submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  //  A State to display success or error messages
  const [message, setMessage] = useState("");

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const [fitnessGoals, setFitnessGoals] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:58398/Service1.svc/GetFitnessGoals")
      .then((response) => {
        setFitnessGoals(response.data);
      })
      .catch((error) => {
        console.error("Error fetching fitness goals:", error);
      });
  }, []);

  //Hook to navigate to other routes
  const navigate = useNavigate();

  // triggered whenever an input field changes
  const handleChange = (event) => {
    // Get the name of the input field
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    // Update the form data: keep everything the same, but update the one field the user is typing in
    setFormData((previousData) => ({
      ...previousData,
      [fieldName]: fieldValue, // Update only the field that the user is currently editing
    }));
  };

  //Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitting(true); //Now set it to true to disable the button

    //Send the form data to the server
    // Construct the URL with query parameters
    const { FirstName, LastName, Email, Password, FGoal } = formData;
    const userType = "Customer"; // Setting userType to customer
    const url = `http://localhost:58398/Service1.svc/RegisterUser?firstName=${encodeURIComponent(
      FirstName
    )}&surname=${encodeURIComponent(LastName)}&email=${encodeURIComponent(
      Email
    )}&password=${encodeURIComponent(Password)}&userType=${encodeURIComponent(
      userType
    )}&fGoal=${encodeURIComponent(FGoal)}`;

    axios
      .get(url) // Send a GET request with the query parameters
      .then((response) => {
        setMessage("Registration Successful");
        setFormData({
          FirstName: "",
          LastName: "",
          Email: "",
          Password: "",
          FGoal: ""
        });

        navigate("/"); // Redirect to homepage after successful registration
      })
      .catch((error) => {
        console.error("Error during registration:", error); // Log error to console
        setMessage("Registration failed. Please try again."); // Set error message
      })
      .finally(() => {
        setIsSubmitting(false); // Reset submitting state to false
      });
  };

  const handleGoal = (goalID) => {
    setFormData((previousData) => ({
      ...previousData,
      FGoal: goalID
    }));

    setDropdownOpen(false);
  }

  //Function for handling form submission

  return (
    <Layout>
      {/* Start Hero Section */}
      <div className="hero">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-5">
              <div className="intro-excerpt">
                <h1>
                  Sign Up. <span className="d-block"></span>
                </h1>
                <p className="mb-4">
                  Welcome to Boost, where premium protein shakes meet your
                  wellness goals. Our shakes are crafted with high-quality
                  ingredients to fuel your fitness journey, support muscle
                  recovery, and boost overall health. Join us and experience the
                  perfect blend of taste and nutrition with every shake.
                </p>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="hero-img-wrap">
                {/* Start of Form*/}
                <div className="Form">
                  <div className="Formcontainer">
                    <div className="row">
                      <div className="col-md-12 col-lg-3 mb-5 mb-lg-0">
                        <h2 className="mb-4 section-title">Personal Details</h2>

                        <form onSubmit={handleSubmit} className="row g-3">
                          <div className="col-auto">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Name"
                              name="FirstName"
                              value={formData.FirstName}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="col-auto">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="LastName"
                              name="LastName"
                              value={formData.LastName}
                              onChange={handleChange}
                              required
                            />
                          </div>
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
                          <div className="user-dropdown" onClick={toggleDropdown}>
                            <div className="col-auto">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Select Fitness Goal"
                                name="FGoal"
                                value={formData.FGoal}
                                readOnly
                                required
                              />
                              <ul className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}>
                                {fitnessGoals.map((goal) => (
                                  <li key={goal.FitnessGoalId} onClick={() => handleGoal(goal.FitnessGoalId)}>
                                    {goal.FGoalName}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          <p>
                            <button
                              type="submit"
                              className="btn"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Submitting..." : "Register"}
                            </button>
                          </p>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End Form */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Hero Section */}
    </Layout>
  );
}
