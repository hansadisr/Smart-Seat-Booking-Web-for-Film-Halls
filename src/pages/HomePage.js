import React from 'react';
import Navbar from '../components/Navbar';
import MovieGrid from '../components/MovieGrid';
import AboutSection from '../components/AboutSection';
import Footer from '../components/Footer';
import '../styles/HomePage.css';

const HomePage = ({ onSignInClick }) => {
  return (
    <div className="homepage">
      <Navbar onSignInClick={onSignInClick} />
      <main className="main-content">
        <MovieGrid />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;