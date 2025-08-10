const mysql = require('mysql2/promise');

const mySqlPool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '0000',
  database: 'reelvista_db',
  port: 3307
});

module.exports = mySqlPool;