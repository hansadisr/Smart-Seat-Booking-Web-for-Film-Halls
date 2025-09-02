import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PurchaseSummary from '../components/PurchaseSummary';
import '../styles/Booking.css';

const boxSeatsLayout = [
    { row: 'A', leftSeats: ['1', '2', '3'], rightSeats: ['4', '5'] },
    { row: 'B', leftSeats: ['1', '2', '3'], rightSeats: ['4', '5'] },
];

const odcSeatsLayout = [
    { row: 'C', leftSeats: ['1', '2', '3', '4', '5', '6'], rightSeats: ['7', '8', '9', '10', '11'] },
    { row: 'D', leftSeats: ['1', '2', '3', '4', '5', '6'], rightSeats: ['7', '8', '9', '10', '11'] },
    { row: 'E', leftSeats: ['1', '2', '3', '4', '5', '6'], rightSeats: ['7', '8', '9', '10', '11'] },
    { row: 'F', leftSeats: ['1', '2', '3', '4', '5', '6'], rightSeats: ['7', '8', '9', '10', '11'] },
    { row: 'G', leftSeats: ['1', '2', '3', '4', '5', '6'], rightSeats: ['7', '8', '9', '10', '11'] },
    { row: 'H', leftSeats: ['1', '2', '3', '4', '5', '6'], rightSeats: ['7', '8', '9', '10', '11'] },
    { row: 'I', leftSeats: ['', '1', '2', '3', '4', '5'], rightSeats: ['6', '7', '8', '9'] },
    { row: 'J', leftSeats: ['', '', '1', '2', '3', '5'], rightSeats: ['4', '8', '9'] },
];

