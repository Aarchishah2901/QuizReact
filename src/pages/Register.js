import React, { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    gender: "",
    phone_number: "",
    role: "user", // Default role
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data Sent:", formData); 
    try {
      await registerUser(formData);
      toast.success("Registration Successful!", {
        onClose: () => navigate("/login"),
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error(error.response?.data?.message || "Error registering user");
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer position="top-right" />
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="firstname" placeholder="First Name" onChange={handleChange} required className="form-control mb-2" />
        <input type="text" name="lastname" placeholder="Last Name" onChange={handleChange} required className="form-control mb-2" />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="form-control mb-2" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="form-control mb-2" />
        <select name="gender" onChange={handleChange} required className="form-control mb-2">
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input type="text" name="phone_number" placeholder="Phone Number" onChange={handleChange} required className="form-control mb-2" />
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
};

export default Register;