import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ImageCarousel from '../components/ImageCarousel';
import '../styles/Location.css';
import { images } from '../constants/theme';

const Location = () => {
  // Sample images for the carousel - replace with your actual images
  const carouselImages = [
    images.filmhall,
    images.hall,
    images.ThreeD,
    images.filmhall,
    images.hall,
  ];

  const facilities = [
    {
      title: '3D Film Hall',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
      image: images.filmhall
    },
    {
      title: 'Luxury Film Hall',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
      image: images.ThreeD
    },
    {
      title: 'Car Parking Area',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
      image: images.hall
    }
  ];

  return (
    <div className="location-page">
      <Navbar />
      <div className="location-container">
        <ImageCarousel images={carouselImages} />
        <div className="facilities-section">
          {facilities.map((facility, index) => (
            <div key={index} className="facility-item">
              <div className="facility-content">
                <div className="facility-text">
                  <h2 className="facility-title">{facility.title}</h2>
                  <p className="facility-description">{facility.description}</p>
                </div>
                {facility.image && (
                  <div className="facility-image">
                    <img src={facility.image} alt={facility.title} />
                  </div>
                )}
              </div>
              {index === 1 && <h3 className="facilities-heading">Facilities</h3>}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Location;