import React from 'react';
import '../styles/Footer.css';
import { images } from '../constants/theme';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Top section with horizontal lines and brand name */}
        <div className="footer-title-line">
          <span className="line"></span>
          <div className="footer-brand">
            <span>Book </span>
            <span className="highlight">My</span>
            <span> Show</span>
          </div>
          <span className="line"></span>
        </div>

        {/* Social Icons */}
        <div className="social-links">
          <img src={images.facebook} alt="Search" className="social-link" />
          <img src={images.instagram} alt="Search" className="social-link" />
        </div>

        {/* Bottom section */}
        <div className="footer-bottom">
          <p>Copyright 2025 © Book My Show Entertainment Lanka Private Limited All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
