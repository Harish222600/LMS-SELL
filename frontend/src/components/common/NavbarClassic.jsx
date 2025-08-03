import React from "react";
import { Link } from "react-router-dom";

const NavbarClassic = () => {
  return (
    <nav style={{ backgroundColor: "#f8f8f8", borderBottom: "1px solid #ccc", padding: "10px 20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <Link to="/" style={{ textDecoration: "none", color: "#333", fontWeight: "bold", fontSize: "24px" }}>
            Classic LMS
          </Link>
        </div>
        <ul style={{ listStyle: "none", display: "flex", gap: "20px", margin: 0, padding: 0 }}>
          <li>
            <Link to="/" style={{ textDecoration: "none", color: "#333" }}>Home</Link>
          </li>
          <li>
            <Link to="/courses" style={{ textDecoration: "none", color: "#333" }}>Courses</Link>
          </li>
          <li>
            <Link to="/about" style={{ textDecoration: "none", color: "#333" }}>About</Link>
          </li>
          <li>
            <Link to="/contact" style={{ textDecoration: "none", color: "#333" }}>Contact</Link>
          </li>
          <li>
            <Link to="/login" style={{ textDecoration: "none", color: "#333" }}>Login</Link>
          </li>
          <li>
            <Link to="/signup" style={{ textDecoration: "none", color: "#333" }}>Signup</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavbarClassic;
