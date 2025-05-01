import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getQuizQuestions, submitAnswers, calculateResult} from '../services/api';
import { useNavigate } from "react-router-dom";

const Questions = () => {
      const navigate = useNavigate();
      const { quizId } = useParams();
      // const userId = localStorage.getItem('userId');
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?.userId || null;     
      const [questions, setQuestions] = useState([]);
      const [currentIndex, setCurrentIndex] = useState(0);
      const [selectedAnswers, setSelectedAnswers] = useState({});
      const [lockedQuestions, setLockedQuestions] = useState(new Set());
    
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

  // const handleFinish = () => {
  //   navigate('/results');
  // };

  const handleFinish = async () => {
    try {
      const answersPayload = Object.entries(selectedAnswers).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedOption: selectedAnswer,  // Correct the key here to match the backend
      }));
  
      console.log('Payload being sent:', {
        userId,
        quizId,
        answers: answersPayload,
      });

    const answerResponse = await submitAnswers({ userId, quizId, answers: answersPayload });
    console.log('Answers submitted:', answerResponse);

    const resultResponse = await calculateResult(userId, quizId);
    console.log('Result calculated:', resultResponse);

      navigate(`/results/${userId}/${quizId}`);
    } catch (error) {
      console.error('Error submitting answers:', error.response?.data || error.message);
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Quiz Questions</h1>

      <div className="card shadow-lg">
        <div className="card-body">
          <h5 className="card-title">
            {currentIndex + 1}.{" "}
            {currentQuestion.question || currentQuestion.question_text || currentQuestion.title || (
              <span className="text-danger">[Question text missing]</span>
            )}
          </h5>

          <div className="mt-4">
            {currentQuestion.options && currentQuestion.options.length > 0 ? (
              currentQuestion.options.map((option, idx) => {
                const selectedValue = selectedAnswers[currentQuestionId];
                const isSelected = selectedValue === option;

                return (
                  <div className="form-check" key={idx}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`question-${currentQuestionId}`}
                      id={`option-${idx}`}
                      value={option}
                      onChange={handleOptionChange}
                      checked={isSelected}
                      // disabled={!!selectedValue} // Disable if already answered
                      disabled={lockedQuestions.has(currentQuestionId)}
                    />
                    <label className="form-check-label" htmlFor={`option-${idx}`}>
                      {option}
                    </label>
                  </div>
                );
              })
            ) : (
              <p className="text-muted">No options available for this question.</p>
            )}
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              className="btn btn-primary px-4"
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