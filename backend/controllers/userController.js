const db = require("../config/db");

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

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );

    if (result.affectedRows === 0) {
      return res.status(500).send({
        success: false,
        message: 'Failed to create user'
      });
    }

    res.status(201).send({
      success: true,
      message: 'User created successfully',
      userId: result.insertId
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

    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (!rows || rows.length === 0) {
      return res.status(401).send({
        success: false,
        message: 'Invalid email or password'
      });
    }

    res.status(200).send({
      success: true,
      message: 'Login successful',
      userId: rows[0].user_id
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

module.exports = { getUsers, getUserByID, createUser, loginUser };
