import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <span>Book </span>
            <span className="highlight">My</span>
            <span> Show</span>
          </div>
          
          <div className="social-links">
            <a href="#facebook" className="social-link">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#instagram" className="social-link">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>Copyright 2025 © Book My Show Entertainment Lanka Private Limited All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;