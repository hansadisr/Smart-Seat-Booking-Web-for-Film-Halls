const express = require('express');
const { getUsers, getUserByID, createUser, loginUser, updateUser } = require('../controllers/userController');

//router object
const router = express.Router();

//routes

//get all user list || GET Method
router.get('/getAll',getUsers);

//get user  by ID
router.get('/get/:id',getUserByID);

//create a user || post
router.post('/create', createUser);

router.post('/login', loginUser);

// UPDATE a user || PUT
router.put('/update/:id', updateUser);

module.exports = router
