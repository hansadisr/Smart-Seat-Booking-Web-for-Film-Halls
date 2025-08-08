import React, { useState } from "react";
import "../styles/AboutSection.css";
import { images } from "../constants/theme";

const AboutSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slides with images + text
  const aboutSlides = [
    {
      id: 1,
      image: images.ThreeD,
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
      id: 2,
      image: images.hall,
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
    },
    {
      id: 3,
      image: images.filmhall,
      content:
        "It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages."
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % aboutSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + aboutSlides.length) % aboutSlides.length
    );
  };

  return (
    <section className="about-section">
      <div className="about-container">
        <h2 className="about-title">About Us</h2>

        <div className="about-content">
          {/* Image / Carousel Section */}
          <div className="about-image-section">
            <button
              className="about-nav-arrow about-nav-left"
              onClick={prevSlide}
            >
              ❮
            </button>

            <img
              src={aboutSlides[currentSlide].image}
              alt={`About Slide ${currentSlide + 1}`}
              className="about-image"
            />

            <button
              className="about-nav-arrow about-nav-right"
              onClick={nextSlide}
            >
              ❯
            </button>

            <div className="about-indicators">
              {aboutSlides.map((_, index) => (
                <button
                  key={index}
                  className={`about-indicator ${
                    index === currentSlide ? "active" : ""
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>

          {/* Text Section */}
          <div className="about-text-section">
            <p className="about-text">{aboutSlides[currentSlide].content}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
