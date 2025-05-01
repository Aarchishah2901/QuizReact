import React from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleViewQuiz = () => {
    navigate("/quiz");
  };

  return (
    <div className="container mt-5">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Hero Section */}
      <div className="text-center mb-4">
        <h1 className="display-5 fw-bold text-primary animate__animated animate__fadeIn">
          Welcome to the Ultimate Quiz Challenge!
        </h1>
        <p className="lead mt-3 text-secondary animate__animated animate__fadeIn animate__delay-1s">
          Are you ready to test your knowledge? Step into the world of exciting quizzes, filled with challenges and fun!
        </p>
        <p className="text-muted animate__animated animate__fadeIn animate__delay-2s">
          Our quizzes cover a wide range of topics — from the basics to advanced concepts, especially focused on the IT field. Whether you're a beginner or an expert, there's something for everyone.
        </p>

        {/* Inspirational Thought */}
        <div className="my-4 p-4 rounded bg-light border shadow-sm animate__animated animate__fadeIn animate__delay-3s">
          <p className="fs-5 text-center text-dark">
            "Knowledge is power, but enthusiasm pulls the switch." – Ivern Ball
          </p>
          <p className="text-center text-muted">Embrace the challenge, and let's make learning a thrilling adventure!</p>
        </div>

        {/* Quizzes Description */}
        <div className="my-5">
          <h2 className="text-info mb-3 animate__animated animate__fadeIn animate__delay-4s">Why Take a Quiz?</h2>
          <p className="fs-5 text-dark animate__animated animate__fadeIn animate__delay-4.5s">
            Quizzes are an effective way to reinforce knowledge, test your memory, and have fun while learning. They help you:
          </p>
          <ul className="fs-5 text-dark list-group list-group-flush animate__animated animate__fadeIn animate__delay-5s">
            <li className="list-group-item">🔍 Deepen your understanding of key concepts in IT and beyond.</li>
            <li className="list-group-item">🧠 Sharpen your problem-solving and critical thinking skills.</li>
            <li className="list-group-item">🏆 Compete for high scores and track your progress over time.</li>
            <li className="list-group-item">📈 Get instant feedback to know where you stand and improve.</li>
          </ul>
        </div>

        {/* Call to Action */}
        <div className="d-flex justify-content-center mt-4">
          <button className="btn btn-success btn-lg px-5 fw-bold" onClick={handleViewQuiz}>
            Start Your Quiz Journey
          </button>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="row text-center mt-5">
        <div className="col-md-4">
          <div className="card shadow-lg border-light mb-4">
            <div className="card-body">
              <h3 className="card-title text-primary">Interactive Learning</h3>
              <p className="card-text">
                Engage with questions designed to enhance your understanding and keep you challenged.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-lg border-light mb-4">
            <div className="card-body">
              <h3 className="card-title text-primary">Compete & Score</h3>
              <p className="card-text">
                Compare your results with others, compete for high scores, and become a quiz master.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-lg border-light mb-4">
            <div className="card-body">
              <h3 className="card-title text-primary">Track Your Progress</h3>
              <p className="card-text">
                Keep track of your performance and see how much you've improved over time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="text-center mt-5 mb-4 text-muted">
        <p>© 2025 Ultimate Quiz Challenge. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;