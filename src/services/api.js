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

//Answer/Result
export const getResult = async (userId, quizId) => {
  console.log("Fetching result for userId:", userId, "and quizId:", quizId);
  
  try {
    const token = localStorage.getItem('token'); // Get token from localStorage
    const response = await axios.get(`${API_URL}/results/result/${userId}/${quizId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Send token in Authorization header
      },
    });
    
    return response.data; // Assuming the result is under "data.result"
  } catch (error) {
    console.error('Error fetching result:', error);
    throw error; // Rethrow the error to be handled in the component
  }
};