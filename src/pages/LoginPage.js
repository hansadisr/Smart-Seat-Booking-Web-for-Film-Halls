import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MovieGrid from '../components/MovieGrid';
import AboutSection from '../components/AboutSection';
import { images } from '../constants/theme';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  // check login data
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:8080/api/v1/users/login', {
        email,
        password,
      }, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.data.success) {
        console.log('Login successful:', response.data);
        login(response.data.userId); // Update auth state
        navigate('/');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Login failed due to a connection error';
      setError(errorMsg);
      console.error('Login error details:', err.response?.data || err);
    }
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
   // call the home page in the loggin page in blur , call movie and about also
  return (
    <div className="loginpage">
      <Navbar isLoginPage={true} />
      <div className='movie-grid blurred'>
        <MovieGrid /> 
        <AboutSection />
      </div> 
      {/* login form  */}
      <div className="main-content">  
        <div className="login-modal">
          <form className="login-form" onSubmit={handleLogin}>
            <h2>Log In</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
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
              <div className="password-input-container">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  id="password"
                  placeholder='Enter your password'
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                
                <img
                  src={showPassword ? images.eye : images.eyeclose}
                  alt={showPassword ? 'Hide password' : 'Show password'}
                  className="password-toggle-icon"
                  onClick={togglePasswordVisibility} //toggle password accessibility
                />
              </div>
            </div>
            <div className="button-container">
              <button type="submit" className="login-btn">Sign In</button>
            </div>
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
      <Footer />
    </div>
  );
};

export default LoginPage;
