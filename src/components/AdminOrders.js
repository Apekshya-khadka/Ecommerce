import React, { useEffect, useState } from "react";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("https://ecommerce-5gac.onrender.com/orders/admin", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching admin orders:", err);
      }
    };
    fetchOrders();
  }, [token]);

  return (
    <div className="container mt-4">
      <h2>All Orders (Admin)</h2>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Products</th>
              <th>Grand Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order.user?.name}</td>
                <td>{order.user?.email}</td>
                <td>
                  <ul className="list-unstyled">
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.product?.name} (x{item.quantity}) — Rs {item.total}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>Rs {order.grandTotal}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminOrders;
