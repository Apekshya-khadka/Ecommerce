// src/components/Cart.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Cart({ cartItems, setCartItems }) {
  const [orderDetails, setOrderDetails] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("https://ecommerce-5gac.onrender.com/cart", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setCartItems(data || []);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };
    fetchCart();
  }, [token, setCartItems]);

  
  const handleRemove = async (id) => {
    try {
      await fetch(`http://localhost:5000/cart/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(cartItems.filter(item => item._id !== id));
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  // (send to /orders)
  const handleCheckout = async () => {
    try {
      const grandTotal = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      const items = cartItems.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        total: item.product.price * item.quantity
      }));

      const res = await fetch("https://ecommerce-5gac.onrender.com/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ items, grandTotal })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Checkout failed");

      setOrderDetails(data.order);
      setCartItems([]); // clear cart after checkout
      navigate("/orders"); // redirect to orders page
    } catch (err) {
      console.error("Error during checkout:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          <ul className="list-group mb-3">
            {cartItems.map((item) => (
              <li key={item._id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{item.product.name} (x{item.quantity})</span>
                <div>
                  <span className="me-3">Rs {item.product.price * item.quantity}</span>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemove(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button className="btn btn-success" onClick={handleCheckout}>
            Checkout
          </button>
        </>
      )}

      {/* Show order details after checkout (optional) */}
      {orderDetails && (
        <div className="mt-4">
          <h4>Order Placed</h4>
          <ul className="list-group mb-3">
            {orderDetails.items.map((item, idx) => (
              <li key={idx} className="list-group-item d-flex justify-content-between">
                <span>{item.product?.name} (x{item.quantity})</span>
                <span>Rs {item.total}</span>
              </li>
            ))}
          </ul>
          <h5>Total: Rs {orderDetails.grandTotal}</h5>
        </div>
      )}
    </div>
  );
}

export default Cart;
