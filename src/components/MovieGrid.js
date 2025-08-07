import React, { useState } from 'react';
import '../styles/MovieGrid.css';

const MovieGrid = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Mock movie data - replace with actual data
  const movies = Array(8).fill().map((_, index) => ({
    id: index + 1,
    title: `Movie ${index + 1}`,
    image: null // Will show placeholder
  }));

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(movies.length / 4));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(movies.length / 4)) % Math.ceil(movies.length / 4));
  };

  return (
    <section className="movie-section">
      <div className="movie-container">
        <div className="movie-grid-wrapper">
          <button className="nav-arrow nav-arrow-left" onClick={prevSlide}>
            ‹
          </button>
          
          <div className="movie-grid">
            {movies.slice(currentSlide * 4, (currentSlide + 1) * 4).map((movie) => (
              <div key={movie.id} className="movie-card">
                <div className="movie-placeholder">
                  <span>Movie Poster</span>
                </div>
              </div>
            ))}
          </div>
          
          <button className="nav-arrow nav-arrow-right" onClick={nextSlide}>
            ›
          </button>
        </div>
        
        <div className="slide-indicators">
          {Array(Math.ceil(movies.length / 4)).fill().map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieGrid;