const express = require('express');
const { createBooking, getUserBookings, deleteBooking } = require('../controllers/bookingController');

const router = express.Router();

router.post('/create', createBooking);
router.get('/user/:user_id', getUserBookings);
router.delete('/:id', deleteBooking);

module.exports = router;