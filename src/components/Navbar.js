import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';
import { colors, images } from '../constants/theme';

const Navbar = ({ onSignInClick, isLoginPage = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, logout } = useAuth();
  const [hoveredLink, setHoveredLink] = useState(null);

  const handleSignInClick = () => {
    if (onSignInClick) {
      onSignInClick();
    }
    navigate('/login');
  };

  const handleNavigation = (path) => {
    return (e) => {
      e.preventDefault();
      navigate(path);
    };
  };

  const getLinkClass = (path) => {
    return `nav-link ${location.pathname === path ? 'active' : ''} ${
      hoveredLink === path ? 'hovered' : ''
    }`;
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
            <a
              href="#"
              className={getLinkClass('/')}
              onClick={handleNavigation('/')}
              onMouseEnter={() => setHoveredLink('/')}
              onMouseLeave={() => setHoveredLink(null)}
            >
              Home
              {hoveredLink === '/' && <span className="hover-tooltip"></span>}
            </a>
            <a
              href="#"
              className={getLinkClass('/movies')}
              onClick={handleNavigation('/movies')}
              onMouseEnter={() => setHoveredLink('/movies')}
              onMouseLeave={() => setHoveredLink(null)}
            >
              Movies
              {hoveredLink === '/movies' && <span className="hover-tooltip"></span>}
            </a>
            <a
              href="#"
              className={getLinkClass('/location')}
              onClick={handleNavigation('/location')}
              onMouseEnter={() => setHoveredLink('/location')}
              onMouseLeave={() => setHoveredLink(null)}
            >
              Location
              {hoveredLink === '/location' && <span className="hover-tooltip"></span>}
            </a>
          </div>
        </div>
        
        {isLoggedIn ? (
          <div className="auth-buttons">
            <button 
              className="signin-btn"
              onClick={() => {
                navigate('/bookingList');
              }}
            >
              Change Booking
            </button>
            <button 
              className="logout-btn"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Logout
            </button>
          </div>
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
