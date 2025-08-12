import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PurchaseSummary from '../components/PurchaseSummary';
import { images } from '../constants/theme';
import '../styles/Booking.css';

const Booking = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedShowId, setSelectedShowId] = useState(null);
  const [showPurchaseSummary, setShowPurchaseSummary] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableTimes, setAvailableTimes] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [packages, setPackages] = useState([
    { name: 'ODC Full', price: 'LKR 1500.00', count: 0 },
    { name: 'ODC Half', price: 'LKR 750.00', count: 0 },
    { name: 'Box', price: 'LKR 3200.00', count: 0 },
  ]);

  const boxSeats = [
    { row: 'A', leftSeats: ['1', '2', '3'], rightSeats: ['4', '5'] },
    { row: 'B', leftSeats: ['1', '2', '3'], rightSeats: ['4', '5'] },
  ];

  const odcSeats = [
    { row: 'C', leftSeats: ['1', '2', '3', '4', '5', '6'], rightSeats: ['7', '8', '9', '10', '11'] },
    { row: 'D', leftSeats: ['1', '2', '3', '4', '5', '6'], rightSeats: ['7', '8', '9', '10', '11'] },
    { row: 'E', leftSeats: ['1', '2', '3', '4', '5', '6'], rightSeats: ['7', '8', '9', '10', '11'] },
    { row: 'F', leftSeats: ['1', '2', '3', '4', '5', '6'], rightSeats: ['7', '8', '9', '10', '11'] },
    { row: 'G', leftSeats: ['1', '2', '3', '4', '5', '6'], rightSeats: ['7', '8', '9', '10', '11'] },
    { row: 'H', leftSeats: ['1', '2', '3', '4', '5', '6'], rightSeats: ['7', '8', '9', '10', '11'] },
    { row: 'I', leftSeats: ['', '1', '2', '3', '4', '5'], rightSeats: ['6', '7', '8', '9'] },
    { row: 'J', leftSeats: ['', '', '1', '2', '3', '5'], rightSeats: ['4', '8', '9'] },
  ];

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/movies/${movieId}`);
        if (response.data.success) {
          setMovie(response.data.movie);
        }
      } catch (error) {
        console.error('Error fetching movie:', error);
      }
    };
    fetchMovie();
  }, [movieId]);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        const response = await axios.get(`http://localhost:8080/api/v1/shows/for_movie`, {
          params: { movie_id: movieId, date: formattedDate }
        });
        if (response.data.success) {
          setAvailableTimes(response.data.shows.map(s => ({ time: s.show_time.slice(0,5), show_id: s.show_id })));
        }
      } catch (error) {
        console.error('Error fetching shows:', error);
      }
    };
    fetchShows();
    setSelectedTime(null);
    setSelectedShowId(null);
    setSelectedSeats([]);
    setBookedSeats([]);
    setPackages(packages.map(pkg => ({ ...pkg, count: 0 })));
  }, [selectedDate, movieId]);

  useEffect(() => {
    if (selectedShowId) {
      const fetchBookedSeats = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/v1/shows/${selectedShowId}/booked_seats`);
          if (response.data.success) {
            setBookedSeats(response.data.bookedSeats);
          }
        } catch (error) {
          console.error('Error fetching booked seats:', error);
          setBookedSeats([]); // Fallback to empty array on error
        }
      };
      fetchBookedSeats();
      setSelectedSeats([]);
      setPackages(packages.map(pkg => ({ ...pkg, count: 0 })));
    }
  }, [selectedShowId]);

  const toggleSeat = (row, seat, isBox = false) => {
    const seatId = `Row${row}_Seat${seat}`; // Using RowX_SeatY format
    if (!seat || bookedSeats.includes(seatId)) return;

    setSelectedSeats(prevSelected => {
      const isSelected = prevSelected.includes(seatId);
      const newSelectedSeats = isSelected
        ? prevSelected.filter(id => id !== seatId)
        : [...prevSelected, seatId];

      if (isBox) {
        const boxCount = newSelectedSeats.filter(seat => seat.startsWith('RowA_') || seat.startsWith('RowB_')).length;
        setPackages(prevPackages => prevPackages.map(pkg =>
          pkg.name === 'Box' ? { ...pkg, count: boxCount } : pkg
        ));
      }

      return newSelectedSeats;
    });
  };

  const handleTimeSelect = (time, showId) => {
    setSelectedTime(time);
    setSelectedShowId(showId);
  };

  const handlePackageChange = (name, action) => {
    if (name === 'Box') return;
    const totalSelectedSeats = selectedSeats.filter(seat => !seat.startsWith('RowA_') && !seat.startsWith('RowB_')).length;
    const totalTickets = packages.reduce((sum, pkg) => pkg.name !== 'Box' ? sum + pkg.count : sum, 0);

    setPackages(packages.map(pkg => {
      if (pkg.name !== name) return pkg;
      if (action === 'increment') {
        if (totalTickets >= totalSelectedSeats) return pkg;
        return { ...pkg, count: pkg.count + 1 };
      } else {
        return { ...pkg, count: Math.max(0, pkg.count - 1) };
      }
    }));
  };

  const getSeatStatus = (row, seat) => {
    if (!seat) return 'empty';
    const seatId = `Row${row}_Seat${seat}`;
    if (selectedSeats.includes(seatId)) return 'selected';
    if (bookedSeats.includes(seatId)) return 'booked';
    return 'available';
  };

  const handleProceedClick = () => {
    const totalTickets = packages.reduce((sum, pkg) => sum + pkg.count, 0);
    const totalSelectedSeats = selectedSeats.length;

    if (totalSelectedSeats === 0) {
      alert('Please select at least one seat');
      return;
    }

    if (totalTickets !== totalSelectedSeats) {
      alert('Please select package types for all selected seats');
      return;
    }

    setShowPurchaseSummary(true);
  };

  const bookingData = {
    selectedSeats,
    time: selectedTime,
    date: selectedDate.toISOString().split('T')[0],
    packages: packages.filter(pkg => pkg.count > 0),
    showId: selectedShowId,
    movieTitle: movie ? movie.title : ''
  };

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="booking-page">
      <Navbar />
      <div className="booking-container">
        <div className="film-cover-section">
          <img className="film-cover-bg" src={movie.cover_image} alt="Cover Background" />
          <div className="film-cover-overlay1">
            <img className="film-poster1" src={movie.image_url} alt="Movie Poster" />
            <div className="movie-info">
              <h1 className="movie-title1">{movie.title}</h1>
              <div className="movie-subtitle">English</div>
              <div className="movie-tags">
                {movie.genre.split(',').map((g, idx) => <span key={idx} className="tag">{g.trim()}</span>)}
              </div>
              <p className="movie-date">{movie.release_date}</p>
            </div>
          </div>
        </div>
        <div className="date-section">
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            min={new Date().toISOString().split('T')[0]}
            className="date-text"
            style={{ border: 'none' }}
          />
        </div>

        <div className="showtimes">
          {availableTimes.map((timeSlot) => (
            <button
              key={timeSlot.show_id}
              onClick={() => handleTimeSelect(timeSlot.time, timeSlot.show_id)}
              className={`showtime-btn ${selectedTime === timeSlot.time ? 'selected' : ''}`}
            >
              <div className="time">{timeSlot.time}</div>
              <div className="session">a. m.</div>
            </button>
          ))}
        </div>

        <h3 className="section-title">Box Seats</h3>
        {boxSeats.map((row) => (
          <div key={row.row} className="seat-row">
            <span className="row-label">{row.row}</span>
            <div className="seats-group">
              {row.leftSeats.map((seat, idx) => {
                const status = getSeatStatus(row.row, seat);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleSeat(row.row, seat, true)}
                    className={`seat box-seat ${status}`}
                    disabled={status === 'empty' || status === 'booked'}
                  >
                    {seat}
                  </button>
                );
              })}
            </div>
            <div className="seats-gap"></div>
            <div className="seats-group">
              {row.rightSeats.map((seat, idx) => {
                const status = getSeatStatus(row.row, seat);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleSeat(row.row, seat, true)}
                    className={`seat box-seat ${status}`}
                    disabled={status === 'empty' || status === 'booked'}
                  >
                    {seat}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <h3 className="section-title">ODC Seats</h3>
        {odcSeats.map((row) => (
          <div key={row.row} className="seat-row">
            <span className="row-label">{row.row}</span>
            <div className="seats-group">
              {row.leftSeats.map((seat, idx) => {
                const status = getSeatStatus(row.row, seat);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleSeat(row.row, seat)}
                    className={`seat odc-seat ${status}`}
                    disabled={status === 'empty' || status === 'booked'}
                  >
                    {seat}
                  </button>
                );
              })}
            </div>
            <div className="seats-gap"></div>
            <div className="seats-group">
              {row.rightSeats.map((seat, idx) => {
                const status = getSeatStatus(row.row, seat);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleSeat(row.row, seat)}
                    className={`seat odc-seat ${status}`}
                    disabled={status === 'empty' || status === 'booked'}
                  >
                    {seat}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="screen">
          <div className="screen-text">Screen</div>
        </div>

        <div className="summary-section">
          <p className="selection-text">
            {selectedSeats.filter(seat => !seat.startsWith('RowA_') && !seat.startsWith('RowB_')).length} ODC ticket(s) and {selectedSeats.filter(seat => seat.startsWith('RowA_') || seat.startsWith('RowB_')).length} Box ticket(s) selected
            {selectedSeats.filter(seat => !seat.startsWith('RowA_') && !seat.startsWith('RowB_')).length > 0 && ', please select ODC attendees'}
          </p>
          {packages.map((pkg) => (
            <div key={pkg.name} className="package-row">
              <div className="package-info">
                <div className="package-name">{pkg.name}</div>
                <div className="package-price">{pkg.price}</div>
              </div>
              {pkg.name === 'Box' ? (
                <div className="quantity-controls">
                  <span className="quantity">{pkg.count}</span>
                </div>
              ) : (
                <div className="quantity-controls">
                  <button
                    onClick={() => handlePackageChange(pkg.name, 'decrement')}
                    className="quantity-btn minus"
                    disabled={pkg.count === 0}
                  >-</button>
                  <span className="quantity">{pkg.count}</span>
                  <button 
                    onClick={() => handlePackageChange(pkg.name, 'increment')} 
                    className="quantity-btn plus"
                    disabled={packages.reduce((sum, p) => p.name !== 'Box' ? sum + p.count : sum, 0) >= selectedSeats.filter(seat => !seat.startsWith('RowA_') && !seat.startsWith('RowB_')).length}
                  >+</button>
                </div>
              )}
            </div>
          ))}
          <button className="proceed-btn" onClick={handleProceedClick}>
            Proceed
          </button>
        </div>
      </div>
      
      <PurchaseSummary 
        isOpen={showPurchaseSummary}
        onClose={() => setShowPurchaseSummary(false)}
        bookingData={bookingData}
      />
      
      <Footer />
    </div>
  );
};

export default Booking;
