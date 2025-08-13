const db = require("../config/db");

const createBooking = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { user_id, show_id, seats, packages, total_price, phone } = req.body;

    if (!user_id || !show_id || !Array.isArray(seats) || !Array.isArray(packages) || !total_price || !phone) {
      await connection.rollback();
      return res.status(400).send({
        success: false,
        message: 'All fields are required and seats/packages must be arrays.'
      });
    }

    if (seats.length > 0) {
      const [existingSeats] = await connection.query(
        'SELECT seat_id FROM booked_seats WHERE show_id = ? AND seat_id IN (?) FOR UPDATE',
        [show_id, seats]
      );

      if (existingSeats.length > 0) {
        await connection.rollback();
        return res.status(409).send({
          success: false,
          message: 'One or more selected seats have just been booked. Please select different seats.',
          bookedSeats: existingSeats.map(seat => seat.seat_id)
        });
      }
    }

    const [bookingResult] = await connection.query(
      'INSERT INTO bookings (user_id, show_id, seats, packages, total_price, phone, paid_amount) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user_id, show_id, JSON.stringify(seats), JSON.stringify(packages), total_price, phone, total_price]
    );

    const bookingId = bookingResult.insertId;

    if (seats.length > 0) {
      const seatInserts = seats.map(seatId => [show_id, seatId, bookingId]);
      await connection.query(
        'INSERT INTO booked_seats (show_id, seat_id, booking_id) VALUES ?',
        [seatInserts]
      );
    }

    await connection.commit();

    res.status(201).send({
      success: true,
      booking_id: bookingId,
      message: 'Booking created successfully'
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error in createBooking:', error);
    res.status(500).send({
      success: false,
      message: 'Error in Create Booking API',
      error: error.message
    });
  } finally {
    connection.release();
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
      `SELECT 
        b.booking_id, b.user_id, b.show_id, b.packages, b.total_price, b.phone, b.paid_amount, b.created_at,
        m.title, m.image_url, s.show_date, s.show_time,
        -- Use GROUP_CONCAT to gather all seat_id's from the booked_seats table into a single string
        GROUP_CONCAT(bs.seat_id) AS seat_list
       FROM bookings b
       LEFT JOIN shows s ON b.show_id = s.show_id
       LEFT JOIN movies m ON s.movie_id = m.movie_id
       -- Join the table that has the correct seat data
       LEFT JOIN booked_seats bs ON b.booking_id = bs.booking_id
       WHERE b.user_id = ?
       -- Group results by booking to ensure one row per booking
       GROUP BY b.booking_id
       ORDER BY b.created_at DESC`,
      [user_id]
    );

    if (!rows || rows.length === 0) {
      return res.status(200).send({
        success: true,
        message: 'No bookings found for this user',
        bookings: []
      });
    }

    const bookings = rows.map(b => {
      let parsedPackages = [];
      try { parsedPackages = JSON.parse(b.packages) || []; } catch (e) { /* ignore */ }
      
      return {
        ...b,
        seats: b.seat_list ? b.seat_list.split(',') : [],
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

module.exports = {
  createBooking: module.exports.createBooking, 
  getUserBookings,
  deleteBooking: module.exports.deleteBooking,
};

const deleteBooking = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const booking_id = req.params.id;
    await connection.beginTransaction();
    await connection.query('DELETE FROM booked_seats WHERE booking_id = ?', [booking_id]);
    
    const [result] = await connection.query('DELETE FROM bookings WHERE booking_id = ?', [booking_id]);
    
    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).send({
        success: false,
        message: 'Booking not found'
      });
    }
    
    await connection.commit();
    res.status(200).send({ 
      success: true,
      message: 'Booking deleted successfully'
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('Error in deleteBooking:', error);
    res.status(500).send({ 
      success: false, 
      message: 'Error deleting booking.',
      error: error.message 
    });
  } finally {
    connection.release();
  }
};

module.exports = { createBooking, getUserBookings, deleteBooking,};
