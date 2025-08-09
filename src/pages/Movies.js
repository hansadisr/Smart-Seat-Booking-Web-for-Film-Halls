import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Movies.css';

// Import 8 On Screening images
import on1 from '../assets/images/Film1.jpg';
import on2 from '../assets/images/Film1.jpg';
import on3 from '../assets/images/Film2.jpg';
import on4 from '../assets/images/Film2.jpg';
import on5 from '../assets/images/Film2.jpg';
import on6 from '../assets/images/Film3.webp';
import on7 from '../assets/images/Film3.webp';
import on8 from '../assets/images/Film3.webp';

// Import 7 Upcoming images
import up1 from '../assets/images/Film4.avif';
import up2 from '../assets/images/Film4.avif';
import up3 from '../assets/images/Film4.avif';
import up4 from '../assets/images/Film4.avif';
import up5 from '../assets/images/Film4.avif';
import up6 from '../assets/images/Film4.avif';
import up7 from '../assets/images/Film4.avif';
import { images } from '../constants/theme';

const Movies = () => {
  const [showAllOnScreening, setShowAllOnScreening] = useState(false);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const onScreeningMovies = [
    { id: 1, title: 'Movie 1', language: 'English', duration: '2h 15m', image: images.Film1 },
    { id: 2, title: 'Movie 2', language: 'Sinhala', duration: '1h 50m', image: on2 },
    { id: 3, title: 'Movie 3', language: 'Tamil', duration: '2h 05m', image: on3 },
    { id: 4, title: 'Movie 4', language: 'English', duration: '2h 00m', image: on4 },
    { id: 5, title: 'Movie 5', language: 'Sinhala', duration: '1h 45m', image: on5 },
    { id: 6, title: 'Movie 6', language: 'Tamil', duration: '2h 20m', image: on6 },
    { id: 7, title: 'Movie 7', language: 'English', duration: '2h 10m', image: on7 },
    { id: 8, title: 'Movie 8', language: 'English', duration: '2h 30m', image: on8 }
  ];

  const upcomingMovies = [
    { id: 1, title: 'Upcoming 1', language: 'English', duration: '2h 15m', image: up1 },
    { id: 2, title: 'Upcoming 2', language: 'Sinhala', duration: '1h 50m', image: up2 },
    { id: 3, title: 'Upcoming 3', language: 'Tamil', duration: '2h 05m', image: up3 },
    { id: 4, title: 'Upcoming 4', language: 'English', duration: '2h 00m', image: up4 },
    { id: 5, title: 'Upcoming 5', language: 'Sinhala', duration: '1h 45m', image: up5 },
    { id: 6, title: 'Upcoming 6', language: 'Tamil', duration: '2h 20m', image: up6 },
    { id: 7, title: 'Upcoming 7', language: 'English', duration: '2h 10m', image: up7 }
  ];

  const filterMovies = (movies) => {
    if (!searchQuery) return movies;
    return movies.filter(movie =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderMovies = (movies, showAll) => {
    const filteredMovies = filterMovies(movies);
    const moviesToShow = showAll ? filteredMovies : filteredMovies.slice(0, 6);
    return moviesToShow.length > 0 ? (
      moviesToShow.map(movie => (
        <Link to="/movie" key={movie.id} className="movie-card1">
          <div className="movie-image-container">
            <img src={movie.image} alt={movie.title} />
            <div className="movie-details1-overlay">
              <div className="movie-details1">
                <h4>{movie.title}</h4>
                <div className="movie-info-row">
                  <span className="movie-language">{movie.language}</span>
                  <span className="movie-duration">{movie.duration}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))
    ) : (
      <p>No movies found matching "{searchQuery}"</p>
    );
  };

  return (
    <div className="movies-page">
      <Navbar />
      <div className="movie-container">
        {/* On Screening Section */}
        <section className="movies-section">
          <h2>On Screening <span className="see-all-link" onClick={() => setShowAllOnScreening(!showAllOnScreening)}>See All</span></h2>
          <div className="movies-grid">
            {renderMovies(onScreeningMovies, showAllOnScreening)}
          </div>
        </section>

        {/* Upcoming Section */}
        <section className="movies-section">
          <h2>Upcoming <span className="see-all-link" onClick={() => setShowAllUpcoming(!showAllUpcoming)}>See All</span></h2>
          <div className="movies-grid">
            {renderMovies(upcomingMovies, showAllUpcoming)}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Movies;
