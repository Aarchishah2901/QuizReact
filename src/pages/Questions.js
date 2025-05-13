import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizQuestions, submitAnswers, calculateResult } from '../services/api';

const Questions = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.userId || null;

  const [questions, setQuestions] = useState([]);
  const [quizName, setQuizName] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [lockedQuestions, setLockedQuestions] = useState(new Set());
  const [submittedQuestions, setSubmittedQuestions] = useState(new Set());
  const [timeleft, setTimeLeft] = useState(60);
  const [timeTaken, setTimeTaken] = useState(0);
  // const [showToast, setShowToast] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleFinish = useCallback(async () => {
    if (questions.length === 0) return;

    const allAnswered = questions.every((q) => selectedAnswers.hasOwnProperty(q._id));

    if (!allAnswered) {
      return;
    }

    try {
      const answersPayload = Object.entries(selectedAnswers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
      }));

      await submitAnswers({ userId, quizId, answers: answersPayload, timeTaken });
      await calculateResult(userId, quizId);
      setQuizSubmitted(true);
    } catch (error) {
      console.error('Error submitting answers:', error.response?.data || error.message);
    }
  }, [selectedAnswers, userId, quizId, timeTaken, questions]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
      setTimeTaken(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [handleFinish]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getQuizQuestions(quizId);
        setQuestions(data);
        if (data.length > 0) {
          setQuizName(data[0].quiztype_name || 'Unknown Quiz');
        }
      } catch (error) {
        console.error('Failed to load quiz questions', error);
      }
    };
    fetchQuestions();
  }, [quizId]);

  // useEffect(() => {
  //   if (showToast) {
  //     const timer = setTimeout(() => setShowToast(false), 3000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [showToast]);

  if (questions.length === 0) return <p className="text-center mt-5">Loading...</p>;

  const currentQuestion = questions[currentIndex];
  const currentQuestionId = currentQuestion._id;

  const handleOptionChange = (e) => {
    const value = e.target.value;
    if (!lockedQuestions.has(currentQuestionId) && timeleft > 0) {
      setSelectedAnswers(prev => ({
        ...prev,
        [currentQuestionId]: value,
      }));
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswers[currentQuestionId]) {
      setLockedQuestions(prev => new Set(prev).add(currentQuestionId));
      setSubmittedQuestions(prev => new Set(prev).add(currentQuestionId));
    } else {
      alert('Please select an option before submitting.');
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleViewScore = () => {
    navigate(`/results/${userId}/${quizId}`, { state: { timeTaken } });
  };

  const handlequizhistroy = () => {
    navigate(`/quiz-history`);
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const zoomStyle = timeleft <= 30 ? {
    animation: 'zoomInOut 1s ease-in-out infinite'
  } : {};

  return (
    <div className="container my-5">

      {/* {showToast && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
          <div className="toast show align-items-center text-white bg-danger border-0" role="alert">
            <div className="d-flex">
              <div className="toast-body">
                Please answer all the questions before finishing the quiz.
              </div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setShowToast(false)}></button>
            </div>
          </div>
        </div>
      )} */}

      <h1 className="text-center mb-3">Quiz Questions</h1>
      <h5 className="text-center text-primary mb-4">Quiz Type: {quizName}</h5>

      {timeleft <= 30 && (
        <style>
          {`
            @keyframes zoomInOut {
              0% { transform: scale(1); }
              50% { transform: scale(1.2); }
              100% { transform: scale(1); }
            }
          `}
        </style>
      )}

      <div
        className={`alert text-center fw-bold ${
          timeleft <= 30 ? 'alert-danger' :
          timeleft <= 120 ? 'alert-warning' :
          timeleft <= 300 ? 'alert-success' :
          'alert-secondary'
        }`}
        style={zoomStyle}
      >
        TimeLeft: {formatTime(timeleft)}
      </div>

      <div className="card bg-light shadow-sm border-0 rounded-4">
        <div className="card-body px-5 py-4">
          <h5 className="card-title text-dark mb-4 fs-5">
            <span className="badge bg-primary me-2">{currentIndex + 1}</span>
            {currentQuestion.question || currentQuestion.question_text || currentQuestion.title || (
              <span className="text-danger">[Question text missing]</span>
            )}
          </h5>

          <div className="mt-3">
            {currentQuestion.options?.length > 0 ? (
              currentQuestion.options.map((option, idx) => {
                const selectedValue = selectedAnswers[currentQuestionId];
                const isSelected = selectedValue === option;

                return (
                  <div className="form-check mb-3" key={idx}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`question-${currentQuestionId}`}
                      id={`option-${idx}`}
                      value={option}
                      onChange={handleOptionChange}
                      checked={isSelected}
                      disabled={lockedQuestions.has(currentQuestionId)}
                    />
                    <label
                      className={`form-check-label ${isSelected ? 'fw-semibold text-success' : 'text-dark'}`}
                      htmlFor={`option-${idx}`}
                    >
                      {option}
                    </label>
                  </div>
                );
              })
            ) : (
              <p className="text-muted">No options available for this question.</p>
            )}
          </div>

          <div className="d-flex justify-content-between mt-4 flex-wrap gap-3">
            <button className="btn btn-outline-dark px-4" onClick={handlePrev} disabled={currentIndex === 0}>
              Previous
            </button>

            <button
              className="btn btn-success px-4"
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswers[currentQuestionId] || submittedQuestions.has(currentQuestionId) || timeleft <= 0}
            >
              Submit Answer
            </button>

            {currentIndex < questions.length - 1 && (
              <button className="btn btn-primary px-4" onClick={handleNext} disabled={timeleft <= 0}>
                Next
              </button>
            )}

            {currentIndex === questions.length - 1 && (
              <button className="btn btn-danger px-4" onClick={handleFinish} disabled={timeleft <= 0}>
                Finish
              </button>
            )}

            {quizSubmitted && (
              <button className="btn btn-primary px-4 ms-auto" onClick={handleViewScore}>
                View Score
              </button>
            )}
          </div>
        </div>
      </div>
      <button className="btn btn-primary px-4 mt-4 ms-auto" onClick={handlequizhistroy}>
        View Quiz History
      </button>
    </div>
  );
};

