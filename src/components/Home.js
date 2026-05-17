import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <div className="text-center p-5 bg-light rounded shadow-sm mb-4">
        <h2 className="fw-bold">Your One‑Stop Tech Store</h2>
        <p className="lead">Laptops, Smartphones, and Machinery — all in one place.</p>
        <Link to="/products" className="btn btn-primary btn-lg mt-3">Shop Now</Link>
      </div>

      <div className="row text-center">
        <div className="col-md-3 mb-3">
          <i className="bi bi-laptop fs-1 text-info"></i>
          <h5 className="mt-2">Laptops</h5>
          
        </div>
        <div className="col-md-3 mb-3">
          <i className="bi bi-phone fs-1 text-success"></i>
          <h5 className="mt-2">Smartphones</h5>
          
        </div>
        <div className="col-md-3 mb-3">
          <i className="bi bi-gear fs-1 text-warning"></i>
          <h5 className="mt-2">Machinery</h5>
          
        </div>
        <div className="col-md-3 mb-3">
          <i className="bi bi-controller fs-1 text-danger"></i>
          <h5 className="mt-2">Gaming</h5>
          
        </div>
      </div>
    </div>
  );
}

export default Home;
