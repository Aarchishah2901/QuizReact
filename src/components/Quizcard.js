import React from "react";

const Quizcard = ({ quiz }) => {
  if (!quiz) {
    return (
      <div className="card shadow-lg mb-4 hover-effect" style={{ maxWidth: "18rem" }}>
        <div className="card-body text-center">
          <h5 className="card-title text-danger">Quiz data not available</h5>
          <p className="card-text text-muted">Oops! The quiz information is missing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-lg mb-4 hover-effect" style={{ maxWidth: "18rem" }}>
      <div className="card-body text-center">
        <h5 className="card-title text-primary mb-3">
          {quiz?.name || "Untitled Quiz"}
        </h5>
        <p className="card-text text-muted">
          <strong>Type:</strong> {quiz?.quiztype_name || "N/A"}
        </p>

        <button className="btn btn-outline-success w-100 mt-3" style={{ borderRadius: "20px" }}>
          <i className="bi bi-pencil-square"></i> Apply for Quiz
        </button>
      </div>
    </div>
  );
};

export default Quizcard;