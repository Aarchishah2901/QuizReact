import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizQuestions, submitAnswers, calculateResult } from '../services/api';

const Questions = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.userId;

  const [questions, setQuestions] = useState([]);
  const [quizName, setQuizName] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [lockedQuestions, setLockedQuestions] = useState(new Set());
  const [submittedQuestions, setSubmittedQuestions] = useState(new Set());
  const [timeleft, setTimeLeft] = useState(60);
  const [timeTaken, setTimeTaken] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(`quiz_${quizId}_user_${userId}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      setSelectedAnswers(parsed.selectedAnswers || {});
      const locked = new Set(parsed.lockedQuestions || []);
      setLockedQuestions(locked);
      setSubmittedQuestions(locked);
    }
  }, [quizId, userId]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getQuizQuestions(quizId);
        setQuestions(data);
        if (data.length > 0) {
          setQuizName(data[0].quiztype_name || 'Unknown');
        }
      } catch (err) {
        console.error('Error fetching questions', err);
      }
    };
    fetchQuestions();
  }, [quizId]);

  const persistLockedData = (updatedSelected, updatedLocked) => {
    localStorage.setItem(
      `quiz_${quizId}_user_${userId}`,
      JSON.stringify({
        selectedAnswers: updatedSelected,
        lockedQuestions: Array.from(updatedLocked),
      })
    );
  };

  const handleOptionChange = (e) => {
    const value = e.target.value;
    const currentId = questions[currentIndex]._id;
    if (!lockedQuestions.has(currentId) && timeleft > 0) {
      setSelectedAnswers(prev => ({
        ...prev,
        [currentId]: value,
      }));
    }
  };

  const handleSubmitAnswer = () => {
    const currentId = questions[currentIndex]._id;
    if (selectedAnswers[currentId]) {
      const updatedLocked = new Set(lockedQuestions).add(currentId);
      setLockedQuestions(updatedLocked);
      setSubmittedQuestions(new Set(submittedQuestions).add(currentId));
      persistLockedData(selectedAnswers, updatedLocked);
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

  const handleFinish = useCallback(async () => {
    if (questions.length === 0) return;
    const allAnswered = questions.every(q => selectedAnswers.hasOwnProperty(q._id));
    if (!allAnswered) return;

    try {
      const answersPayload = Object.entries(selectedAnswers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
      }));
      await submitAnswers({ userId, quizId, answers: answersPayload, timeTaken });
      await calculateResult(userId, quizId);
      setQuizSubmitted(true);
    } catch (err) {
      console.error('Error submitting:', err);
    }
  }, [selectedAnswers, questions, userId, quizId, timeTaken]);
  
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

  const handleViewScore = () => {
    navigate(`/results/${userId}/${quizId}`, { state: { timeTaken } });
  };

  const handleQuiz = () => {
    navigate('/quiz');
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const currentQuestion = questions[currentIndex];
  const currentQuestionId = currentQuestion?._id;

  const zoomStyle = timeleft <= 30 ? { animation: 'zoomInOut 1s ease-in-out infinite' } : {};

  if (questions.length === 0) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container my-5">
      <h1 className="text-center mb-3">Quiz Questions</h1>
      <h5 className="text-center text-primary mb-4">Quiz Type: {quizName}</h5>

      {timeleft <= 30 && (
        <style>{`
          @keyframes zoomInOut {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
        `}</style>
      )}

      <div
        className={`alert fw-bold text-center ${
          timeleft <= 30 ? 'alert-danger' :
          timeleft <= 120 ? 'alert-warning' :
          timeleft <= 300 ? 'alert-success' : 'alert-secondary'
        }`}
        style={zoomStyle}
      >
        Time Left: {formatTime(timeleft)}
      </div>

      <div className="card bg-light shadow-sm border-0 rounded-4">
        <div className="card-body px-5 py-4">
        <h5 className="card-title text-dark mb-4 fs-5">
          <span className="badge bg-primary me-2">{currentIndex + 1}</span>
            {currentQuestion?.question || currentQuestion?.question_text || currentQuestion?.title || (
          <span className="text-danger">[Question text missing]</span>
        )}
        </h5>

          <div className="mt-3">
            {currentQuestion.options?.map((option, idx) => {
              const selected = selectedAnswers[currentQuestionId];
              return (
                <div className="form-check mb-3" key={idx}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`question-${currentQuestionId}`}
                    id={`option-${idx}`}
                    value={option}
                    checked={selected === option}
                    onChange={handleOptionChange}
                    disabled={lockedQuestions.has(currentQuestionId)}
                  />
                  <label className={`form-check-label ${selected === option ? 'fw-semibold text-success' : ''}`} htmlFor={`option-${idx}`}>
                    {option}
                  </label>
                </div>
              );
            })}
          </div>

          <div className="d-flex flex-wrap gap-3 mt-4 justify-content-between" style={{ minHeight: "25px" }}>
            <button className="btn btn-outline-dark" onClick={handlePrev} disabled={currentIndex === 0}>
              Previous
            </button>

            <button
              className="btn btn-success"
              onClick={handleSubmitAnswer}
              disabled={
                !selectedAnswers[currentQuestionId] ||
                submittedQuestions.has(currentQuestionId) ||
                timeleft <= 0
              }
            >
              Submit Answer
            </button>

            {currentIndex < questions.length - 1 && (
              <button className="btn btn-primary" onClick={handleNext} disabled={timeleft <= 0}>
                Next
              </button>
            )}

            {currentIndex === questions.length - 1 && (
              <button className="btn btn-danger" onClick={handleFinish} disabled={timeleft <= 0}>
                Finish
              </button>
            )}

            {quizSubmitted && (
              <button className="btn btn-primary mt-4" onClick={handleViewScore}>
                View Score
              </button>
            )}
          </div>
        </div>
      </div>

      <button className="btn btn-primary mt-4" onClick={handleQuiz}>
        View Quiz
      </button>
    </div>
  );
};

export default Questions;