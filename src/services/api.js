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
export const getAllQuizzes = async () => {
    return await axios.get(`${API_URL}/quiz-types/quiz-types`);
};