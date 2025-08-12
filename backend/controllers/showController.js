const db = require("../config/db");

const getShowsForMovie = async (req, res) => {
  try {
    const { movie_id, date } = req.query;
    const [shows] = await db.query('SELECT show_id, show_time FROM shows WHERE movie_id = ? AND show_date = ?', [movie_id, date]);
    res.status(200).send({ success: true, shows });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
};

const getBookedSeatsForShow = async (req, res) => {
  try {
    const show_id = req.params.show_id;
    // 1. Query the database for the specific show
    const [bookings] = await db.query('SELECT seats FROM bookings WHERE show_id = ?', [show_id]);
    let bookedSeats = [];

    // 2. Aggregate all seats from all bookings for that show
    bookings.forEach(b => {
        try {
            const parsedSeats = b.seats ? JSON.parse(b.seats) : [];
            bookedSeats = bookedSeats.concat(Array.isArray(parsedSeats) ? parsedSeats : []);
        } catch (e) {
            if (typeof b.seats === 'string') {
                bookedSeats = bookedSeats.concat(b.seats.split(',').map(s => s.trim()));
            }
        }
    });

    // 3. Send the complete list back to the frontend
    res.status(200).send({ success: true, bookedSeats });
  } catch (error) {
    // ... error handling
  }
};

module.exports = { getShowsForMovie, getBookedSeatsForShow };
