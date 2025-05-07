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
      <div className="container d-flex flex-column flex-lg-row align-items-center justify-content-between">
        <div className="text-center text-lg-start mb-4 mb-lg-0">
          <h1 className="display-4 text-primary mb-4">Welcome to the Quiz App</h1>
          <p className="lead mb-4">
            Test your knowledge with a wide range of quizzes! Choose your quiz
            type, challenge yourself, and track your progress.
          </p>
          <div className="d-flex justify-content-center justify-content-lg-start gap-3">
            <button className="btn btn-success btn-lg" onClick={handleRegister}>
              Register
            </button>
            <button className="btn btn-primary btn-lg" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
        <div className="text-center">
          <img
            src="https://thumbs.dreamstime.com/z/interactive-quiz-design-professional-designing-interactive-quiz-tablet-surrounded-colorful-postit-notes-366330798.jpg?ct=jpeg"
            alt="Career Quiz Banner"
            className="img-fluid"
            style={{ maxWidth: "500px", borderRadius: "12px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;