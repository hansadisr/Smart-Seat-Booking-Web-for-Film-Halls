import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Movie.css';
import { images } from '../constants/theme';

const Movie = () => {
  const navigate = useNavigate();

  const castMembers = [
    { id: 1, name: 'Name', designation: 'Designation', image: images.cast1 },
    { id: 2, name: 'Name', designation: 'Designation', image: images.cast2 },
    { id: 3, name: 'Name', designation: 'Designation', image: images.cast3 },
    { id: 4, name: 'Name', designation: 'Designation', image: images.cast4 },
    { id: 5, name: 'Name', designation: 'Designation', image: images.cast5 },
    { id: 6, name: 'Name', designation: 'Designation', image: images.cast6 }
  ];

  const handleBookTickets = () => {
    navigate('/booking');
  };

  return (
    <div className="home-page">
      <Navbar />

      <div className="movie-container1">
        {/* Film Cover Banner */}
        <div className="film-cover-banner" style={{ backgroundImage: `url(${images.cover1})` }}>
          <div className="film-cover-overlay">
            <div className="film-info-container">
              <div className="cover-image-placeholder" style={{ backgroundImage: `url(${images.Film2})` }}></div>

              <div className="movie-details">
                <h1 className="movie-title">Title</h1>
                <span className="language">Language</span>
                <div className="genre-tags">
                  <span className="genre-tag">Action</span>
                  <span className="genre-tag">Drama</span>
                </div>
                <div className="release-date">Date</div>
                <p className="movie-description">Description</p>
              </div>

              <button 
                className="book-tickets-btn" 
                style={{ position: 'absolute', right: '20px', bottom: '20px' }} 
                onClick={handleBookTickets}
              >
                Book Tickets
              </button>
            </div>
          </div>
        </div>

        {/* Cast Section */}
        <div className="cast-section">
          <h2 className="cast-title">Cast</h2>
          <div className="cast-grid">
            {castMembers.map(member => (
              <div key={member.id} className="cast-member">
                <div className="cast-image-placeholder" style={{ backgroundImage: `url(${member.image})` }}></div>
                <div className="cast-info">
                  <div className="cast-name">{member.name}</div>
                  <div className="cast-designation">{member.designation}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Movie;