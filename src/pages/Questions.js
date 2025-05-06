import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizQuestions, submitAnswers, calculateResult } from '../services/api';

const Questions = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.userId || null;

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [lockedQuestions, setLockedQuestions] = useState(new Set());
  const [timeleft, setTimeLeft] = useState(300);

  const handleFinish = useCallback(async () => {
    try {
      const answersPayload = Object.entries(selectedAnswers).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedOption: selectedAnswer,
      }));

      const answerResponse = await submitAnswers({ userId, quizId, answers: answersPayload });
      const resultResponse = await calculateResult(userId, quizId);
      const timeTaken = 300 - timeleft;

      navigate(`/results/${userId}/${quizId}`, { state: { timeTaken } });
    } catch (error) {
      console.error('Error submitting answers:', error.response?.data || error.message);
    }
  }, [selectedAnswers, userId, quizId, timeleft, navigate]);

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
    }, 1000);
    return () => clearInterval(timer);
  }, [handleFinish]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getQuizQuestions(quizId);
        setQuestions(data);
      } catch (error) {
        console.error('Failed to load quiz questions', error);
      }
    };
    fetchQuestions();
  }, [quizId]);

  if (questions.length === 0) return <p className="text-center mt-5">Loading...</p>;

  const currentQuestion = questions[currentIndex];
  const currentQuestionId = currentQuestion._id || currentIndex;

  const handleOptionChange = (e) => {
    const value = e.target.value;
    if (!lockedQuestions.has(currentQuestionId)) {
      setSelectedAnswers({
        ...selectedAnswers,
        [currentQuestionId]: value,
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      const currentQId = questions[currentIndex]._id;
      setLockedQuestions(prev => new Set(prev).add(currentQId));
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

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
      <h1 className="text-center mb-4">Quiz Questions</h1>

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
            {currentQuestion.options && currentQuestion.options.length > 0 ? (
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

          <div className="d-flex justify-content-between mt-5">
            <button
              className="btn btn-outline-dark px-4"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              Previous
            </button>

            {currentIndex < questions.length - 1 ? (
              <button className="btn btn-success px-4" onClick={handleNext}>
                Next
              </button>
            ) : (
              <button className="btn btn-success px-4" onClick={handleFinish}>
                Finish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questions;