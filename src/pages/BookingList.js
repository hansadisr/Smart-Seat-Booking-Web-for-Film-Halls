import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/BookingList.css'
import { images } from '../constants/theme';

const BookingList = () => {
  const bookings = [
    { filmName: 'Avengers: Endgame', date: '2024-01-15', time: '7:30 PM', image: images.Film1 },
    { filmName: 'Spider-Man', date: '2024-01-16', time: '9:00 PM', image: images.Film2 },
    { filmName: 'Batman', date: '2024-01-17', time: '6:45 PM', image: images.Film3 },
    { filmName: 'Wonder Woman', date: '2024-01-18', time: '8:15 PM', image: images.Film4 },
    { filmName: 'Iron Man', date: '2024-01-19', time: '7:00 PM', image: images.Film1 },
    { filmName: 'Captain Marvel', date: '2024-01-20', time: '9:30 PM', image: images.Film2 },
  ];

  return (
    <div className="bookings-page">
      <Navbar />
      <div className="container">
        <h2 className="bookings-title">Bookings</h2>
        <div className="bookings-grid">
          {bookings.map((booking, index) => (
            <div key={index} className="booking-card">
              <div className="film-details-header">
                <h3 className="film-name">{booking.filmName}</h3>
                <p className="film-date">{booking.date}</p>
                <p className="film-time">{booking.time}</p>
              </div>
              <div className="film-image-container">
                <img 
                  src={booking.image} 
                  alt={booking.filmName}
                  className="film-image"
                />
              </div>
              <div className="button-group">
                <button className="delete-btn">Delete</button>
                <button className="update-btn">Update</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingList;