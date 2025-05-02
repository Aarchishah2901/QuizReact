import React, { useEffect, useState } from 'react';
import { getQuizHistory } from '../services/api';

const QuizHistory = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchHistory = async () => {
      console.log("userId from localStorage:", userId);
      if (!userId || userId === "null") {
        setError("User not logged in.");
        return;
      }
  
      try {
        const data = await getQuizHistory(userId);
        setHistory(data);
      } catch (err) {
        console.error("Failed to fetch history", err);
      }
    };
  
    fetchHistory();
  }, [userId]);

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
                <td>{record.correctAnswers.length}</td>
                <td>{record.incorrectAnswers.length}</td>
                <td>{record.correctAnswers.length + record.incorrectAnswers.length}</td>
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