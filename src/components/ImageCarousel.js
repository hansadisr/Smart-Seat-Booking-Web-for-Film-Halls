import React, { useState, useEffect, useRef } from 'react';
import '../styles/ImageCarousel.css';

const ImageCarousel = ({ images, autoPlayInterval = 4000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isAutoPlaying && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % images.length);
      }, autoPlayInterval);
    }
    return () => clearInterval(intervalRef.current);
  }, [isAutoPlaying, images.length, autoPlayInterval]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(prev => (prev + 1) % images.length);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToSlide = (index) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const handleMouseEnter = () => clearInterval(intervalRef.current);
  const handleMouseLeave = () => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % images.length);
      }, autoPlayInterval);
    }
  };

  if (!images || images.length === 0) {
    return <div className="carousel-placeholder">No images available</div>;
  }

  return (
    <div className="carousel-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="carousel-wrapper">
        <div className="carousel-track" style={{ transform: `translateX(-${currentIndex * (100 / images.length)}%)` }}>
          {images.map((image, index) => (
            <div key={index} className="carousel-slide">
              <img src={image} alt={`Slide ${index + 1}`} className="carousel-image" />
            </div>
          ))}
        </div>
        <button className="carousel-btn carousel-btn-prev" onClick={goToPrevious} disabled={images.length <= 1}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button className="carousel-btn carousel-btn-next" onClick={goToNext} disabled={images.length <= 1}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
        </button>
        <div className="carousel-dots">
          {images.map((_, index) => (
            <button key={index} className={`carousel-dot ${index === currentIndex ? 'active' : ''}`} onClick={() => goToSlide(index)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;