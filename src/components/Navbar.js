import React from 'react';
import '../styles/Navbar.css';

const Navbar = ({ onSignInClick, isLoginPage = false }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <h2>ReelVista</h2>
        </div>
        
        <div className="nav-center">
          <div className="search-container">
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
        
        <button 
          className={`signin-btn ${isLoginPage ? 'active' : ''}`}
          onClick={onSignInClick}
        >
          Sign in
        </button>
      </div>
    </nav>
  );
};

export default Navbar;