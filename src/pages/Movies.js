import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Movies.css';

const Movies = () => {
  const [showAllOnScreening, setShowAllOnScreening] = useState(false);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [onScreeningMovies, setOnScreeningMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/movies/all');
        if (response.data.success) {
          const allMovies = response.data.data;
          setOnScreeningMovies(allMovies.filter(m => m.status === 'onscreening'));
          setUpcomingMovies(allMovies.filter(m => m.status === 'upcoming'));
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    fetchMovies();
  }, []);

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
        <Link to={`/movie/${movie.movie_id}`} key={movie.movie_id} className="movie-card1">
          <div className="movie-image-container">
            <img src={movie.image_url} alt={movie.title} />
            <div className="movie-details1-overlay">
              <div className="movie-details1">
                <h4>{movie.title}</h4>
                <div className="movie-info-row">
                  <span className="movie-language">English</span> {/* Assume or add language field if needed */}
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
