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
    const [bookings] = await db.query('SELECT seats FROM bookings WHERE show_id = ?', [show_id]);
    let bookedSeats = [];

    bookings.forEach(b => {
      console.log(`Processing booking for show ${show_id}, raw seats: ${b.seats}`);
      try {
        // Try parsing as JSON first
        const parsedSeats = b.seats ? JSON.parse(b.seats) : [];
        bookedSeats = bookedSeats.concat(Array.isArray(parsedSeats) ? parsedSeats : []);
      } catch (parseError) {
        console.error(`Error parsing JSON for show ${show_id}:`, parseError);
        // Fallback for comma-separated strings
        if (typeof b.seats === 'string' && b.seats.includes(',')) {
          const fixedSeats = b.seats.split(',').map(s => s.trim());
          bookedSeats = bookedSeats.concat(fixedSeats);
        }
      }
    });

    res.status(200).send({ success: true, bookedSeats });
  } catch (error) {
    console.error('Error in getBookedSeatsForShow:', error);
    res.status(500).send({
      success: false,
      message: 'Error in Get Booked Seats API',
      error: error.message
    });
  }
};

module.exports = { getShowsForMovie, getBookedSeatsForShow };