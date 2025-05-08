import React, { useEffect, useState } from "react";
import { getQuizHistory } from "../services/api";
import { Spinner, Dropdown, DropdownButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const QuizHistory = () => {
  const [history, setHistory] = useState([]);
  const [quizTypes, setQuizTypes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [userTopScores, setUserTopScores] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.userId || storedUser?._id;

    
    if (!userId) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        const data = await getQuizHistory(userId);
        setHistory(data);

        const uniqueQuizTypes = [];
        const seen = new Set();

        data.forEach((record) => {
          const quizName = record.quizId?.quiztype_name;
          const quizId = record.quizId?._id;

          if (quizId && !seen.has(quizId)) {
            seen.add(quizId);
            uniqueQuizTypes.push({ id: quizId, name: quizName });
          }
        });
          console.log("hello",uniqueQuizTypes);
          
        setQuizTypes(uniqueQuizTypes);
        console.log("function",quizTypes);
      } catch (err) {
        console.error("Error fetching quiz history:", err);
        setError("Failed to fetch quiz history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleNavigateQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  const handleViewTopScores = (quizId) => {
    setSelectedQuizId(quizId);
    const userScores = history
      .filter((record) => record.quizId?._id === quizId)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    setUserTopScores(userScores);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-primary">Quiz Attempt History</h2>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : (
        <>
          <div className="d-flex justify-content-between mb-4 flex-wrap gap-3">
            <DropdownButton
              id="quiz-navigate-dropdown"
              title="Take a Quiz"
              onSelect={handleNavigateQuiz}
              variant="outline-primary"
            >
              {quizTypes.map((quiz) => (
                <Dropdown.Item key={quiz.id} eventKey={quiz.id}>
                  {quiz.name}
                </Dropdown.Item>
              ))}
            </DropdownButton>
            <div className="d-flex justify-content-end mb-3">
              <button className="btn btn-primary" onClick={() => navigate("/quiz")}>View Quiz</button>
            </div>
            <DropdownButton
              id="top-scores-dropdown"
              title="View My Top Scores"
              onSelect={handleViewTopScores}
              variant="outline-success"
            >
              {quizTypes.map((quiz) => (
                <Dropdown.Item key={quiz.id} eventKey={quiz.id}>
                  {quiz.name}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </div>
          {selectedQuizId && userTopScores.length > 0 && (
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-success text-white fw-bold">
              Your Scores for:{" "}
            {quizTypes.find((q) => q.id === selectedQuizId)?.name}
          </div>
        <div className="card-body">
          <table className="table table-bordered text-center mb-0">
            <thead className="table-success">
              <tr>
                <th>Sr.No</th>
                <th>Score</th>
                <th>Date</th>
              </tr>
            </thead>
        <tbody>
          {userTopScores.map((record, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{record.score}</td>
              <td>{new Date(record.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}
          <div className="table-responsive">
            <table className="table table-bordered table-hover shadow-sm">
              <thead className="table-primary text-center">
                <tr>
                  <th>Sr.No</th>
                  <th>Quiz Name</th>
                  <th>Correct</th>
                  <th>Incorrect</th>
                  <th>Total Questions</th>
                  <th>Score</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record, index) => (
                  <tr key={index} className="text-center">
                    <td>{index + 1}</td>
                    <td>{record.quizId?.quiztype_name || "Unknown"}</td>
                    <td className="text-success fw-bold">{record.correctAnswers}</td>
                    <td className="text-danger fw-bold">{record.wrongAnswers}</td>
                    <td>{record.totalQuestions}</td>
                    <td>{record.score}</td>
                    <td>{new Date(record.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default QuizHistory;