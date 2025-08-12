import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PurchaseSummary from '../components/PurchaseSummary';
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
          setAvailableTimes(response.data.shows.map(s => ({ time: s.show_time.slice(0, 5), show_id: s.show_id })));
        } else {
          setAvailableTimes([]);
        }
      } catch (error) {
        console.error('Error fetching shows:', error);
        setAvailableTimes([]);
      }
    };
    if (movieId) {
        fetchShows();
    }
    setSelectedTime(null);
    setSelectedShowId(null);
    setSelectedSeats([]);
    setBookedSeats([]);
    setPackages(pkgs => pkgs.map(pkg => ({ ...pkg, count: 0 })));
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
          setBookedSeats([]);
        }
      };
      fetchBookedSeats();
      setSelectedSeats([]);
      setPackages(pkgs => pkgs.map(pkg => ({ ...pkg, count: 0 })));
    }
  }, [selectedShowId]);

  const toggleSeat = (row, seat) => {
    const seatId = `Row${row}_Seat${seat}`;
    if (!seat || bookedSeats.includes(seatId)) return;

    setSelectedSeats(prevSelected => {
      const isSelected = prevSelected.includes(seatId);
      const newSelectedSeats = isSelected
        ? prevSelected.filter(id => id !== seatId)
        : [...prevSelected, seatId];

      const boxCount = newSelectedSeats.filter(s => s.startsWith('RowA_') || s.startsWith('RowB_')).length;
      const odcCount = newSelectedSeats.length - boxCount;

      setPackages(prevPackages => {
        let updatedPkgs = prevPackages.map(pkg => {
          if (pkg.name === 'Box') {
            return { ...pkg, count: boxCount };
          }
          return pkg;
        });

        const totalOdcTickets = updatedPkgs.reduce((sum, pkg) => (pkg.name.startsWith('ODC') ? sum + pkg.count : sum), 0);
        
        if (totalOdcTickets > odcCount) {
            let diff = totalOdcTickets - odcCount;
            const halfTickets = updatedPkgs.find(p => p.name === 'ODC Half');
            const fullTickets = updatedPkgs.find(p => p.name === 'ODC Full');
            
            const halfToReduce = Math.min(diff, halfTickets.count);
            halfTickets.count -= halfToReduce;
            diff -= halfToReduce;
            
            if (diff > 0) {
                const fullToReduce = Math.min(diff, fullTickets.count);
                fullTickets.count -= fullToReduce;
            }
        }
        return updatedPkgs;
      });

      return newSelectedSeats;
    });
  };

  const handleTimeSelect = (time, showId) => {
    setSelectedTime(time);
    setSelectedShowId(showId);
  };

  const handlePackageChange = (name, action) => {
    if (name === 'Box') return;
    const totalSelectedODCSeats = selectedSeats.filter(seat => !seat.startsWith('RowA_') && !seat.startsWith('RowB_')).length;
    const totalODCTickets = packages.reduce((sum, pkg) => pkg.name.startsWith('ODC') ? sum + pkg.count : sum, 0);

    setPackages(packages.map(pkg => {
      if (pkg.name !== name) return pkg;
      if (action === 'increment') {
        if (totalODCTickets >= totalSelectedODCSeats) return pkg;
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

    if (!selectedTime) {
      alert('Please select a show time.');
      return;
    }

    if (totalSelectedSeats === 0) {
      alert('Please select at least one seat.');
      return;
    }

    if (totalTickets !== totalSelectedSeats) {
      alert('Please select ticket types for all your selected seats.');
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
              <p className="movie-date">{new Date(movie.release_date).toLocaleDateString()}</p>
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
          {availableTimes.map((timeSlot) => {
            const hours = parseInt(timeSlot.time.split(':')[0]);
            const session = hours >= 12 ? 'p. m.' : 'a. m.';
            
            return (
              <button
                key={timeSlot.show_id}
                onClick={() => handleTimeSelect(timeSlot.time, timeSlot.show_id)}
                className={`showtime-btn ${selectedTime === timeSlot.time ? 'selected' : ''}`}
              >
                <div className="time">{timeSlot.time}</div>
                <div className="session">{session}</div>
              </button>
            );
          })}
        </div>

        {selectedTime && (
          <>
            <h3 className="section-title">Box Seats</h3>
            {boxSeats.map((row) => (
              <div key={row.row} className="seat-row">
                <span className="row-label">{row.row}</span>
                <div className="seats-group">
                  {row.leftSeats.map((seat, idx) => {
                    const status = getSeatStatus(row.row, seat);
                    return (
                      <button
                        key={`${row.row}-left-${idx}`}
                        onClick={() => toggleSeat(row.row, seat)}
                        className={`seat box-seat ${status}`}
                        disabled={status === 'empty'}
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
                        key={`${row.row}-right-${idx}`}
                        onClick={() => toggleSeat(row.row, seat)}
                        className={`seat box-seat ${status}`}
                        disabled={status === 'empty'}
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
                        key={`${row.row}-left-${idx}`}
                        onClick={() => toggleSeat(row.row, seat)}
                        className={`seat odc-seat ${status}`}
                        disabled={status === 'empty'}
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
                        key={`${row.row}-right-${idx}`}
                        onClick={() => toggleSeat(row.row, seat)}
                        className={`seat odc-seat ${status}`}
                        disabled={status === 'empty'}
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
                        disabled={packages.reduce((sum, p) => p.name.startsWith('ODC') ? sum + p.count : sum, 0) >= selectedSeats.filter(seat => !seat.startsWith('RowA_') && !seat.startsWith('RowB_')).length}
                      >+</button>
                    </div>
                  )}
                </div>
              ))}
              <button className="proceed-btn" onClick={handleProceedClick}>
                Proceed
              </button>
            </div>
          </>
        )}
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
