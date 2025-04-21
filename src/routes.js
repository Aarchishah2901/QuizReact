import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Quiz from './pages/Quiz';
import Navbar from './components/Navbar';
import QuizCard from './components/Quizcard';
import Dashboard from './components/Dashboard';
import Questions from './pages/Questions';

function AppRoutes() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/quizcard" element={<QuizCard />} />
                <Route path="/questions/:quizId" element={<Questions />} />
            </Routes>
        </Router>
    );
}

export default AppRoutes;