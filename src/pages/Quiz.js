// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import { Link } from "react-router-dom";

// const QuizPage = () => {
//   const [quizzes, setQuizzes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [userRole, setUserRole] = useState(null);
//   const [takenQuizIds, setTakenQuizIds] = useState([]);

//   useEffect(() => {
//     const fetchQuizzes = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         if (token) {
//           const decoded = jwtDecode(token);
//           setUserRole(decoded.role);
//         }

//         const response = await axios.get(
//           `http://localhost:5000/api/quiz-types/quiz-types`,
//           {
//             headers: {
//               Authorization: `${token}`,
//             },
//           }
//         );

//         const fetchedQuizzes = response.data || [];
//         setQuizzes(fetchedQuizzes);

//         const userId = localStorage.getItem("userId");
//         const taken = await Promise.all(
//           fetchedQuizzes.map((quiz) =>
//             axios
//               .get(`http://localhost:5000/api/results/result/${userId}/${quiz._id}`, {
//                 headers: {
//                   Authorization: `${token}`,
//                 },
//               })
//               .then(() => quiz._id)
//               .catch((err) => {
//                 if (err.response && err.response.status === 404) {
//                   return null;
//                 } else {
//                   console.error("Error checking quiz status:", err);
//                   return null;
//                 }
//               })
//           )
//         );

//         setTakenQuizIds(taken.filter((id) => id !== null));
//       } catch (err) {
//         console.error("Error fetching quizzes by type:", err);
//         if (err.response && err.response.status === 401) {
//           setError("Unauthorized. Please log in again.");
//         } else {
//           setError("Failed to load quizzes");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuizzes();
//   }, []);

//   const pastelColors = [
//     { background: "#fce4ec", border: "#f8bbd0" },
//     { background: "#ede7f6", border: "#b39ddb" },
//     { background: "#e3f2fd", border: "#90caf9" },
//     { background: "#e8f5e9", border: "#a5d6a7" },
//     { background: "#fff8e1", border: "#ffe082" },
//     { background: "#f3e5f5", border: "#ce93d8" },
//   ];

//   const descriptions = [
//     "Explore and test your basic concepts.",
//     "A quick test to challenge your skills.",
//     "Perfect for brushing up knowledge.",
//     "Take this quiz and learn something new!",
//     "Sharpen your understanding in minutes.",
//     "Practice makes perfect—start now!",
//   ];

//   return (
//     <div className="container mt-5">
//       <h2 className="mb-4 text-center text-primary">Available Quizzes</h2>

//       {userRole === "admin" && (
//         <div className="text-center mb-4">
//           <button className="btn btn-primary">Add New Quiz</button>
//         </div>
//       )}

//       {loading ? (
//         <p className="text-center text-secondary">Loading quizzes...</p>
//       ) : error ? (
//         <p className="text-center text-danger">{error}</p>
//       ) : quizzes.length === 0 ? (
//         <p className="text-center text-muted">No quizzes found.</p>
//       ) : (
//         <div className="row">
//           {quizzes.map((quiz, index) => {
//             const color = pastelColors[index % pastelColors.length];
//             const description = descriptions[index % descriptions.length];
//             const isTaken = takenQuizIds.includes(quiz._id);

//             return (
//               <div className="col-md-6 col-lg-4 mb-4" key={quiz._id}>
//                 <div
//                   className="card h-100 shadow-sm"
//                   style={{
//                     backgroundColor: color.background,
//                     border: `2px solid ${color.border}`,
//                     borderRadius: "16px",
//                   }}
//                 >
//                   <div className="card-header text-dark fw-bold text-center fs-5">
//                     {quiz.quiztype_name || "Quiz"}
//                   </div>
//                   <div className="card-body d-flex flex-column justify-content-between">
//                     <h5 className="card-title text-center text-dark">{quiz.quiz_name || ""}</h5>
//                     <p className="text-dark text-center">Total Question:-{quiz.questionCount} {quiz.questionCount === 1 ? "question" : "questions"}</p>
//                     <p className="card-text text-dark text-center">{description}</p>
//                     {isTaken ? (
//                       <button className="btn btn-secondary w-100 rounded-pill" disabled>
//                         Quiz Already Taken
//                       </button>
//                     ) : (
//                       <Link to={`/questions/${quiz._id}`} className="mt-3">
//                         <button className="btn btn-outline-dark w-100 rounded-pill">
//                           Apply for Quiz
//                         </button>
//                       </Link>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuizPage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

const QuizPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [takenQuizIds, setTakenQuizIds] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Token not found. Please log in again.");
          setLoading(false);
          return;
        }

        const decoded = jwtDecode(token);
        const userId = decoded.id;
        setUserRole(decoded.role);

        // Fetch all quizzes
        const response = await axios.get(
          `http://localhost:5000/api/quiz-types/quiz-types`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        const fetchedQuizzes = response.data || [];
        setQuizzes(fetchedQuizzes);

        // Check which quizzes the user has already taken
        const taken = await Promise.all(
          fetchedQuizzes.map((quiz) =>
            axios
              .get(`http://localhost:5000/api/results/result/${userId}/${quiz._id}`, {
                headers: {
                  Authorization: `${token}`,
                },
              })
              .then(() => quiz._id) // quiz was taken
              .catch((err) => {
                if (err.response && err.response.status === 404) {
                  return null; // quiz not taken
                } else {
                  console.error("Error checking quiz status:", err);
                  return null;
                }
              })
          )
        );

        setTakenQuizIds(taken.filter((id) => id !== null));
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError("Failed to load quizzes.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const pastelColors = [
    { background: "#fce4ec", border: "#f8bbd0" },
    { background: "#ede7f6", border: "#b39ddb" },
    { background: "#e3f2fd", border: "#90caf9" },
    { background: "#e8f5e9", border: "#a5d6a7" },
    { background: "#fff8e1", border: "#ffe082" },
    { background: "#f3e5f5", border: "#ce93d8" },
  ];

  const descriptions = [
    "Explore and test your basic concepts.",
    "A quick test to challenge your skills.",
    "Perfect for brushing up knowledge.",
    "Take this quiz and learn something new!",
    "Sharpen your understanding in minutes.",
    "Practice makes perfect—start now!",
  ];

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center text-primary">Available Quizzes</h2>

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
          {quizzes.map((quiz, index) => {
            const color = pastelColors[index % pastelColors.length];
            const description = descriptions[index % descriptions.length];
            const isTaken = takenQuizIds.includes(quiz._id);

            return (
              <div className="col-md-6 col-lg-4 mb-4" key={quiz._id}>
                <div
                  className="card h-100 shadow-sm"
                  style={{
                    backgroundColor: color.background,
                    border: `2px solid ${color.border}`,
                    borderRadius: "16px",
                  }}
                >
                  <div className="card-header text-dark fw-bold text-center fs-5">
                    {quiz.quiztype_name || "Quiz"}
                  </div>
                  <div className="card-body d-flex flex-column justify-content-between">
                    <h5 className="card-title text-center text-dark">{quiz.quiz_name || ""}</h5>
                    <p className="text-dark text-center">
                      Total Questions: {quiz.questionCount}{" "}
                      {quiz.questionCount === 1 ? "question" : "questions"}
                    </p>
                    <p className="card-text text-dark text-center">{description}</p>
                    {isTaken ? (
                      <button className="btn btn-secondary w-100 rounded-pill" disabled>
                        Quiz Already Taken
                      </button>
                    ) : (
                      <Link to={`/questions/${quiz._id}`} className="mt-3">
                        <button className="btn btn-outline-dark w-100 rounded-pill">
                          Apply for Quiz
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QuizPage;