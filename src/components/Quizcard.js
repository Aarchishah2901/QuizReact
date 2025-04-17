import React from "react";

const Quizcard = ({ quiz }) => {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title text-primary">{quiz.name}</h5>
        <p className="card-text">
          <strong>Type:</strong> {quiz.quiztype_name}
        </p>
        <button className="btn btn-outline-success">Apply for Quiz</button>
      </div>
    </div>
  );
};

export default Quizcard;