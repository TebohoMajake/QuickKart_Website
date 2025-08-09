import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user information from localStorage
    localStorage.removeItem("UserId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userType");

    // Optionally, you can add a message or perform any other action here

    // Redirect to the Home page
    navigate("/");
  }, [navigate]);

  return null; // This component doesn't render anything
}