export default Questions;

// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getQuizQuestions, submitAnswers, calculateResult, getResult } from '../services/api';

// const Questions = () => {
//   const { quizId } = useParams();
//   const navigate = useNavigate();
//   const user = JSON.parse(localStorage.getItem('user'));
//   const userId = user?.userId || null;

//   const [questions, setQuestions] = useState([]);
//   const [quizName, setQuizName] = useState('');
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [lockedQuestions, setLockedQuestions] = useState(new Set());
//   const [submittedQuestions, setSubmittedQuestions] = useState(new Set());
//   const [timeleft, setTimeLeft] = useState(60);
//   const [timeTaken, setTimeTaken] = useState(0);
//   const [showToast, setShowToast] = useState(false);
//   const [quizSubmitted, setQuizSubmitted] = useState(false);

//   const handleFinish = useCallback(async () => {
//     if (questions.length === 0) return;

//     // Check if all questions are answered
//     const allAnswered = questions.every((q) => selectedAnswers.hasOwnProperty(q._id));

//     if (!allAnswered) {
//       setShowToast(true); // Show message if not all questions are answered
//       return;
//     }

//     try {
//       const answersPayload = Object.entries(selectedAnswers).map(([questionId, selectedOption]) => ({
//         questionId,
//         selectedOption,
//       }));

//       await submitAnswers({ userId, quizId, answers: answersPayload, timeTaken });
//       await calculateResult(userId, quizId);
//       setQuizSubmitted(true);
//     } catch (error) {
//       console.error('Error submitting answers:', error.response?.data || error.message);
//     }
//   }, [selectedAnswers, userId, quizId, timeTaken, questions]);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft(prev => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           handleFinish();
//           return 0;
//         }
//         return prev - 1;
//       });
//       setTimeTaken(prev => prev + 1);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [handleFinish]);

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const data = await getQuizQuestions(quizId);
//         setQuestions(data);
//         if (data.length > 0) {
//           setQuizName(data[0].quiztype_name || 'Unknown Quiz');
//         }
//       } catch (error) {
//         console.error('Failed to load quiz questions', error);
//       }
//     };

