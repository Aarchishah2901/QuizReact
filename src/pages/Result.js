import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getResult } from "../services/api";// Make sure you import the correct API function

const Result = () => {
  const { userId, quizId } = useParams();  // Extracting from the URL
  console.log("userId:", userId);  // Check if userId is correct
  console.log("quizId:", quizId);  // Check if quizId is correct

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId || !quizId) {
      setError("Invalid URL parameters");
      setLoading(false);
      return;
    }

    getResult(userId, quizId)
      .then((data) => {
        setResult(data.result);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching result");
        setLoading(false);
      });
  }, [userId, quizId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h3>Quiz Result</h3>
      <p>Total Questions: {result.totalQuestions}</p>
      <p>Correct Answers: {result.correctAnswers}</p>
      <p>Wrong Answers: {result.wrongAnswers}</p>
      <p>Score: {result.score}</p>
    </div>
  );
};

export default Result;