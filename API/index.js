const express = require('express');
const connectDB = require('./db'); // Import the MongoDB client and database instance
const cookieParser = require('cookie-parser')
const {errorHandler} = require('./Middleware/errorHandler')
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config(); // Load .env file into process.env
// Connect to MongoDB
connectDB();

const app = express()
app.use(cors());

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

app.get("/", (req, res) => {
  res.json("hello this is the backend")
})
app.listen(process.env.PORT || 5001, ()=> {
    console.log(`Server running on port ${process.env.PORT}`);
})