//     const fetchPreviousResults = async () => {
//       try {
//         const resultData = await getResult(userId, quizId);
//         if (resultData && resultData.answers && resultData.answers.length > 0) {
//           const { answers } = resultData;
//           const lockedQuestionsSet = new Set();
//           const selectedAnswersObj = {};
        
//           answers.forEach((answer) => {
//             selectedAnswersObj[answer.questionId] = answer.selectedOption;
//             lockedQuestionsSet.add(answer.questionId);
//           });
        
//           setSelectedAnswers(selectedAnswersObj);
//           setLockedQuestions(lockedQuestionsSet);
        
//           // ✅ Only lock entire quiz if fully submitted
//           if (resultData.totalQuestions === answers.length) {
//             setQuizSubmitted(true);
//           }
//         }
//       } catch (error) {
//         console.error('Failed to load quiz results', error);
//       }
//     };

//     fetchQuestions();
//     fetchPreviousResults();
//   }, [quizId, userId]);

//   useEffect(() => {
//     if (showToast) {
//       const timer = setTimeout(() => setShowToast(false), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [showToast]);

//   if (questions.length === 0) return <p className="text-center mt-5">Loading...</p>;

//   const currentQuestion = questions[currentIndex];
//   const currentQuestionId = currentQuestion._id;

//   const handleOptionChange = (e) => {
//     const value = e.target.value;
//     if (!lockedQuestions.has(currentQuestionId) && timeleft > 0 && !quizSubmitted) {
//       setSelectedAnswers(prev => ({
//         ...prev,
//         [currentQuestionId]: value,
//       }));
//     }
//   };

//   // const handleSubmitAnswer = () => {
//   //   if (lockedQuestions.has(currentQuestionId)) {
//   //     alert('This question has already been answered and is locked.');
//   //     return;
//   //   }
  
//   //   if (selectedAnswers[currentQuestionId]) {
//   //     setLockedQuestions(prev => new Set(prev).add(currentQuestionId));
//   //     setSubmittedQuestions(prev => new Set(prev).add(currentQuestionId));
//   //   } else {
//   //     alert('Please select an option before submitting.');
//   //   }
//   // };

//   const handleSubmitAnswer = async () => {
//     if (lockedQuestions.has(currentQuestionId)) {
//       alert('This question has already been answered and is locked.');
//       return;
//     }
  
//     const selectedOption = selectedAnswers[currentQuestionId];
  
//     if (selectedOption) {
//       try {
//         const answerPayload = {
//           userId,
//           quizId,
//           answers: [{ questionId: currentQuestionId, selectedOption }]
//         };
        
//         await submitAnswers(answerPayload); // Submit individual answer
  
//         setLockedQuestions(prev => new Set(prev).add(currentQuestionId));
//         setSubmittedQuestions(prev => new Set(prev).add(currentQuestionId));
//       } catch (error) {
//         console.error("Failed to submit answer:", error);
//       }
//     } else {
//       alert('Please select an option before submitting.');
//     }
//   };

//   const handleNext = () => {
//     if (currentIndex < questions.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     }
//   };

//   const handlePrev = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex(currentIndex - 1);
//     }
//   };

//   const handleViewScore = () => {
//     navigate(`/results/${userId}/${quizId}`, { state: { timeTaken } });
//   };

//   const handlequizhistroy = () => {
//     navigate(`/quiz-history`);
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
//   };

//   const zoomStyle = timeleft <= 30 ? {
//     animation: 'zoomInOut 1s ease-in-out infinite'
//   } : {};

//   // Determine if the finish button should be disabled
//   const allAnswered = questions.every((q) => selectedAnswers.hasOwnProperty(q._id));

//   return (
//     <div className="container my-5">
//       {showToast && (
//         <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
//           <div className="toast show align-items-center text-white bg-danger border-0" role="alert">
//             <div className="d-flex">
//               <div className="toast-body">
//                 Please answer all the questions before finishing the quiz.
//               </div>
//               <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setShowToast(false)}></button>
//             </div>
//           </div>
//         </div>
//       )}

