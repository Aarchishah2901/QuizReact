import React, { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      alert("Login Successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="form-control mb-2" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="form-control mb-2" />
        <button type="submit" className="btn btn-success">Login</button>
      </form>
    </div>
  );
};

export default Login;