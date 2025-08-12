import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Swal from 'sweetalert2';
import '../styles/BookingList.css';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/bookings/user/${userId}`);
        if (response.data.success) {
          setBookings(response.data.bookings);
          setError(null);
        } else {
          setError(response.data.message || 'Failed to fetch bookings');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error.response ? error.response.data : error.message);
        setError(error.response?.data?.message || 'Failed to load bookings. Please try again later.');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'An unexpected error occurred.',
        });
      }
    };
    if (userId) fetchBookings();
  }, [userId]);

  const handleDelete = async (bookingId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete this booking?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#3498db',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`http://localhost:8080/api/v1/bookings/${bookingId}`);
          if (response.data.success) {
            setBookings(bookings.filter(b => b.booking_id !== bookingId));
            Swal.fire('Deleted!', 'The booking has been deleted.', 'success');
          }
        } catch (error) {
          Swal.fire('Error', 'Failed to delete booking', 'error');
        }
      }
    });
  };

  const handleShowDetails = (booking) => {
    const seatsText = Array.isArray(booking.seats) && booking.seats.length > 0
      ? booking.seats.map(seat => seat).join(', ')
      : booking.seats || 'No seats selected';
    const packagesText = Array.isArray(booking.packages) && booking.packages.length > 0
      ? booking.packages.map(p => `${p.name} (${p.count || 0})`).join(', ')
      : booking.packages || 'No packages selected';

    Swal.fire({
      title: 'Booking Details',
      html: `
        <p><strong>Movie:</strong> ${booking.title || 'N/A'}</p>
        <p><strong>Date:</strong> ${booking.show_date || 'N/A'}</p>
        <p><strong>Time:</strong> ${booking.show_time || 'N/A'}</p>
        <p><strong>Seats:</strong> ${seatsText}</p>
        <p><strong>Packages:</strong> ${packagesText}</p>
        <p><strong>Total Price:</strong> ${booking.total_price || 'N/A'}</p>
      `,
      icon: 'info',
      confirmButtonText: 'Close'
    });
  };

  return (
    <div className="bookings-page">
      <Navbar />
      <div className="container">
        <h2 className="bookings-title">Bookings</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="bookings-grid">
          {bookings.length === 0 && !error ? (
            <p>No bookings found.</p>
          ) : (
            bookings.map((booking) => (
              <div key={booking.booking_id} className="booking-card">
                <div className="film-details-header">
                  <h3 className="film-name">{booking.title || 'Unknown Movie'}</h3>
                  <p className="film-date">{booking.show_date || 'N/A'}</p>
                  <p className="film-time">{booking.show_time || 'N/A'}</p>
                </div>
                <div className="film-image-container">
                  <img 
                    src={booking.image_url || '/assets/images/default.jpg'} 
                    alt={booking.title || 'Movie Poster'}
                    className="film-image"
                  />
                </div>
                <div className="button-group">
                  <button 
                    className="delete-btn" 
                    onClick={() => handleDelete(booking.booking_id)}
                  >
                    Delete
                  </button>
                  <button 
                    className="update-btn"
                    onClick={() => handleShowDetails(booking)}
                  >
                    Show Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingList;
