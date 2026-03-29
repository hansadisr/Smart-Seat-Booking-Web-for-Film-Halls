const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Get token from headers
    const token = req.headers.authorization?.split(' ')[1]; // Format: "Bearer <token>"
    
    if (!token) {
      return res.status(401).send({
        success: false,
        message: 'No token provided'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Attach userId to request
    req.userEmail = decoded.email; // Attach email to request
    next();
  } catch (error) {
    console.log('Error in authMiddleware:', error.message);
    return res.status(401).send({
      success: false,
      message: 'Invalid or expired token',
      error: error.message
    });
  }
};

module.exports = authMiddleware;
