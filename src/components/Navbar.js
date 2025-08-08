import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import { colors, images } from '../constants/theme';

const Navbar = ({ onSignInClick, isLoginPage = false, isLoggedIn = false }) => {
  const navigate = useNavigate();

  const handleSignInClick = () => {
    if (onSignInClick) {
      onSignInClick();
    }
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <h2>ReelVista</h2>
        </div>
        
        <div className="nav-center">
          <div className="search-container">
            <img src={images.searchBlack} alt="Search Icon" className="search-icon" />
            <input
              type="text"
              placeholder="Search for Movies"
              className="search-input"
            />
          </div>
          
          <div className="nav-links">
            <a href="#" className={`nav-link ${!isLoginPage ? 'active' : ''}`}>Home</a>
            <a href="#" className="nav-link">Movies</a>
            <a href="#" className="nav-link">Location</a>
          </div>
        </div>
        
        {isLoggedIn ? (
          <button 
            className="signin-btn"
            onClick={() => {/* Add your change booking handler here */}}
          >
            Change Booking
          </button>
        ) : (
          <button 
            className={`signin-btn ${isLoginPage ? 'active' : ''}`}
            onClick={handleSignInClick}
          >
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;