require('dotenv').config()
const sql = require('mysql2');
// console.log(process.env.DB_HOST);
// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASSWORD);
// console.log(process.env.DB_DATABASE);

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

// const poolPromise = new db.ConnectionPool(config)  
// .connect()  
// .then(pool => {  
// console.log('Connected to MSSQL')  
// return pool  
// })  
// .catch(err => console.log('Database Connection Failed! Bad Config: ', err))  

module.exports = db;