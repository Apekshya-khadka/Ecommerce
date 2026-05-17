// src/components/Login.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });

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
    try {
      const res = await fetch("https://ecommerce-5gac.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (res.ok && data.token) {
        // Save both token and role
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        triggerToast("Login successful!", "success");

        
        setTimeout(() => {
          if (data.role === "admin") {
            navigate("/products", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        }, 500);
      } else {
        triggerToast(data.message || "Login failed", "danger");
      }
    } catch (err) {
      console.error("Login error:", err);
      triggerToast("Error logging in", "danger");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Login</h2>

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

      {/* Login form */}
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className="form-control"
            placeholder="Enter your email"
            value={formData.email}
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
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}

export default Login;