//       <h1 className="text-center mb-3">Quiz Questions</h1>
//       <h5 className="text-center text-primary mb-4">Quiz Type: {quizName}</h5>

//       {timeleft <= 30 && (
//         <style>
//           {`
//             @keyframes zoomInOut {
//               0% { transform: scale(1); }
//               50% { transform: scale(1.2); }
//               100% { transform: scale(1); }
//             }
//           `}
//         </style>
//       )}

//       <div
//         className={`alert text-center fw-bold ${
//           timeleft <= 30 ? 'alert-danger' :
//           timeleft <= 120 ? 'alert-warning' :
//           timeleft <= 300 ? 'alert-success' :
//           'alert-secondary'
//         }`}
//         style={zoomStyle}
//       >
//         TimeLeft: {formatTime(timeleft)}
//       </div>

//       <div className="card bg-light shadow-sm border-0 rounded-4">
//         <div className="card-body px-5 py-4">
//           <h5 className="card-title text-dark mb-4 fs-5">
//             <span className="badge bg-primary me-2">{currentIndex + 1}</span>
//             {currentQuestion.question || currentQuestion.question_text || currentQuestion.title || (
//               <span className="text-danger">[Question text missing]</span>
//             )}
//             {lockedQuestions.has(currentQuestionId) && (
//               <span className="badge bg-secondary ms-2">Locked</span>
//             )}
//           </h5>

//           <div className="mt-3">
//             {currentQuestion.options?.length > 0 ? (
//               currentQuestion.options.map((option, idx) => {
//                 const selectedValue = selectedAnswers[currentQuestionId];
//                 const isSelected = selectedValue === option;

//                 return (
//                   <div className="form-check mb-3" key={idx}>
//                     <input
//                       className="form-check-input"
//                       type="radio"
//                       name={`question-${currentQuestionId}`}
//                       id={`option-${idx}`}
//                       value={option}
//                       onChange={handleOptionChange}
//                       checked={isSelected}
//                       disabled={lockedQuestions.has(currentQuestionId) || quizSubmitted}
//                     />
//                     <label
//                       className={`form-check-label ${isSelected ? 'fw-semibold text-success' : 'text-dark'}`}
//                       htmlFor={`option-${idx}`}
//                     >
//                       {option}
//                     </label>
//                   </div>
//                 );
//               })
//             ) : (
//               <p className="text-muted">No options available for this question.</p>
//             )}
//           </div>

//           <div className="d-flex justify-content-between mt-4 flex-wrap gap-3">
//             <button className="btn btn-outline-dark px-4" onClick={handlePrev} disabled={currentIndex === 0}>
//               Previous
//             </button>

//             <button
//               className="btn btn-success px-4"
//               onClick={handleSubmitAnswer}
//               disabled={!selectedAnswers[currentQuestionId] || submittedQuestions.has(currentQuestionId) || timeleft <= 0 || quizSubmitted}
//             >
//               Submit Answer
//             </button>

//             {currentIndex < questions.length - 1 && (
//               <button className="btn btn-primary px-4" onClick={handleNext} disabled={timeleft <= 0}>
//                 Next
//               </button>
//             )}

//             {currentIndex === questions.length - 1 && (
//               <button className="btn btn-danger px-4" onClick={handleFinish} disabled={!allAnswered || quizSubmitted || timeleft <= 0} >Finish Quiz
//               </button>
// )}
//         {quizSubmitted && (
//           <button
//             className="btn btn-info px-4"
//             onClick={handleViewScore}
//           >
//             View Score
//           </button>
//         )}

//         {quizSubmitted && (
//           <button
//             className="btn btn-secondary px-4"
//             onClick={handlequizhistroy}
//           >
//             View History
//           </button>
//         )}
//       </div>
//     </div>
//   </div>
//   <button
//             className="btn btn-primary px-4 mb-4 mt-4"
//             onClick={handlequizhistroy}
//           >
//             View History
//           </button>
// </div>
// );
// };

// export default Questions;