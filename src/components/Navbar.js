import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.setItem("isAuthenticated", "false");
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
    setTimeout(() => navigate('/login'), 1500);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">Quiz App</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                <li className="nav-item">
                  <span className="nav-link text-white fw-bold">
                    Welcome, {user.firstname}
                  </span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-light btn-md ms-2 px-4 fw-bold" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              location.pathname !== '/' && (
                <>
                  <li className="nav-item me-2">
                    <Link to="/login">
                      <button className="btn btn-light btn-md px-4 fw-bold">
                        Login
                      </button>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/register">
                      <button className="btn btn-outline-light btn-md px-4 fw-bold">
                        Register
                      </button>
                    </Link>
                  </li>
                </>
              )
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;