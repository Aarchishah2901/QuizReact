// import React, { useEffect, useState } from "react";
// import { getQuizHistory } from "../services/api";
// import { Spinner } from "react-bootstrap";

// const QuizHistory = () => {
//   const [history, setHistory] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem("user"));
//     const userId = storedUser?.userId || storedUser?._id;

//     if (!userId) {
//       setError("User not logged in.");
//       setLoading(false);
//       return;
//     }

//     const fetchHistory = async () => {
//       try {
//         const data = await getQuizHistory(userId);
//         console.log("Quiz histroy data", data);
        
//         setHistory(data);
//       } catch (err) {
//         console.error("Error fetching quiz history:", err);
//         setError("Failed to fetch quiz history.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHistory();
//   }, []);

//   return (
//     <div className="container mt-5">
//       <h2 className="text-center mb-4 text-primary">Quiz Attempt History</h2>

//       {loading ? (
//         <div className="text-center my-5">
//           <Spinner animation="border" variant="primary" />
//         </div>
//       ) : error ? (
//         <div className="alert alert-danger text-center">{error}</div>
//       ) : history.length === 0 ? (
//         <div className="alert alert-info text-center">No quiz history found.</div>
//       ) : (
//         <div className="table-responsive">
//           <table className="table table-bordered table-hover shadow-sm">
//             <thead className="table-primary text-center">
//               <tr>
//                 <th>Sr.No</th>
//                 <th>Quiz Name</th>
//                 <th>Correct</th>
//                 <th>Incorrect</th>
//                 <th>Total Questions</th>
//                 <th>Score</th>
//                 <th>Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {history.map((record, index) => (
//                 <tr key={index} className="text-center">
//                   <td>{index + 1}</td>
//                   <td>{record.quizId?.quiztype_name || "Unknown Quiz"}</td>
//                   <td className="text-success fw-bold">{record.correctAnswers}</td>
//                   <td className="text-danger fw-bold">{record.wrongAnswers}</td>
//                   <td>{record.totalQuestions}</td>
//                   <td>{record.score}</td>
//                   <td>{new Date(record.createdAt).toLocaleString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuizHistory;

import React, { useEffect, useState } from "react";
import { getQuizHistory } from "../services/api";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const QuizHistory = () => {
  const [history, setHistory] = useState([]);
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
        console.log("Quiz history data", data);
        setHistory(data);
      } catch (err) {
        console.error("Error fetching quiz history:", err);
        setError("Failed to fetch quiz history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // ✅ Navigate to quiz page (e.g. first quiz in list, or hardcoded quiz ID)
  const handleTakeQuiz = () => {
    // Replace this logic with how you determine which quiz to take
    const quizId = history[0]?.quizId?._id || "defaultQuizId";
    navigate(`/quiz`);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-primary">Quiz Attempt History</h2>
      <div className="d-flex justify-content-center mt-4">
    <div className="p-4 bg-light rounded shadow-sm" style={{ minWidth: "250px", textAlign: "center" }}>
      <button className="btn btn-success btn-lg px-5 shadow" onClick={handleTakeQuiz} style={{ borderRadius: "30px" }} >
        View Quiz
      </button>
    </div>
    </div>
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : history.length === 0 ? (
        <div className="alert alert-info text-center">No quiz history found.</div>
      ) : (
        <>
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
                    <td>{record.quizId?.quiztype_name || "Unknown Quiz"}</td>
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