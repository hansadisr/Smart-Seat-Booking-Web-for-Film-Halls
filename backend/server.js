const express = require('express');
const path = require('path');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const mySqlPool = require('./config/db');

// Configure dotenv
dotenv.config();

// Initialize the Express app
const app = express();

// Middlewares
app.use(cors()); // To allow cross-origin requests
app.use(express.json()); // To parse JSON data
app.use(morgan('dev')); // To log requests for development

// Serve static files (images)
app.use('/assets/images', express.static(path.join(__dirname, 'assets', 'images')));

// Routes (define the endpoints)
app.use('/api/v1/users', require("./routes/userRoutes"));
app.use('/api/v1/movies', require("./routes/movieRoutes"));
app.use('/api/v1/shows', require("./routes/showRoutes"));
app.use('/api/v1/bookings', require("./routes/bookingRoutes"));

// Test route
app.get('/test', (req, res) => {
  res.status(200).send("Node.js MySQL App");
});

// Port
const PORT = process.env.PORT || 8080;

// MySQL Connection & Start the server
mySqlPool
  .query("SELECT 1")
  .then(() => {
    console.log("MySQL DB Connected".bgCyan.white);
    app.listen(PORT, () => {
      console.log(`Server Running on port ${process.env.PORT}`.bgMagenta.white);
    });
  })
  .catch((error) => {
    console.log(error);
  });
