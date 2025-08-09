import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Movie from './pages/Movie';
import Booking from './pages/Booking';
import BookingList from './pages/BookingList';
import Location from './pages/Location';
import Movies from './pages/Movies';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/movie" element={<Movie />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/bookingList" element={<BookingList />} />
        <Route path="/location" element={<Location />} />
        <Route path="/movies" element={<Movies />} />
      </Routes>
    </Router>
  );
}

export default App;
