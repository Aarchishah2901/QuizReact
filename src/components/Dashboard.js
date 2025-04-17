import React from "react";
import { useNavigate } from "react-router-dom";
import Quizcard from "./Quizcard";

const Dashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="container mt-5">
      <h2>Welcome to Dashboard</h2>
      <p>Role: <strong>{role}</strong></p>
      
      {role === "admin" ? <p>You have admin privileges.</p> : <p>You are a standard user.</p>}

      <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      <Quizcard />
    </div>
  );
};

export default Dashboard;