const db = require("../config/db");

const createBooking = async (req, res) => {
  try {
    const { user_id, show_id, seats, packages, total_price, phone } = req.body;
    if (!user_id || !show_id || !seats || !packages || !total_price || !phone) {
      return res.status(400).send({
        success: false,
        message: 'All fields (user_id, show_id, seats, packages, total_price, phone) are required'
      });
    }

    // Validate and sanitize seats
    const sanitizedSeats = Array.isArray(seats) ? seats : typeof seats === 'string' ? seats.split(',').map(s => s.trim()) : [];
    console.log('Sanitized seats:', sanitizedSeats);

    // Validate and sanitize packages
    const sanitizedPackages = Array.isArray(packages) ? packages : typeof packages === 'string' ? JSON.parse(packages) : [];
    console.log('Sanitized packages:', sanitizedPackages);

    const [result] = await db.query(
      'INSERT INTO bookings (user_id, show_id, seats, packages, total_price, phone) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, show_id, JSON.stringify(sanitizedSeats), JSON.stringify(sanitizedPackages), total_price, phone]
    );

    if (result.affectedRows === 0) {
      return res.status(500).send({
        success: false,
        message: 'Failed to create booking'
      });
    }

    res.status(201).send({
      success: true,
      booking_id: result.insertId
    });
  } catch (error) {
    console.log('Error in createBooking:', error);
    res.status(500).send({
      success: false,
      message: 'Error in Create Booking API',
      error: error.message
    });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    if (!user_id) {
      return res.status(400).send({
        success: false,
        message: 'User ID is required'
      });
    }

    const [rows] = await db.query(
      'SELECT b.booking_id, b.user_id, b.show_id, b.seats, b.packages, b.total_price, b.phone, b.paid_amount, m.title, m.image_url, s.show_date, s.show_time ' +
      'FROM bookings b ' +
      'LEFT JOIN shows s ON b.show_id = s.show_id ' +
      'LEFT JOIN movies m ON s.movie_id = m.movie_id ' +
      'WHERE b.user_id = ?',
      [user_id]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).send({
        success: false,
        message: 'No bookings found for this user'
      });
    }

    const bookings = rows.map(b => {
      console.log(`Processing booking ${b.booking_id}, raw seats: ${b.seats}, raw packages: ${b.packages}`);
      let parsedSeats = [];
      let parsedPackages = [];

      // Try to parse seats
      try {
        // This will work if the data is a valid JSON array string, e.g., '["C-2", "C-3"]'
        parsedSeats = JSON.parse(b.seats);
      } catch (e) {
        // This is the fallback if JSON.parse fails
        if (typeof b.seats === 'string') {
          // Handles plain comma-separated strings, e.g., 'C-2,C-3'
          parsedSeats = b.seats.split(',').map(s => s.trim());
        } else {
          // If it's something else (like null or already an array), default to empty
          parsedSeats = Array.isArray(b.seats) ? b.seats : [];
        }
      }
      
      // Try to parse packages
      try {
         // This will work for valid JSON array of objects
        parsedPackages = JSON.parse(b.packages);
      } catch (e) {
        // Fallback for bad data like '[object Object],[object Object]'
        // This data is corrupted and cannot be recovered, so we default to an empty array.
        // Your new bookings will be stored correctly and won't hit this fallback.
        parsedPackages = []; 
      }

      return {
        ...b,
        seats: Array.isArray(parsedSeats) ? parsedSeats : [],
        packages: Array.isArray(parsedPackages) ? parsedPackages : []
      };
    });

    res.status(200).send({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('Error in getUserBookings:', error);
    res.status(500).send({
      success: false,
      message: 'Error in Get User Bookings API',
      error: error.message,
    });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking_id = req.params.id;
    await db.query('DELETE FROM bookings WHERE booking_id = ?', [booking_id]);
    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
};

module.exports = { createBooking, getUserBookings, deleteBooking };
