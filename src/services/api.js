import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Register user
export const registerUser = async (userData) => {
    return await axios.post(`${API_URL}/auth/register`, userData);
};

// Login user
export const loginUser = async (userData) => {
    return await axios.post(`${API_URL}/auth/login`, userData);
};

//Quiz
export const getAllQuizTypes = async (quizTypeName) => {
    return await axios.get(`${API_URL}/quiz-types/quiz-types`, {
        params: { name: quizTypeName },
    });
};

//Questions
export const getQuizQuestions = async (quizId) => {
  console.log("function",quizId);
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/questions/quiztype/${quizId}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    throw error;
  }
};

//Answer
export const submitAnswers = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/answers/submit`, data);
    return response.data;
  } catch (error) {
    console.error('Error submitting answers:', error);
    throw error;
  }
};

//Result
export const calculateResult = async (userId, quizId) => {
  return axios.post(`${API_URL}/results/submit`, {
    userId,
    quizId,
  });
};

export const getResult = async (userId, quizId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/results/result/${userId}/${quizId}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching result:", error);
    throw error;
  }
};

export const getUnansweredQuestions = async (userId, quizId, token) => {
  try {
    const res = await axios.get(`${API_URL}/questions/unanswered/${userId}/${quizId}`, {
      headers: { Authorization: token }
    });
    return res.data.questions;
  } catch (error) {
    console.error("Error fetching unanswered questions:", error);
    return [];
  }
};

//Quizhistory
export const getQuizHistory = async (userId) => {
  const response = await axios.get(`${API_URL}/results/history/${userId}`);
  return response.data;
};