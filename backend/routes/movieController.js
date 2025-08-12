const db = require("../config/db");

const getAllMovies = async (req, res) => {
  try {
    const [data] = await db.query('SELECT * FROM movies');
    res.status(200).send({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
};

const getMovieById = async (req, res) => {
  try {
    const id = req.params.id;
    const [movie] = await db.query('SELECT * FROM movies WHERE movie_id = ?', [id]);
    if (!movie.length) return res.status(404).send({ success: false, message: 'Movie not found' });
    const [casts] = await db.query('SELECT * FROM casts WHERE movie_id = ?', [id]);
    res.status(200).send({
      success: true,
      movie: movie[0],
      casts,
    });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
};

module.exports = { getAllMovies, getMovieById };