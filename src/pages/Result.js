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
          `http://localhost:5000/api/results/result/${userId}/${quizId}`,
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
              <p className="h4">{result?.totalQuestions ?? 'N/A'}</p>
            </div>
            <div className="px-3">
              <h6>Correct Answers</h6>
              <p className="h4 text-success">{result?.correctAnswers ?? 'N/A'}</p>
            </div>
            <div className="px-3">
              <h6>Wrong Answers</h6>
              <p className="h4 text-danger">{result?.wrongAnswers ?? 'N/A'}</p>
            </div>
            <div className="px-3">
              <h6>Score</h6>
              <p className="h4 text-warning">{result?.score ?? 'N/A'}</p>
            </div>
            <div className="px-3">
              <h6>Time Taken</h6>
              <p className="h4 text-info">{formatTime(timeTaken)}</p>
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
                  <th>#</th>
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

      <div className="text-center mt-5">
        <button className="btn btn-outline-primary" onClick={goToHistory}>View Quiz History</button>
      </div>
    </div>
  );
};

export default Result;