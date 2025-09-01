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
  // if user is not log in then show the message to log
  useEffect(() => {
    const fetchBookings = async () => {
      if (!userId) {
        setError("Please log in to see your bookings.");
        return;
      }
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/bookings/user/${userId}`);
        if (response.data.success && Array.isArray(response.data.bookings)) {
          setBookings(response.data.bookings);
          setError(null);
        }
      } catch (err) {
        setError('Failed to load bookings. Please try again later.');
        console.error('Error fetching bookings:', err);
      }
    };
    fetchBookings();
  }, [userId]);
   // to delete the booking. when click the delete, send the request to the backend and remove it
  const handleDelete = async (bookingId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to cancel this booking?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`http://localhost:8080/api/v1/bookings/${bookingId}`);
          if (response.data.success) {
            setBookings(bookings.filter(b => b.booking_id !== bookingId));
            Swal.fire('Cancelled!', 'The booking has been cancelled.', 'success');
          }
        } catch (error) {
          Swal.fire('Error', 'Failed to cancel booking.', 'error');
        }
      }
    });
  };
  // convert time into read time 
  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const parts = timeString.split(':');
    if (parts.length < 2) return 'Invalid Time';
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    if (isNaN(hours) || isNaN(minutes)) return 'Invalid Time';
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = String(minutes).padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };
  // read seats and packages from booking
  const handleShowDetails = (booking) => {
    let seatsArray = [];
    if (booking.seats) {
      try {
        seatsArray = typeof booking.seats === 'string' 
            ? JSON.parse(booking.seats) 
            : booking.seats;
      } catch (e) {
        console.error("Failed to parse seats JSON:", e);
        seatsArray = [];
      }
    }

    let packagesArray = [];
    if (booking.packages) {
        try {
            packagesArray = typeof booking.packages === 'string'
                ? JSON.parse(booking.packages)
                : booking.packages;
        } catch(e) {
            console.error("Failed to parse packages JSON:", e);
            packagesArray = [];
        }
    }
    
    if (!Array.isArray(seatsArray)) seatsArray = [];
    if (!Array.isArray(packagesArray)) packagesArray = [];

    const seatsText = seatsArray.length > 0
      ? seatsArray.map(seat => seat.replace('Row', '').replace('_Seat', '')).join(', ')
      : 'No seats selected';
      
    const packagesText = packagesArray.length > 0
      ? packagesArray.map(p => `${p.name} (${p.count || 'N/A'})`).join('<br>')
      : 'No packages selected';

    const formattedTime = formatTime(booking.show_time);
    const formattedDate = booking.show_date ? new Date(booking.show_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';
    //shows popup with movie, data, time, seats, price and phone 
    Swal.fire({
      title: 'Booking Details',
      icon: 'info',
      html: ` 
        <div style="text-align: left; padding-left: 20px;">
          <p><strong>Movie:</strong> ${booking.title || 'N/A'}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${formattedTime}</p>
          <p><strong>Seats:</strong> ${seatsText}</p>
          
          <p><strong>Total Price:</strong> LKR ${parseFloat(booking.total_price || 0).toFixed(2)}</p>
          <p><strong>Contact Phone:</strong> ${booking.phone || 'N/A'}</p>
        </div>
      `,
      confirmButtonText: 'Close'
    });
  };
  // no bookings -> show message, else show the details
  return (
    <div className="bookings-page">
      <Navbar />
      <div className="container">
        <h2 className="bookings-title">My Bookings</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="bookings-grid">
          {bookings.length === 0 && !error ? (
            <div className="no-bookings-message">
              <p>You have no bookings yet.</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div key={booking.booking_id} className="booking-card">
                <div className="film-image-container">
                  <img 
                    src={booking.image_url ? `http://localhost:8080${booking.image_url}` : '/assets/images/default.jpg'} 
                    alt={booking.title || 'Movie Poster'}
                    className="film-image"
                  />
                </div>
                <div className="film-details-header">
                  <h3 className="film-name">{booking.title || 'Unknown Movie'}</h3>
                  <p className="film-date">{booking.show_date ? new Date(booking.show_date).toLocaleDateString('en-GB', { day:'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</p>
                  <p className="film-time">{formatTime(booking.show_time)}</p>
                </div>
                <div className="button-group">
                  <button className="delete-btn" onClick={() => handleDelete(booking.booking_id)}>
                    Cancel
                  </button>
                  <button className="update-btn" onClick={() => handleShowDetails(booking)}>
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
