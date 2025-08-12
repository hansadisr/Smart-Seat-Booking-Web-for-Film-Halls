const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mySqlPool = require('./config/db');
const cors = require('cors');

//configure dotenv
dotenv.config();

//rest object
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// routes
app.use('/api/v1/users', require("./routes/userRoutes"));
app.use('/api/v1/movies', require("./routes/movieRoutes"));
app.use('/api/v1/shows', require("./routes/showRoutes"));
app.use('/api/v1/bookings', require("./routes/bookingRoutes"));

app.get('/test', (req, res) => {
  res.status(200).send("chi-NodeJs Mysql APP</h1>");
});

// port
const PORT = process.env.PORT || 8080;

// conditionally Listen
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
