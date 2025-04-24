import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Result = () => {
  // Example static data — later replace with dynamic props or API response
  const totalQuestions = 10;
  const correctAnswers = 7;
  const wrongAnswers = totalQuestions - correctAnswers;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary">Quiz Results</h1>
        <p className="lead text-muted">Here's how you performed in your quiz!</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-0">
            <div className="card-body p-4">
              <div className="mb-4 text-center">
                <span className={`badge ${percentage >= 60 ? 'bg-success' : 'bg-danger'} fs-5`}>
                  Score: {percentage}%
                </span>
              </div>

              <div className="row text-center mb-4">
                <div className="col">
                  <h5>Total Questions</h5>
                  <p className="fs-3 text-primary fw-semibold">{totalQuestions}</p>
                </div>
                <div className="col">
                  <h5>Correct Answers</h5>
                  <p className="fs-3 text-success fw-semibold">{correctAnswers}</p>
                </div>
                <div className="col">
                  <h5>Wrong Answers</h5>
                  <p className="fs-3 text-danger fw-semibold">{wrongAnswers}</p>
                </div>
              </div>

              <hr />

              <div className="text-center">
                <a href="/" className="btn btn-outline-primary px-4 mt-3">
                  Back to Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;