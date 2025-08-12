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

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/api/v1/users/create', {
        name,
        email,
        password,
      }, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.data.success) {
        console.log('Signup successful:', response.data);
        login(response.data.userId);
        navigate('/');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Signup failed due to a connection error';
      setError(errorMsg);
      console.error('Signup error details:', err.response?.data || err);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="loginpage">
      <Navbar isLoginPage={true} />
      <div className='movie-grid blurred'>
        <MovieGrid />
        <AboutSection />
      </div>
      <div className="main-content">
        <div className="login-modal">
          <form className="login-form" onSubmit={handleSignup}>
            <h2>Sign Up</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input 
                type="text" 
                id="name"
                placeholder='Enter your name'
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
                  onClick={togglePasswordVisibility}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-input-container">
                <input 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  id="confirmPassword"
                  placeholder='Confirm your password'
                  className="form-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <img
                  src={showConfirmPassword ? images.eye : images.eyeclose}
                  alt={showConfirmPassword ? 'Hide password' : 'Show password'}
                  className="password-toggle-icon"
                  onClick={toggleConfirmPasswordVisibility}
                />
              </div>
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
