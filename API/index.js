const express = require('express');
// const connection = require("./db")
const cookieParser = require('cookie-parser')
const {errorHandler} = require('./Middleware/errorHandler')
const bodyParser = require('body-parser');
// const dotenv = require('dotenv');
// dotenv.config();


const app = express()
// const PORT = 5000;

app.use(cookieParser())

app.use((req, res, next) => {
  
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  console.log(`In router: ${req.method}:${req.originalUrl}`);
  next();
});

app.use(express.json())
app.use(express.urlencoded({extended: false}));


app.use(errorHandler);

app.use(bodyParser.json());

const AuthRoutes = require('./routes/auth');
app.use('/api/auth', AuthRoutes);

const StockRoutes = require('./routes/stock');
app.use('/api/stock', StockRoutes);

const UserRoutes = require('./routes/users');
app.use('/api/users', UserRoutes);

// app.get("/", (req, res) => {
//   res.json("hello this is the backend")
// })

app.listen(process.env.PORT || 5000, ()=> {
    console.log(`Server running on port ${process.env.PORT}`);
})