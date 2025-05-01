import React, { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      toast.success("Login Successful!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Invalid Credentials");
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer position="top-right" autoClose={2000} />
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="form-control mb-2"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="form-control mb-2"
        />
        <button type="submit" className="btn btn-success">Login</button>
      </form>
    </div>
  );
};

export default Login;

// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify'; // Import toast

// const Navbar = () => {
//   const navigate = useNavigate();
//   const user = JSON.parse(localStorage.getItem('user'));  // Get user data from localStorage

//   const handleLogout = () => {
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//     localStorage.removeItem('role');
//     toast.success('Logged out successfully!');
//     navigate('/login');
//   };

//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
//       <div className="container">
//         <Link className="navbar-brand" to="/">Quiz App</Link>
//         <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
//           <span className="navbar-toggler-icon" />
//         </button>
//         <div className="collapse navbar-collapse" id="navbarNav">
//           <ul className="navbar-nav ms-auto">
//             {user ? (
//               <>
//                 <li className="nav-item">
//                   <span className="nav-link text-white fw-bold">
//                     Welcome, {user.firstname}  {/* Display the first name */}
//                   </span>
//                 </li>
//                 <li className="nav-item">
//                   <button className="btn btn-light btn-md ms-2 px-4 fw-bold" onClick={handleLogout}>
//                     Logout
//                   </button>
//                 </li>
//               </>
//             ) : (
//               <>
//                 <li className="nav-item me-2">
//                   <Link to="/login">
//                     <button className="btn btn-light btn-md px-4 fw-bold">
//                       Login
//                     </button>
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link to="/register">
//                     <button className="btn btn-outline-light btn-md px-4 fw-bold">
//                       Register
//                     </button>
//                   </Link>
//                 </li>
//               </>
//             )}
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;