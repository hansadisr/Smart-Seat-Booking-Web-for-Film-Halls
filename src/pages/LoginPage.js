import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempted with:', { email, password });
  };

  const handleSignUp = () => {
    // Handle sign up navigation
    console.log('Navigate to sign up');
  };

  return (
    <div className="loginpage">
      <Navbar isLoginPage={true} />

      {/* Main Content */}
      <div className="main-content">
        {/* Blurred Movie Grid */}
        <div className="movie-grid blurred">
          <div className="movie-card"></div>
          <div className="movie-card"></div>
          <div className="movie-card"></div>
          <div className="movie-card"></div>
        </div>

        {/* About Section with Blur Effect */}
        <div className="about-section">
          <div className="about-left blurred">
            <h3>About Us</h3>
            <div className="about-content">
              <div className="about-image">
                <div className="carousel-container">
                  <button className="carousel-btn prev">❮</button>
                  <div className="carousel-image"></div>
                  <button className="carousel-btn next">❯</button>
                </div>
              </div>
              <div className="about-text">
                <p>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
                </p>
              </div>
            </div>
          </div>

          {/* Login Modal */}
          <div className="login-modal">
            <form className="login-form" onSubmit={handleLogin}>
              <h2>Log In</h2>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input 
                  type="password" 
                  id="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <button type="submit" className="login-btn">Sign In</button>
              
              <div className="form-footer">
                <span>Don't you have an account? </span>
                <button 
                  type="button" 
                  className="signup-link"
                  onClick={handleSignUp}
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;