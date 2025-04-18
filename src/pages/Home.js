import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/register");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="container-fluid bg-light py-5">
      <div className="container text-center">
        <h1 className="display-4 text-primary mb-4">Welcome to the Quiz App</h1>
        <p className="lead mb-4">
          Test your knowledge with a wide range of quizzes! Choose your quiz
          type, challenge yourself, and track your progress.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-success btn-lg" onClick={handleRegister}>
            Register
          </button>

          <button className="btn btn-primary btn-lg" onClick={handleLogin}>
            Login
          </button>
      </div>
    </div>
    </div>
  );
};

export default HomePage;