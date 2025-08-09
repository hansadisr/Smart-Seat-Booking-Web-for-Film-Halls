import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PurchaseSummary from '../components/PurchaseSummary';
import { images } from '../constants/theme';
import '../styles/Booking.css';

const Booking = () => {
  const [selectedSeats, setSelectedSeats] = useState(['F-4', 'F-5']);
  const [selectedTime, setSelectedTime] = useState('01:30');
  const [showPurchaseSummary, setShowPurchaseSummary] = useState(false);
  const [packages, setPackages] = useState([
    { name: 'ODC Full', price: 'LKR 1,500.00', count: 2 },
    { name: 'ODC Half', price: 'LKR 850.00', count: 0 },
    { name: 'Box', price: 'LKR 3,200.00', count: 0 },
  ]);

  const times = [
    { time: '10:00', label: '10.00', available: true },
    { time: '01:30', label: '01.30', available: true },
    { time: '04:00', label: '04.00', available: true },
    { time: '07:15', label: '07.15', available: true },
    { time: '10:20', label: '10.20', available: true },
  ];

  const boxSeats = [
    { 
      row: 'A', 
      leftSeats: ['1', '2', '3'],
      rightSeats: ['4', '5']
    },
    { 
      row: 'B', 
      leftSeats: ['1', '2', '3'],
      rightSeats: ['4', '5']
    },
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

  const bookedSeatsByTime = {
    '10:00': ['E-7', 'G-3'],
    '01:30': ['F-4', 'F-5'],
    '04:00': ['C-2', 'D-8'],
    '07:15': ['H-1', 'I-6'],
    '10:20': ['J-3', 'G-9'],
  };

  useEffect(() => {
    // Reset selected seats and packages when time changes
    setSelectedSeats([]);
    setPackages(packages.map(pkg => ({ ...pkg, count: 0 })));
  }, [selectedTime]);

  const toggleSeat = (row, seat, isBox = false) => {
    const seatId = `${row}-${seat}`;
    if (!seat || bookedSeatsByTime[selectedTime].includes(seatId)) return;

    setSelectedSeats(prevSelected => {
      const isSelected = prevSelected.includes(seatId);
      const newSelectedSeats = isSelected
        ? prevSelected.filter(id => id !== seatId)
        : [...prevSelected, seatId];

      // Update box seat package count if box seat
      if (isBox) {
        const boxCount = newSelectedSeats.filter(seat => seat.startsWith('A-') || seat.startsWith('B-')).length;
        setPackages(prevPackages => prevPackages.map(pkg => 
          pkg.name === 'Box' ? { ...pkg, count: boxCount } : pkg
        ));
      }

      return newSelectedSeats;
    });
  };

  const handleTimeSelect = (time) => {
    if (times.find(t => t.time === time)?.available) {
      setSelectedTime(time);
    }
  };

  const handlePackageChange = (name, action) => {
    if (name === 'Box') return; // Prevent modifying box seat count
    const totalSelectedSeats = selectedSeats.filter(seat => !seat.startsWith('A-') && !seat.startsWith('B-')).length;
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
    const seatId = `${row}-${seat}`;
    if (selectedSeats.includes(seatId)) return 'selected';
    if (bookedSeatsByTime[selectedTime].includes(seatId)) return 'booked';
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
    date: '2025-07-04',
    packages: packages.filter(pkg => pkg.count > 0)
  };

  return (
    <div className="booking-page">
      <Navbar />
      <div className="booking-container">
        <div className="film-cover-section">
          <img
            className="film-cover-bg"
            src={images.cover1}
            alt="Cover Background"
          />
          <div className="film-cover-overlay1">
            <img className="film-poster1" src={images.Film2} alt="Movie Poster" />
            <div className="movie-info">
              <h1 className="movie-title1">Title</h1>
              <div className="movie-subtitle">Language</div>
              <div className="movie-tags">
                <span className="tag">Action</span>
                <span className="tag">Drama</span>
              </div>
              <p className="movie-date">Date</p>
            </div>
          </div>
        </div>

        <div className="date-section">
          <img className="date-icon" src={images.calender} />
          <span className="date-text">29th June, 225</span>
        </div>

        <div className="showtimes">
          {times.map((timeSlot) => (
            <button
              key={timeSlot.time}
              onClick={() => handleTimeSelect(timeSlot.time)}
              className={`showtime-btn ${
                selectedTime === timeSlot.time ? 'selected' : ''
              }`}
            >
              <div className="time">{timeSlot.label}</div>
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
            {selectedSeats.filter(seat => !seat.startsWith('A-') && !seat.startsWith('B-')).length} ODC ticket(s) and {selectedSeats.filter(seat => seat.startsWith('A-') || seat.startsWith('B-')).length} Box ticket(s) selected
            {selectedSeats.filter(seat => !seat.startsWith('A-') && !seat.startsWith('B-')).length > 0 && ', please select ODC attendees'}
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
                    disabled={packages.reduce((sum, p) => p.name !== 'Box' ? sum + p.count : sum, 0) >= selectedSeats.filter(seat => !seat.startsWith('A-') && !seat.startsWith('B-')).length}
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
