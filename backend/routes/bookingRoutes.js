const express = require('express');
const router = express.Router();

const { 
  createBooking, 
  getUserBookings, 
  deleteBooking
} = require('../controllers/bookingController');

router.post('/create', createBooking);
router.get('/user/:user_id', getUserBookings);
router.delete('/:id', deleteBooking);

module.exports = router;
