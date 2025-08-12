import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Movie.css';

const Movie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [casts, setCasts] = useState([]);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/movies/${id}`);
        if (response.data.success) {
          setMovie(response.data.movie);
          setCasts(response.data.casts);
        }
      } catch (error) {
        console.error('Error fetching movie:', error);
      }
    };
    fetchMovie();
  }, [id]);

  const handleBookTickets = () => {
    navigate(`/booking/${id}`);
  };

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="home-page">
      <Navbar />

      <div className="movie-container1">
        {/* Film Cover Banner */}
        <div className="film-cover-banner" style={{ backgroundImage: `url(${movie.cover_image})` }}>
          <div className="film-cover-overlay">
            <div className="film-info-container">
              <div className="cover-image-placeholder" style={{ backgroundImage: `url(${movie.image_url})` }}></div>

              <div className="movie-details">
                <h1 className="movie-title">{movie.title}</h1>
                <span className="language">English</span>
                <div className="genre-tags">
                  {movie.genre.split(',').map((g, idx) => <span key={idx} className="genre-tag">{g.trim()}</span>)}
                </div>
                <div className="release-date">{movie.release_date}</div>
                <p className="movie-description">{movie.description}</p>
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
            {casts.map(member => (
              <div key={member.cast_id} className="cast-member">
                <div className="cast-image-placeholder" style={{ backgroundImage: `url(${member.profile_pic_url})` }}></div>
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
