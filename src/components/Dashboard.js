import React from "react";
import { useNavigate } from "react-router-dom";
// import Quizcard from "./Quizcard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.success("Logged out successfully!");
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  const handleViewQuiz = () => {
    navigate("/quiz");
  };

  return (
    <div className="container mt-5">
      <ToastContainer position="top-right" autoClose={2000} />

      <h2 className="text-center">Welcome to Dashboard</h2>
      <p className="text-center">
        Role: <strong>{role}</strong>
      </p>

      {role === "admin" ? (
        <p className="text-center">You have admin privileges.</p>
      ) : (
        <p className="text-center">You are a standard user.</p>
      )}

      <div className="d-flex justify-content-center gap-3 mt-3">
        <button className="btn btn-primary" onClick={handleViewQuiz}>
          View Quizzes
        </button>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* <Quizcard /> */}
    </div>
  );
};

export default Dashboard;