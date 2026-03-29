const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const getUsers = async (req, res) => {
  try {
    const [data] = await db.query('SELECT * FROM users');
    if (!data || data.length === 0) {
      return res.status(404).send({
        success: false,
        message: 'No Records Found'
      });
    }
    res.status(200).send({
      success: true,
      message: "All Users Records",
      totalUsers: data.length,
      data: data,
    });
  } catch (error) {
    console.log('Error in getUsers:', error);
    res.status(500).send({
      success: false,
      message: "Error in Get All User API",
      error: error.message
    });
  }
};

const getUserByID = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(404).send({
        success: false,
        message: 'Invalid Or Provide user id'
      });
    }

    const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [userId]);
    if (!rows || rows.length === 0) {
      return res.status(404).send({
        success: false,
        message: 'No Records Found'
      });
    }
    res.status(200).send({
      success: true,
      message: "User found",
      userDetails: rows[0],
    });
  } catch (error) {
    console.log('Error in getUserByID:', error);
    res.status(500).send({
      success: false,
      message: 'Error in Get user by id API',
      error: error.message
    });
  }
};

// crete  login function
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Check if user already exists
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser && existingUser.length > 0) {
      return res.status(400).send({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password with salt rounds = 10
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert hashed password into database
    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    if (result.affectedRows === 0) {
      return res.status(500).send({
        success: false,
        message: 'Failed to create user'
      });
    }

    const token = jwt.sign(
      { userId: result.insertId, email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).send({
      success: true,
      message: 'User created successfully',
      token,
      userId: result.insertId,
      userName: name,
      userEmail: email
    });
  } catch (error) {
    console.log('Error in createUser:', error);
    res.status(500).send({
      success: false,
      message: 'Error in Create User API',
      error: error.message
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!rows || rows.length === 0) {
      return res.status(401).send({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, rows[0].password);
    if (!isPasswordValid) {
      return res.status(401).send({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: rows[0].user_id, email: rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(200).send({
      success: true,
      message: 'Login successful',
      token: token,
      userId: rows[0].user_id,
      userName: rows[0].name,
      userEmail: rows[0].email
    });
  } catch (error) {
    console.log('Error in loginUser:', error);
    res.status(500).send({
      success: false,
      message: 'Error in Login API',
      error: error.message
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, telephone } = req.body;

    if (!name || !email) {
      return res.status(400).send({
        success: false,
        message: 'Name and email are required',
      });
    }

    const [result] = await db.query(
      'UPDATE users SET name = ?, email = ?, telephone = ? WHERE user_id = ?',
      [name, email, telephone, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).send({
        success: false,
        message: 'User not found or no changes made',
      });
    }

    res.status(200).send({
      success: true,
      message: 'User profile updated successfully',
    });
  } catch (error) {
    console.log('Error in updateUser:', error);
    res.status(500).send({
      success: false,
      message: 'Error in Update User API',
      error: error.message,
    });
  }
};

module.exports = { getUsers, getUserByID, createUser, loginUser, updateUser };
