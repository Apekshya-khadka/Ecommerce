// src/components/ProductList.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Toast state
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState(""); // "success", "danger", "warning"
  const [showToast, setShowToast] = useState(false);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

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

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://ecommerce-5gac.onrender.com/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        triggerToast("Error fetching products", "danger");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Refresh products
  const refreshProducts = async () => {
    try {
      const res = await fetch("https://ecommerce-5gac.onrender.com/products");
      setProducts(await res.json());
    } catch (err) {
      triggerToast("Error refreshing products", "danger");
    }
  };

  // Search products
  const handleSearch = async () => {
    if (!searchTerm) {
      refreshProducts();
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`https://ecommerce-5gac.onrender.com/products/search/${searchTerm}`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setProducts(data);

      if (data.length === 0) {
        triggerToast("No results found", "warning");
      } else {
        triggerToast(`Showing results for "${searchTerm}"`, "success");
      }
    } catch (err) {
      triggerToast("Error searching products", "danger");
    } finally {
      setLoading(false);
    }
  };

  // Delete product (admin only)
  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`https://ecommerce-5gac.onrender.com/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete product");
      triggerToast("Product deleted successfully!", "success");
      refreshProducts();
    } catch (err) {
      triggerToast("Error deleting product", "danger");
    }
  };

  // Update stock (admin only)
  const updateStock = async (id, newStock) => {
    try {
      const res = await fetch(`https://ecommerce-5gac.onrender.com/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ stock: newStock })
      });
      if (!res.ok) throw new Error("Failed to update stock");
      triggerToast("Stock updated successfully!", "success");
      refreshProducts();
    } catch (err) {
      triggerToast("Error updating stock", "danger");
    }
  };

  // Add to cart (user)
  const addToCart = async (productId) => {
    try {
      const res = await fetch("https://ecommerce-5gac.onrender.com/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity: 1 })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add to cart");
      triggerToast(data.message || "Added to cart!", "success");
    } catch (err) {
      triggerToast("Error adding to cart", "danger");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Product List</h2>

      {/* Search bar */}
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

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

      {/* Loading state */}
      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-muted">No results found</p>
      ) : (
        <div className="row">
          {products.map((product) => (
            <div className="col-md-4 mb-3" key={product._id}>
              <Link to={`/products/${product._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={product.image || "https://via.placeholder.com/200"}
                    className="card-img-top"
                    alt={product.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>

                    {/* Show discount price if available */}
                    {product.originalPrice ? (
                      <p className="card-text">
                        <span className="text-danger fw-bold">Rs {product.price}</span>{" "}
                        <span className="text-muted text-decoration-line-through">
                          Rs {product.originalPrice}
                        </span>{" "}
                        <small className="text-success">
                          ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off)
                        </small>
                      </p>
                    ) : (
                      <p className="card-text">Rs {product.price}</p>
                    )}

                    <p className="card-text">{product.description}</p>
                    <p className="card-text">
                      <small>Category: {product.category}</small><br />
                      <small>Stock: {product.stock}</small>
                    </p>

                    {/* Admin buttons */}
                    {token && role === "admin" ? (
                      <>
                        <button
                          className="btn btn-danger btn-sm me-2"
                          onClick={(e) => {
                            e.preventDefault();
                            deleteProduct(product._id);
                          }}
                        >
                          Delete
                        </button>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={(e) => {
                            e.preventDefault();
                            updateStock(product._id, product.stock + 1);
                          }}
                        >
                          + Stock
                        </button>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            updateStock(product._id, product.stock - 1);
                          }}
                          disabled={product.stock <= 0}
                        >
                          - Stock
                        </button>
                      </>
                    ) : (
                      // User button
                      token && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(product._id);
                          }}
                        >
                          Add to Cart
                        </button>
                      )
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
