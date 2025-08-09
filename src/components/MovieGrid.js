import React, { useState, useEffect, useRef } from "react";
import "../styles/MovieGrid.css";
import { images } from "../constants/theme";

const MovieGrid = () => {
  const movies = [
    {
      id: 1,
      title: "The Shawshank Redemption",
      image: images.Film3
    },
    {
      id: 2,
      title: "The Godfather",
      image: "https://image.tmdb.org/t/p/w300/3bhkrj58Vtu7enYsRolD1fZdja1.jpg"
    },
    {
      id: 3,
      title: "Pulp Fiction",
      image: "https://image.tmdb.org/t/p/w300/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg"
    },
    {
      id: 4,
      title: "Inception",
      image: "https://image.tmdb.org/t/p/w300/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg"
    },
    {
      id: 5,
      title: "The Dark Knight",
      image: "https://image.tmdb.org/t/p/w300/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
    },
    {
      id: 6,
      title: "Fight Club",
      image: "https://image.tmdb.org/t/p/w300/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg"
    },
    {
      id: 7,
      title: "Forrest Gump",
      image: images.Film1
    },
    {
      id: 8,
      title: "The Matrix",
      image: images.Film2
    },
    {
      id: 9,
      title: "Interstellar",
      image: "https://image.tmdb.org/t/p/w300/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
    }
  ];

  // Duplicate list for infinite effect
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
    if (currentIndex >= movies.length) {
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
      <div className="movie-container1">
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
