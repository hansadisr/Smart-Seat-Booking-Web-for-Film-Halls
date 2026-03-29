const express = require('express');
const { getUsers, getUserByID, createUser, loginUser, updateUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

//router object
const router = express.Router();

//routes

//get all user list || GET Method
router.get('/getAll', authMiddleware, getUsers); // Protected route - requires token

//get user  by ID
router.get('/get/:id', authMiddleware, getUserByID); // Protected route - requires token

//create a user || post
router.post('/create', createUser); // for signup - no auth needed

router.post('/login', loginUser); // for login - no auth needed

// UPDATE a user || PUT
router.put('/update/:id', authMiddleware, updateUser); // Protected route - requires token

module.exports = router
