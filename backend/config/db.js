const mysql = require('mysql2/promise'); // importing mysql2 library

const mySqlPool = mysql.createPool({
  host: 'sql12.freesqldatabase.com',
  user: 'sql12796688',
  password: '76wYlgvmWn',
  database: 'sql12796688',
  //port: 3307
});

module.exports = mySqlPool;