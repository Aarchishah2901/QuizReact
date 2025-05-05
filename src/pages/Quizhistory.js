import React, { useEffect, useState } from 'react';
import { getQuizHistory } from '../services/api';

const QuizHistory = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.userId || storedUser?._id;
  
    console.log("UserID from localStorage (user object):", userId);
  
    if (!userId) {
      setError("User not logged in.");
      return;
    }
  
    const fetchHistory = async () => {
      try {
        const data = await getQuizHistory(userId);
        console.log("Fetched quiz history:", data);
        setHistory(data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
        setError("Error fetching quiz history.");
      }
    };
  
    fetchHistory();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Your Quiz History</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {!error && history.length === 0 ? (
        <p>No quiz attempts found.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Quiz</th>
              <th>Correct</th>
              <th>Incorrect</th>
              <th>Total Questions</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
              {history.map((record, index) => (
              <tr key={index}>
                <td>{record.quizId?.quiztype_name || 'Unknown Quiz'}</td>
                <td>{record.correctAnswers}</td>
                <td>{record.wrongAnswers}</td>
                <td>{record.correctAnswers + record.wrongAnswers}</td>
                <td>{new Date(record.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default QuizHistory;