import React, { useState, useEffect, useRef } from "react";
import "../styles/MovieGrid.css";
import { images } from "../constants/theme";

const MovieGrid = () => {
  const movies = [
    { id: 1, title: "Film 1", image: images.Film1 },
    { id: 2, title: "Cover 2", image: images.cover2 },
    { id: 3, title: "Film 2", image: images.Film2 },
    { id: 4, title: "Cover 15", image: images.cover15 },
    { id: 5, title: "Film 3", image: images.Film3 },
    { id: 6, title: "Cover 13", image: images.cover13 },
    { id: 7, title: "Film 4", image: images.Film4avif },
    { id: 8, title: "Cover 14", image: images.cover14 },
    { id: 9, title: "Film 5", image: images.Film5 },
    { id: 10, title: "Cover 1", image: images.cover1 },
    { id: 11, title: "Cover 3", image: images.cover3 },
    { id: 12, title: "Cover 4", image: images.cover4 },
    { id: 13, title: "Cover 5", image: images.cover5 },
    { id: 14, title: "Cover 11", image: images.cover11 },
    { id: 15, title: "Cover 12", image: images.cover12 },
  ];
  
  const movieList = [...movies, ...movies];
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

useEffect(() => {
    if (currentIndex >= movies.length * 2) {
      setTimeout(() => {
        setCurrentIndex(0);
        trackRef.current.style.transition = "none";
        trackRef.current.style.transform = `translateX(0px)`;
      }, 500);
    } else {
      trackRef.current.style.transition = "transform 0.5s ease";
      trackRef.current.style.transform = `translateX(-${currentIndex * 285}px)`;
    }
  }, [currentIndex, movies.length]);

  return (
    <section className="movie-section">
      <div className="movie-container2">
        <div className="carousel-wrapper1">
          <div className="carousel-track1" ref={trackRef}>
            {movieList.map((movie, index) => (
              <div key={`${movie.id}-${index}`} className="movie-card">
                <img src={movie.image} alt={movie.title} />
                {/* <div className="movie-overlay">
                  <h3>{movie.title}</h3>
                  <button>View Details</button>
                </div> */}
              </div>
            ))}
          </div>

          {/* Pagination Dots ON TOP of carousel */}
          <div className="carousel-dots1 overlay-dots">
            {movies.map((_, idx) => (
              <span
                key={idx}
                className={`dot ${currentIndex % movies.length === idx ? "active" : ""}`}
              ></span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MovieGrid;
