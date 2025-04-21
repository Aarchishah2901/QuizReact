import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";

const QuizPage = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          const decoded = jwtDecode(token);
          setUserRole(decoded.role);
        }

        const response = await axios.get(
          `http://localhost:5000/api/quiz-types/quiz-types`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        console.log("Fetched quizzes by type:", response.data);
        setQuizzes(response.data || []);
      } catch (err) {
        console.error("Error fetching quizzes by type:", err);
        if (err.response && err.response.status === 401) {
          setError("Unauthorized. Please log in again.");
        } else {
          setError("Failed to load quizzes");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Available Quizzes</h2>

      {userRole === "admin" && (
        <div className="text-center mb-4">
          <button className="btn btn-primary">Add New Quiz</button>
        </div>
      )}

      {loading ? (
        <p className="text-center text-secondary">Loading quizzes...</p>
      ) : error ? (
        <p className="text-center text-danger">{error}</p>
      ) : quizzes.length === 0 ? (
        <p className="text-center text-muted">No quizzes found.</p>
      ) : (
        <div className="row">
          {quizzes.map((quiz) => (
            <div className="col-md-4 mb-4" key={quiz._id}>
              <div
                className="card text-white bg-success mb-3"
                style={{ maxWidth: "18rem" }}
              >
                <div className="card-header">{quiz.quiztype_name || "Quiz"}</div>
                <div className="card-body">
                  <h5 className="card-title">{quiz.quiz_name || ""}</h5>
                  <p className="card-text">
                    Take this quiz to test your knowledge!
                  </p>
                  <Link to={`/questions/${quiz._id}`}>
                  <button className="btn btn-light w-100">Apply for Quiz</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizPage;