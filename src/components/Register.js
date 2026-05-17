// src/components/Register.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  // Toast state
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState(""); // "success" or "danger"
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const triggerToast = (msg, type) => {
    setToastMessage(msg);
    setToastType(type);
    setShowToast(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Basic validation
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      triggerToast("All fields are required", "danger");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      triggerToast("Invalid email format", "danger");
      return;
    }

    if (formData.password.length < 6) {
      triggerToast("Password must be at least 6 characters", "danger");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      triggerToast("Passwords do not match", "danger");
      return;
    }

    try {
      const res = await fetch("https://ecommerce-5gac.onrender.com/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });
      const data = await res.json();

      if (res.ok) {
        triggerToast("Registration successful! Please login.", "success");
        navigate("/login"); //  redirect to login
      } else {
        triggerToast(data.message || "Registration failed", "danger");
      }
    } catch (err) {
      triggerToast("Error registering user", "danger");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Register</h2>

      {/* Toast notification */}
      <div
        className={`toast align-items-center text-bg-${toastType} border-0 position-fixed bottom-0 end-0 m-3 ${showToast ? "show" : "hide"}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex">
          <div className="toast-body">{toastMessage}</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            onClick={() => setShowToast(false)}
          ></button>
        </div>
      </div>

      {/* Register form with Bootstrap styling */}
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            className="form-control"
            placeholder="Enter your username"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className="form-control"
            placeholder="Enter your email"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            className="form-control"
            placeholder="Enter your password"
            onChange={handleChange}
            required
          />
        </div>

        {/* Confirm Password field */}
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className="form-control"
            placeholder="Re-enter your password"
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-success">Register</button>
      </form>
    </div>
  );
}

export default Register;
