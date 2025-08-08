import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MovieGrid from '../components/MovieGrid';
import AboutSection from '../components/AboutSection';
import '../styles/LoginPage.css';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    // Handle signup logic here
    console.log('Signup attempted with:', { email, password, confirmPassword });
    navigate('/login');
  };

  const handleLogin = () => {
    // Handle login navigation
    console.log('Navigate to login');
    navigate('/login');
  };

  return (
    <div className="loginpage">
      <Navbar isLoginPage={true} />
      <div className='movie-grid blurred'>
        <MovieGrid />
        <AboutSection />
      </div>

      <div className="main-content">
        {/* Signup Modal */}
        <div className="login-modal">
          <form className="login-form" onSubmit={handleSignup}>
            <h2>Sign Up</h2>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email"
                placeholder='Enter your email address'
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
                placeholder='Enter your password'
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input 
                type="password" 
                id="confirmPassword"
                placeholder='Confirm your password'
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="button-container">
              <button type="submit" className="login-btn">Sign Up</button>
            </div>
            
            <div className="form-footer">
              <span>Do you already have an account? </span>
              <button 
                type="button" 
                className="signup-link"
                onClick={handleLogin}
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SignupPage;