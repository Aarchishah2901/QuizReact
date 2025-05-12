import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Result = () => {
  const navigate = useNavigate();
  const { userId, quizId } = useParams();
  const location = useLocation();
  const timeTaken = location.state?.timeTaken || 0;

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    const fetchResult = async () => {
      const token = localStorage.getItem("token");

      if (!userId || !quizId || !token) {
        setError("Missing user or quiz information.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/results/result/${userId}/${quizId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setResult(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching results");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [userId, quizId]);

  const goToHistory = () => {
    navigate('/quiz-history');
  };

  const maxTimeInSeconds = result?.maxTime ?? 300;

  if (loading) return <div className="container mt-5 text-center"><h3>Loading...</h3></div>;
  if (error) return <div className="container mt-5 text-center text-danger"><h4>Error: {error}</h4></div>;

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4 display-4 font-weight-bold">Your Quiz Results</h2>
      
<div className="card shadow-lg mb-4">
  <div className="card-body">
    <h4 className="card-title text-center text-success mb-4">Quiz Summary</h4>
    <div className="d-flex justify-content-between flex-wrap text-center">
      <div className="px-3">
        <h6>Total Questions</h6>
        <div className="d-flex justify-content-center align-items-center border rounded-circle bg-light border-secondary" style={{ width: '100px', height: '100px' }}>
          <p className="h4 mb-0">{result?.totalQuestions ?? 'N/A'}</p>
        </div>
      </div>

      <div className="px-3">
        <h6>Correct Answers</h6>
        <div className="d-flex justify-content-center align-items-center border rounded-circle bg-light text-success border-success" style={{ width: '100px', height: '100px' }}>
          <p className="h4 mb-0">{result?.correctAnswers ?? 'N/A'}</p>
        </div>
      </div>

      <div className="px-3">
        <h6>Wrong Answers</h6>
        <div className="d-flex justify-content-center align-items-center border rounded-circle bg-light text-danger border-danger" style={{ width: '100px', height: '100px' }}>
          <p className="h4 mb-0">{result?.wrongAnswers ?? 'N/A'}</p>
        </div>
      </div>

      <div className="px-3">
        <h6>Score Percentage</h6>
        <div className="position-relative d-flex justify-content-center align-items-center" style={{ width: '100px', height: '100px' }}>
          <svg width="100" height="100">
            <circle cx="50" cy="50" r="45" stroke="#f0f0f0" strokeWidth="10" fill="none" />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#ffc107"
              strokeWidth="10"
              fill="none"
              strokeDasharray={2 * Math.PI * 45}
              strokeDashoffset={(1 - (result?.score ?? 0) / 100) * 2 * Math.PI * 45}
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <p className="h4 text-warning position-absolute mb-0">{result?.score != null ? `${result.score}%` : 'N/A'}</p>
        </div>
      </div>

      <div className="px-3">
      <h6>Time Taken</h6>
        <div className="position-relative d-flex justify-content-center align-items-center" style={{ width: '100px', height: '100px' }}>
        <svg width="100" height="100">
      <circle cx="50" cy="50" r="45" stroke="#f0f0f0" strokeWidth="10" fill="none" />
      <circle
        cx="50"
        cy="50"
        r="45"
        stroke="#17a2b8"
        strokeWidth="10"
        fill="none"
        strokeDasharray={2 * Math.PI * 45}
        strokeDashoffset={(1 - (timeTaken / maxTimeInSeconds)) * 2 * Math.PI * 45}
        transform="rotate(-90 50 50)"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
    </svg>
    <p className="h4 text-info position-absolute mb-0">{formatTime(timeTaken)}</p>
  </div>
</div>
    </div>
  </div>
</div>

      {result?.answers?.length > 0 && (
        <div className="card shadow-lg">
          <div className="card-body">
            <h4 className="card-title text-center text-primary mb-3">Answer Breakdown</h4>
            <table className="table table-hover table-striped">
              <thead className="thead-dark">
                <tr>
                  <th>Sr.No</th>
                  <th>Question</th>
                  <th>Your Answer</th>
                  <th>Correct Answer</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {result.answers.map((answer, index) => (
                  <tr key={index} className={answer.isCorrect ? 'table-success' : 'table-danger'}>
                    <td>{index + 1}</td>
                    <td>{answer.questionText}</td>
                    <td>{answer.selectedOption}</td>
                    <td>{answer.correctAnswer}</td>
                    <td className="text-center">
                      {answer.isCorrect ? (
                        <span className="badge badge-success">Correct</span>
                      ) : (
                        <span className="badge badge-danger">Incorrect</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="text-center mt-3 mb-4">
        <button className="btn btn-outline-primary" onClick={goToHistory}>View Quiz History</button>
      </div>
    </div>
  );
};

export default Result;