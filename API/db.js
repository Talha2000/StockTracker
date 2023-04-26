require('dotenv').config()
const sql = require('mysql2');

var db = sql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE,
  });


  db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
  
    console.log('Connected to the database successfully!');
  });

module.exports = db;