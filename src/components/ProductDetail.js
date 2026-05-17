// src/components/ProductDetail.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://ecommerce-5gac.onrender.com/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  const handleAddToCart = async () => {
    try {
      const res = await fetch("https://ecommerce-5gac.onrender.com/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ productId: product._id, quantity })
      });
      const data = await res.json();
      alert(data.message || "Added to cart!");
    } catch (err) {
      alert("Error adding to cart");
    }
  };

  return (
    <div className="container mt-4">
      <h2>{product.name}</h2>
      <img
        src={product.image || "https://via.placeholder.com/400"}
        alt={product.name}
        className="img-fluid mb-3"
        style={{ maxWidth: "400px" }}
      />
      <p><strong>Price:</strong> Rs {product.price}</p>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Stock:</strong> {product.stock}</p>

      {/* Quantity selector */}
      <div className="d-flex align-items-center mb-3">
        <button
          className="btn btn-warning btn-sm me-2"
          onClick={() => setQuantity(q => Math.max(1, q - 1))}
        >
          –
        </button>
        <span>{quantity}</span>
        <button
          className="btn btn-success btn-sm ms-2"
          onClick={() => setQuantity(q => q + 1)}
        >
          +
        </button>
      </div>

      {/* Add to Cart button */}
      {localStorage.getItem("token") && (
        <button className="btn btn-primary me-2" onClick={handleAddToCart}>
          Add to Cart
        </button>
      )}

      {/* Back button */}
      <button className="btn btn-secondary" onClick={() => navigate("/products")}>
        Back to Products
      </button>
    </div>
  );
}

export default ProductDetail;
