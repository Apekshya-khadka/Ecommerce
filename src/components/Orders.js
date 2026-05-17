import React, { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("https://ecommerce-5gac.onrender.com/orders", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    fetchOrders();
  }, [token]);

  return (
    <div className="container mt-4">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No past orders found</p>
      ) : (
        orders.map((order, idx) => (
          <div key={order._id} className="card mb-3">
            <div className="card-body">
              <h5>Order #{idx + 1}</h5>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <ul className="list-group mb-3">
                {order.items.map((item, i) => (
                  <li key={i} className="list-group-item d-flex justify-content-between">
                    <span>{item.product?.name} (x{item.quantity})</span>
                    <span>Rs {item.total}</span>
                  </li>
                ))}
              </ul>
              <h6>Total: Rs {order.grandTotal}</h6>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;