const Booking = () => {
    const { movieId } = useParams(); // comes from url
    const [movie, setMovie] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date()); // default today
    const [availableTimes, setAvailableTimes] = useState([]); //showtimes for the chosen date & movie
    const [selectedTime, setSelectedTime] = useState(null); //which show time the user clicked
    const [selectedShowId, setSelectedShowId] = useState(null); 
    const [bookedSeats, setBookedSeats] = useState([]); // seats alraedy taken
    const [selectedSeats, setSelectedSeats] = useState([]); // user select seats
    const [packages, setPackages] = useState([
        { name: 'ODC Full', price: 'LKR 1500.00', count: 0 },
        { name: 'ODC Half', price: 'LKR 750.00', count: 0 },
        { name: 'Box', price: 'LKR 3200.00', count: 0 },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [showPurchaseSummary, setShowPurchaseSummary] = useState(false); // call the purchase

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080'; // if set from env var, else fall back to localhost
    
    //get movie details and store them in movie.When the component loads it calls backend
    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/v1/movies/${movieId}`);
                if (response.data.success) {
                    setMovie(response.data.movie);
                }
            } catch (error) {
                console.error('Error fetching movie:', error);
            }
        };
        fetchMovie();
    }, [movieId, API_BASE_URL]);
    
    // fetches the showtimes for a selected movie date and movie and update availabletimes
    useEffect(() => {
        const fetchShows = async () => {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            try {
                const response = await axios.get(`${API_BASE_URL}/api/v1/shows/for_movie`, {
                    params: { movie_id: movieId, date: formattedDate }
                });
                const shows = response.data.success ? response.data.shows : [];
                setAvailableTimes(shows);
                if (shows.length > 0) {
                    setSelectedTime(shows[0].show_time.slice(0, 5));
                    setSelectedShowId(shows[0].show_id);
                }
            } catch (error) {
                console.error('Error fetching shows:', error);
                setAvailableTimes([]);
            }
        };
        if (movieId) {
            fetchShows();
        }
        setSelectedSeats([]);
        setBookedSeats([]);
    }, [selectedDate, movieId, API_BASE_URL]);
    // check seats are already book or not
    const fetchBookedSeats = useCallback(async () => {
        if (!selectedShowId) return;
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/v1/shows/${selectedShowId}/booked_seats`);
            setBookedSeats(response.data.success ? response.data.bookedSeats : []);
        } catch (error) {
            console.error('Error fetching booked seats:', error);
            setBookedSeats([]);
        } finally {
            setIsLoading(false);
        }
    }, [selectedShowId, API_BASE_URL]);

    useEffect(() => {
        fetchBookedSeats();
        setSelectedSeats([]);
    }, [selectedShowId, fetchBookedSeats]);

    useEffect(() => {
        const boxSeatCount = selectedSeats.filter(s => s.startsWith('RowA_') || s.startsWith('RowB_')).length;
        const odcSeatCount = selectedSeats.length - boxSeatCount;

        setPackages(prev => {
            const newPackages = [...prev];
            const boxPkg = newPackages.find(p => p.name === 'Box');
            if (boxPkg) boxPkg.count = boxSeatCount;
            const totalOdcTickets = newPackages.reduce((sum, p) => p.name.startsWith('ODC') ? sum + p.count : sum, 0);
            if (totalOdcTickets > odcSeatCount) {
                newPackages.find(p => p.name === 'ODC Full').count = 0;
                newPackages.find(p => p.name === 'ODC Half').count = 0;
            }
            return newPackages;
        });
    }, [selectedSeats]);

    const handleTimeSelect = (time, showId) => {
        setSelectedTime(time);
        setSelectedShowId(showId);
    };
    // seat selection
    const toggleSeat = (seatId) => {
        if (bookedSeats.includes(seatId)) return;
        setSelectedSeats(prev =>
            prev.includes(seatId)
                ? prev.filter(id => id !== seatId)
                : [...prev, seatId]
        );
    };
    
    //when the saets are selected, the package counts are adjusted 
    const handlePackageChange = (name, increment) => {
        const odcSeatCount = selectedSeats.filter(s => !s.startsWith('RowA_') && !s.startsWith('RowB_')).length;
        setPackages(prev => {
            const totalOdcTickets = prev.reduce((sum, p) => p.name.startsWith('ODC') ? sum + p.count : sum, 0);
            if (increment > 0 && totalOdcTickets >= odcSeatCount) {
                return prev;
            }
            return prev.map(p => 
                p.name === name ? { ...p, count: Math.max(0, p.count + increment) } : p
            );
        });
    };
    // button increases ODC ticket count but never beyond ODC seats
    const handleProceedClick = () => {
        const totalTickets = packages.reduce((sum, pkg) => sum + pkg.count, 0);
        if (!selectedTime) return alert('Please select a show time.');
        if (selectedSeats.length === 0) return alert('Please select at least one seat.');
        if (totalTickets !== selectedSeats.length) return alert('The number of tickets must match the number of selected seats.');
        setShowPurchaseSummary(true);
    };
    
    const renderSeats = (layout, type) => (
        layout.map(({ row, leftSeats, rightSeats }) => (
            <div key={row} className="seat-row">
                <span className="row-label">{row}</span>
                <div className="seats-group">
                    {leftSeats.map((seat, idx) => {
                        const seatId = seat ? `Row${row}_Seat${seat}` : null;
                        const status = !seatId ? 'empty' : bookedSeats.includes(seatId) ? 'booked' : selectedSeats.includes(seatId) ? 'selected' : 'available';
                        return <button key={`L${idx}`} onClick={() => seatId && toggleSeat(seatId)} className={`seat ${type}-seat ${status}`} disabled={status !== 'available' && status !== 'selected'}>{seat}</button>;
                    })}
                </div>
                <div className="seats-gap"></div>
                <div className="seats-group">
                    {rightSeats.map((seat, idx) => {
                        const seatId = seat ? `Row${row}_Seat${seat}` : null;
                        const status = !seatId ? 'empty' : bookedSeats.includes(seatId) ? 'booked' : selectedSeats.includes(seatId) ? 'selected' : 'available';
                        return <button key={`R${idx}`} onClick={() => seatId && toggleSeat(seatId)} className={`seat ${type}-seat ${status}`} disabled={status !== 'available' && status !== 'selected'}>{seat}</button>;
                    })}
                </div>
            </div>
        ))
    );

    if (!movie) return <div>Loading movie details...</div>;
    // display of the movie's release date
    const formattedDate = new Date(movie.release_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
    });

    const bookingData = {
        selectedSeats,
        time: selectedTime,
        date: selectedDate.toISOString().split('T')[0],
        packages: packages.filter(pkg => pkg.count > 0),
        showId: selectedShowId,
        movieTitle: movie.title,
    };

    const boxSeatCount = packages.find(p => p.name === 'Box')?.count || 0;
    const odcSeatCount = selectedSeats.length - boxSeatCount;

    return (
        <div className="booking-page">
            <Navbar />
            <div className="booking-container">
                <div className="film-cover-section">
                    <img className="film-cover-bg" src={`${API_BASE_URL}${movie.cover_image}`} alt="Cover" />
                    <div className="film-cover-overlay1">
                        <img className="film-poster1" src={`${API_BASE_URL}${movie.image_url}`} alt="Poster" />
                        <div className="movie-info">
                            <h1 className="movie-title1">{movie.title}</h1>
                                <span className="movie-subtitle">{movie.language}</span>
                                <div className="movie-tags">
                                {movie.genre && movie.genre.split(',').map((g, idx) => (
                                    <span key={idx} className="tag">{g.trim()}</span>
                                ))}
                                </div>
                                <div className="movie-date">{formattedDate}</div>
                        </div>
                    </div>
                </div>

                <div className="date-section">
                    <input type="date" value={selectedDate.toISOString().split('T')[0]} onChange={(e) => setSelectedDate(new Date(e.target.value))} min={new Date().toISOString().split('T')[0]} className="date-text" />
                </div>
                <div className="showtimes">
                    {availableTimes.map(({ show_id, show_time }) => (
                        <button key={show_id} onClick={() => handleTimeSelect(show_time.slice(0, 5), show_id)} className={`showtime-btn ${selectedShowId === show_id ? 'selected' : ''}`}>
                            <div className="time">{show_time.slice(0, 5)}</div>
                            <div className="session">{parseInt(show_time.slice(0, 2)) >= 12 ? 'p.m.' : 'a.m.'}</div>
                        </button>
                    ))}
                </div>

                {selectedShowId && (
                    isLoading ? <div>Loading Seats...</div> :
                    <>
                        <h3 className="section-title">Box Seats</h3>
                        {renderSeats(boxSeatsLayout, 'box')}

                        <h3 className="section-title">ODC Seats</h3>
                        {renderSeats(odcSeatsLayout, 'odc')}

                        <div className="screen"><div className="screen-text">Screen</div></div>

                        <div className="summary-section">
                            <p className="selection-text">{odcSeatCount} ODC ticket(s) and {boxSeatCount} Box ticket(s) selected</p>
                            
                            {packages.map((pkg) => (
                                <div key={pkg.name} className="package-row">
                                    <div className="package-info">
                                        <div className="package-name">{pkg.name}</div>
                                        <div className="package-price">{pkg.price}</div>
                                    </div>
                                    <div className="quantity-controls">
                                        {pkg.name === 'Box' ? (
                                            <span className="quantity">{pkg.count}</span>
                                        ) : (
                                            <>
                                                <button className="quantity-btn minus" onClick={() => handlePackageChange(pkg.name, -1)} disabled={pkg.count === 0}>-</button>
                                                <span className="quantity">{pkg.count}</span>
                                                <button className="quantity-btn plus" onClick={() => handlePackageChange(pkg.name, 1)} disabled={packages.reduce((sum, p) => p.name.startsWith('ODC') ? sum + p.count : sum, 0) >= odcSeatCount}>+</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <button className="proceed-btn" onClick={handleProceedClick}>Proceed</button>
                        </div>
                    </>
                )}
            </div>
            
            <PurchaseSummary 
                isOpen={showPurchaseSummary}
                onClose={() => setShowPurchaseSummary(false)}
                bookingData={bookingData}
                onBookingSuccess={() => {
                    setShowPurchaseSummary(false);
                    fetchBookedSeats();
                }}
            />
            
            <Footer />
        </div>
    );
};

export default Booking;
