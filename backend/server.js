// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// require('dotenv').config();

// const app = express();
// const port = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// const uri = process.env.ATLAS_URI;
// mongoose.set("strictQuery", true);

// mongoose.connect(uri);
// const connection = mongoose.connection;
// connection.once('open', () => {
// console.log("MongoDB database connection established successfully");
// })

// app.listen(port, () => {
// console.log(`Server is running on port: ${port}`);
// });

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {errorHandler} = require('./Middleware/errorHandler')

require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

mongoose.set("strictQuery", true);

// Connect to the database
mongoose
  .connect(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log(`Database connected successfully`))
  .catch((err) => console.log(err));

// Since mongoose's Promise is deprecated, we override it with Node's Promise
mongoose.Promise = global.Promise;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));


const HomeRoute = require('./Routes/HomeRoute');
app.use('/api', HomeRoute);

app.use(errorHandler);

// app.use((err, req, res, next) => {
//   console.log(err);
//   next();
// });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});