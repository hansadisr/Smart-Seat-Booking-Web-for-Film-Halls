const express = require('express');
const { getShowsForMovie, getBookedSeatsForShow } = require('../controllers/showController');

const router = express.Router();

router.get('/for_movie', getShowsForMovie);
router.get('/:show_id/booked_seats', getBookedSeatsForShow);

module.exports = router;