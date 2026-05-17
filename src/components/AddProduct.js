// src/components/AddProduct.js
import React, { useState } from "react";

function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    description: "",
    category: "",
    stock: "",
    image: ""
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Frontend validation
  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Product name is required";
    if (!formData.price || formData.price <= 0) newErrors.price = "Price must be greater than 0";
    if (formData.originalPrice && formData.originalPrice <= 0) newErrors.originalPrice = "Original price must be greater than 0";
    if (!formData.description || formData.description.length < 10) newErrors.description = "Description must be at least 10 characters";
    if (!formData.category) newErrors.category = "Category is required";
    if (formData.stock === "" || formData.stock < 0) newErrors.stock = "Stock must be non-negative";
    if (formData.image && !/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(formData.image)) {
      newErrors.image = "Image must be a valid URL (jpg, jpeg, png, gif)";
    }
    return newErrors;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run validation
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (!token || role !== "admin") {
        setMessage(" Access denied: Admins only");
        return;
      }

      const res = await fetch("https://ecommerce-5gac.onrender.com/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add product");

      setMessage(" Product added successfully!");
      console.log("Product added:", data);

      // Reset form
      setFormData({
        name: "",
        price: "",
        originalPrice: "",
        description: "",
        category: "",
        stock: "",
        image: ""
      });
      setErrors({});
    } catch (err) {
      setMessage("❌ Error adding product");
      console.error(err);
    }
  };

  if (role !== "admin") {
    return <p className="text-danger">Access denied: Admins only</p>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Add Product</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit} className="row g-3">
        {["name", "price", "originalPrice", "description", "category", "stock", "image"].map((field) => (
          <div className="col-md-6" key={field}>
            <input
              type={field === "price" || field === "originalPrice" || field === "stock" ? "number" : "text"}
              name={field}
              className="form-control"
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData[field]}
              onChange={handleChange}
              required={["name", "price", "description", "category", "stock"].includes(field)}
            />
            {errors[field] && <small className="text-danger">{errors[field]}</small>}
          </div>
        ))}
        <div className="col-12">
          <button type="submit" className="btn btn-primary">Add Product</button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
