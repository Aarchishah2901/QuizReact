// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Home from './pages/Home';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Quiz from './pages/Quiz';
// import Navbar from './components/Navbar';
// import QuizCard from './components/Quizcard';
// import Dashboard from './components/Dashboard';
// import Questions from './pages/Questions';
// import Result from './pages/Result';
// import QuizHistory from './pages/Quizhistory';
// import ProtectedRoute from './components/ProtectedRoute';

// function AppRoutes() {
//     return (
//         <Router>
//             <Navbar />
//             <Routes>
//             <Route>
//                 <Route path="/" element={<Home />} />
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/register" element={<Register />} />
//                 <Route path="/quiz" element={<Quiz />} />
//                 <Route path="/dashboard" element={<Dashboard />} />
//                 <Route path="/quizcard" element={<QuizCard />} />
//                 <Route path="/questions/:quizId" element={<Questions />} />
//                 <Route path="/quiz/:quizId" element={<Questions />} />
//                 <Route path="/quiz/:quizId/questions" element={<Questions />} />
//                 {/* <Route path="/results" element={<Result />} /> */}
//                 <Route path="/results/:userId/:quizId" element={<Result />} />
//                 <Route path="/quiz-history" element={<QuizHistory />} />
//                 </Route>
//             </Routes>
//         </Router>
//     );  
// }

// export default AppRoutes;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Quiz from './pages/Quiz';
import Navbar from './components/Navbar';
import QuizCard from './components/Quizcard';
import Dashboard from './components/Dashboard';
import Questions from './pages/Questions';
import Result from './pages/Result';
import QuizHistory from './pages/Quizhistory';
import PrivateRoute from './components/PrivateRoute';

function AppRoutes() {
return (
<Router>
<Navbar />
<Routes>
<Route path="/" element={<Home />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />

{/* Use PrivateRoute to protect the routes */}
<Route path="/quiz" element={<PrivateRoute element={<Quiz />} />} />
<Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
<Route path="/quizcard" element={<PrivateRoute element={<QuizCard />} />} />
<Route path="/questions/:quizId" element={<Questions />} />
<Route path="/quiz/:quizId" element={<Questions />} />
<Route path="/quiz/:quizId/questions" element={<Questions />} />
<Route path="/results/:userId/:quizId" element={<Result />} />
<Route path="/quiz-history" element={<PrivateRoute element={<QuizHistory />} />} />
</Routes>
</Router>
);
}

export default AppRoutes;
