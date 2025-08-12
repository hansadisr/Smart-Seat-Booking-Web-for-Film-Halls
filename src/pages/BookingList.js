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
      if (!userId) {
        setError("Please log in to see your bookings.");
        return;
      }
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/bookings/user/${userId}`);
        if (response.data.success) {
          setBookings(response.data.bookings);
          setError(null);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
            setBookings([]); // No bookings found, which is not an error
            setError(null);
        } else {
            setError('Failed to load bookings. Please try again later.');
            console.error('Error fetching bookings:', err);
        }
      }
    };
    fetchBookings();
  }, [userId]);

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
  
  // Helper function to format 24-hour time to 12-hour AM/PM format
  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const [hours, minutes] = timeString.split(':');
    const h = parseInt(hours);
    const m = parseInt(minutes);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHours = h % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${String(formattedHours).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
  };

  const handleShowDetails = (booking) => {
    const seatsText = Array.isArray(booking.seats) && booking.seats.length > 0
      ? booking.seats.map(seat => seat.replace('Row', '').replace('_Seat', '')).join(', ')
      : 'No seats selected';
      
    const packagesText = Array.isArray(booking.packages) && booking.packages.length > 0
      ? booking.packages.map(p => `${p.name} (${p.count || 0})`).join('<br>')
      : 'No packages selected';

    const formattedTime = formatTime(booking.show_time);
    const formattedDate = booking.show_date ? new Date(booking.show_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

    Swal.fire({
      title: 'Booking Details',
      html: `
        <div style="text-align: left; padding-left: 20px;">
          <p><strong>Movie:</strong> ${booking.title || 'N/A'}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${formattedTime}</p>
          <p><strong>Seats:</strong> ${seatsText}</p>
          <p><strong>Packages:</strong></p>
          <div style="padding-left: 20px;">${packagesText}</div>
          <p><strong>Total Price:</strong> LKR ${parseFloat(booking.total_price || 0).toFixed(2)}</p>
          <p><strong>Contact Phone:</strong> ${booking.phone || 'N/A'}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Close'
    });
  };

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
                    src={booking.image_url || '/assets/images/default.jpg'} 
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
                  <button 
                    className="delete-btn" 
                    onClick={() => handleDelete(booking.booking_id)}
                  >
                    Cancel
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
