import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Result = () => {
  const { userId, quizId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/api/results/result/${userId}/${quizId}`, {
          headers: {
            Authorization: `Bearer ${token}`,  // Ensure the token is being passed correctly
          },
        });

        console.log("API Response:", response.data); // Log the response to inspect the structure
        setResult(response.data); // Ensure you're setting the correct data
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching results');
        setLoading(false);
      }
    };

    fetchResult();
  }, [userId, quizId]);

  if (loading) return <div className="container mt-5 text-center"><h3>Loading...</h3></div>;
  if (error) return <div className="container mt-5 text-center text-danger"><h4>Error: {error}</h4></div>;

  // Log result to debug
  console.log("Result Data:", result);

  return (
    <div className="container mt-5">
      {/* Title */}
      <h2 className="text-center text-primary mb-4 display-4 font-weight-bold">Your Quiz Results</h2>
  
      {/* Summary Section */}
      <div className="card shadow-lg mb-4">
        <div className="card-body">
          <h4 className="card-title text-center text-success mb-3">Quiz Summary</h4>
          <div className="row text-center">
            <div className="col-12 col-md-3 mb-3">
              <h5>Total Questions</h5>
              <p className="display-4">{result?.totalQuestions ?? 'N/A'}</p>
            </div>
            <div className="col-12 col-md-3 mb-3">
              <h5>Correct Answers</h5>
              <p className="display-4 text-success">{result?.correctAnswers ?? 'N/A'}</p>
            </div>
            <div className="col-12 col-md-3 mb-3">
              <h5>Wrong Answers</h5>
              <p className="display-4 text-danger">{result?.wrongAnswers ?? 'N/A'}</p>
            </div>
            <div className="col-12 col-md-3 mb-3">
              <h5>Score</h5>
              <p className="display-4 text-warning">{result?.score ?? 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
  
      {/* Answer Breakdown Section */}
      {result?.answers && result.answers.length > 0 && (
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
    </div>
  );
}

export default Result;