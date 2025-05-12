import React from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleViewQuiz = () => {
    navigate("/quiz");
  };

  const handleViewHistory = () => {
    navigate("/quiz-history");
  };

  return (
    <div className="container mt-5">

      <ToastContainer position="top-right" autoClose={2000} />
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary mb-3">
          Welcome to the Ultimate Quiz Challenge
        </h1>
        <p className="lead text-secondary mb-4">
          Ready to test your knowledge? Dive into a world of interactive quizzes designed to challenge and educate.
        </p>
        <p className="text-muted mb-4">
          Our quizzes cover various topics in IT, catering to all skill levels. Whether you're a beginner or an expert, you'll always find something to learn.
        </p>

        <div
          className="p-4 rounded shadow-sm mb-5"
          style={{
            background: "linear-gradient(to top, #f1f1f1, #ffffff)",
            borderLeft: "5px solid #17a2b8"
          }}
        >
          <p className="fs-5 text-dark mb-1">
            "Knowledge is power, but enthusiasm pulls the switch." – Ivern Ball
          </p>
          <p className="text-muted mb-0">
            Embrace the challenge and let learning be your adventure.
          </p>
        </div>

        <div className="mb-5">
          <h2 className="text-info mb-3">Why Take a Quiz?</h2>
          <p className="fs-5 text-dark mb-4">
            Quizzes are an effective way to reinforce learning, test your memory, and enjoy the process of education.
          </p>
          <ul className="fs-5 text-dark list-group list-group-flush mb-5">
            <li className="list-group-item">Reinforce your understanding of IT concepts.</li>
            <li className="list-group-item">Enhance your critical thinking and problem-solving abilities.</li>
            <li className="list-group-item">Track your performance and progress over time.</li>
            <li className="list-group-item">Receive instant feedback to improve your skills.</li>
          </ul>
        </div>

        <div className="d-flex justify-content-center gap-4 mt-4 mb-5">
          <button className="btn btn-success btn-lg px-5 fw-bold" onClick={handleViewQuiz}>
            Start Quiz
          </button>
          <button className="btn btn-outline-primary btn-lg px-5 fw-bold" onClick={handleViewHistory}>
            View Quiz History
          </button>
        </div>
      </div>

      <div className="row text-center mb-5">
        <div className="col-md-4 mb-4">
          <div
            className="card shadow-lg border-0"
            style={{
              background: "linear-gradient(to top, #e2e6ea, #ffffff)",
              borderRadius: "12px",
              height: "100%",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
            }}
          >
            <div className="card-body">
              <h4 className="card-title text-primary">Interactive Learning</h4>
              <p className="card-text">
                Engage with well-crafted questions designed to help you understand and apply key concepts.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div
            className="card shadow-lg border-0"
            style={{
              background: "linear-gradient(to top, #e2e6ea, #ffffff)",
              borderRadius: "12px",
              height: "100%",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
            }}
          >
            <div className="card-body">
              <h4 className="card-title text-primary">Competitive Scoring</h4>
              <p className="card-text">
                Track your scores and compete for the top positions in quizzes. Challenge yourself to beat your previous records.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div
            className="card shadow-lg border-0"
            style={{
              background: "linear-gradient(to top, #e2e6ea, #ffffff)",
              borderRadius: "12px",
              height: "100%",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
            }}
          >
            <div className="card-body">
              <h4 className="card-title text-primary">Progress Tracking</h4>
              <p className="card-text">
                Keep track of your performance, review your mistakes, and see how much you've improved.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="text-center mt-5 text-muted">
        <p>© 2025 Ultimate Quiz Challenge. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;