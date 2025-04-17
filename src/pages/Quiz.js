import React, { useEffect, useState } from "react";
import { getAllQuizzes } from "../services/api";

const QuizPage = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await getAllQuizzes();
        console.log("Full Response:", response);
        setQuizzes(response.data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };
  
    fetchQuizzes();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Available Quizzes</h2>
      <div className="row">
        {quizzes.length === 0 ? (
          <div className="col-12 text-center text-muted">No quizzes found.</div>
        ) : (
          quizzes.map((quiz) => (
            <div className="col-md-4 mb-4" key={quiz._id}>
              <div className="card h-100 shadow-sm border-primary">
                <div className="card-body">
                  <h5 className="card-title text-primary">{quiz.quiz_name}</h5> {/* Fixed field */}
                  <p className="card-text">
                    <strong>Type:</strong> {quiz.quiztype_name}
                  </p>
                  <button className="btn btn-outline-primary w-100">
                    Apply for Quiz
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QuizPage;