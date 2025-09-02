import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';
import { images } from '../constants/theme';
import { FaUserCircle } from 'react-icons/fa';

const Navbar = ({ onSignInClick, isLoginPage = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, logout } = useAuth();
  const [hoveredLink, setHoveredLink] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  // user goes to loggin page
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
  // search function - film list
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      // Handle search query
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <h2><span>Reel </span><span className="highlight1">Vista</span></h2>
        </div>

        <div className="nav-center">
          <div className="search-container">
            <img src={images.searchBlack} alt="Search Icon" className="search-icon" />
            <input
              type="text"
              placeholder="Search for Movies"
              className="search-input"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          {/* Conditionally render the nav-links only if the user is logged in */}
          {isLoggedIn && ( 
            // user logged or not
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
                className={getLinkClass('/bookingList')}
                onClick={handleNavigation('/bookingList')}
                onMouseEnter={() => setHoveredLink('/bookingList')}
                onMouseLeave={() => setHoveredLink(null)}
              >
                Show Booking
                {hoveredLink === '/bookingList' && <span className="hover-tooltip"></span>}
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
          )}
        </div>
        
        {/* Conditionally render the authentication buttons */} 
        {isLoggedIn ? ( // show the lodout if logged only
          <div className="auth-buttons">
            <div className="user-actions">
              <button
                className="logout-btn"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Logout
              </button>
              <div className="profile-icon" onClick={() => navigate('/profile')}>
                <FaUserCircle size={30} style={{ cursor: 'pointer', color: '#fff' }} />
              </div>
            </div>
          </div>
        ) : (  // if user is not log in
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
