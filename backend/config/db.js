const mysql = require('mysql2/promise'); // importing mysql2 library

const mySqlPool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '0000',
  database: 'reelvista_db',
  port: 3307
   //host: 'sql12.freesqldatabase.com',
   //user: 'sql12796688',
   //password: '76wYlgvmWn',
   //database: 'sql12796688',
});

module.exports = mySqlPool;