import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Checkout({ cartItems }) {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleCheckout = async () => {
    try {
      const grandTotal = cartItems.reduce((sum, item) => sum + item.total, 0);

      const res = await fetch("https://ecommerce-5gac.onrender.com/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ items: cartItems, grandTotal })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Checkout failed");

      setMessage(" Order placed successfully!");
      navigate("/orders"); // redirect to orders page
    } catch (err) {
      setMessage(" Error placing order");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Checkout</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <button onClick={handleCheckout} className="btn btn-success">
        Place Order
      </button>
    </div>
  );
}

export default Checkout;
