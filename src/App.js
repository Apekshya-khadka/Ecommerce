// src/App.js
import React, { useState } from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import ProductList from "./components/ProductList";
import AddProduct from "./components/AddProduct";
import EditProduct from "./components/EditProduct";
import Login from "./components/Login";
import Register from "./components/Register";
import Cart from "./components/Cart";
import Home from "./components/Home";
import ProductDetail from "./components/ProductDetail";
import Orders from "./components/Orders";
import Checkout from "./components/Checkout";
import AdminOrders from "./components/AdminOrders";

// ✅ Import Bootstrap CSS and JS bundle
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function App() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/">TechStore</Link>

          {/* Hamburger toggle for mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Collapsible menu */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {!localStorage.getItem("token") ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">Register</Link>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-outline-light">
                    Logout
                  </button>
                </li>
              )}

              <li className="nav-item">
                <Link className="nav-link" to="/cart">Cart</Link>
              </li>

              {localStorage.getItem("token") && localStorage.getItem("role") === "admin" && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/add">Add Product</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/orders">Admin Orders</Link>
                  </li>
                </>
              )}

              {localStorage.getItem("token") && (
                <li className="nav-item">
                  <Link className="nav-link" to="/orders">Orders</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={localStorage.getItem("token") ? <ProductList /> : <Navigate to="/login" />} />
          <Route path="/products/:id" element={localStorage.getItem("token") ? <ProductDetail /> : <Navigate to="/login" />} />
          <Route path="/products/edit/:id" element={localStorage.getItem("token") && localStorage.getItem("role") === "admin" ? <EditProduct /> : <h2 className="text-danger">Access denied: Admins only</h2>} />
          <Route path="/add" element={localStorage.getItem("token") && localStorage.getItem("role") === "admin" ? <AddProduct /> : <h2 className="text-danger">Access denied: Admins only</h2>} />
          <Route path="/cart" element={localStorage.getItem("token") ? <Cart cartItems={cartItems} setCartItems={setCartItems} /> : <Navigate to="/login" />} />
          <Route path="/checkout" element={localStorage.getItem("token") ? <Checkout cartItems={cartItems} /> : <Navigate to="/login" />} />
          <Route path="/orders" element={localStorage.getItem("token") ? <Orders /> : <Navigate to="/login" />} />
          <Route path="/admin/orders" element={localStorage.getItem("token") && localStorage.getItem("role") === "admin" ? <AdminOrders /> : <h2 className="text-danger">Access denied: Admins only</h2>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-light text-center py-3 mt-5">
        <p className="mb-0">© 2026 TechStore | Laptops • Phones • Machinery • Gaming</p>
      </footer>
    </div>
  );
}

export default App;
