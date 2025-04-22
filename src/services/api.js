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
export const getQuizzesByType = async (quizTypeName) => {
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

export const submitQuizAnswers = async (quizId, answers, token) => {
  try {
    const response = await axios.post(`${API_URL}/results/submit`,
      { quizId, answers },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};