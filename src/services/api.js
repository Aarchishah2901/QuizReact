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
export const fetchQuestionsByQuizTypeId = async (quiztype_id) => {
    try {
      const response = await axios.get(`${API_URL}/questions/questions/${quiztype_id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };