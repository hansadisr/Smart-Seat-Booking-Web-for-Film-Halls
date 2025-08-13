const db = require("../config/db");


const getShowsForMovie = async (req, res) => {
  try {
    const { movie_id, date } = req.query;
    if (!movie_id || !date) {
      return res.status(400).send({ success: false, message: 'Movie ID and date are required' });
    }
    const [shows] = await db.query(
      'SELECT show_id, show_time FROM shows WHERE movie_id = ? AND show_date = ? ORDER BY show_time', 
      [movie_id, date]
    );
    res.status(200).send({ success: true, shows });
  } catch (error) {
    console.error('Error in getShowsForMovie:', error);
    res.status(500).send({ success: false, error: error.message });
  }
};

const getBookedSeatsForShow = async (req, res) => {
  try {
    const { show_id } = req.params;
    if (!show_id) {
        return res.status(400).send({ success: false, message: 'Show ID is required' });
    }

    res.setHeader('Cache-Control', 'no-store');

    const [rows] = await db.query(
      'SELECT seat_id FROM booked_seats WHERE show_id = ?',
      [show_id]
    );

    const bookedSeats = rows.map(row => row.seat_id);

    console.log(`Fetched booked seats for show ${show_id}:`, bookedSeats);

    res.status(200).send({ 
        success: true, 
        bookedSeats: bookedSeats 
    });

  } catch (error) {
    console.error('Error in getBookedSeatsForShow:', error);
    res.status(500).send({
      success: false,
      message: 'Error fetching booked seats',
      error: error.message,
    });
  }
};

module.exports = { getShowsForMovie, getBookedSeatsForShow };
