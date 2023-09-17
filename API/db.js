const mongoose = require('mongoose');

const ATLAS_URI = "mongodb+srv://amjadt1:dev@stocktracker.gnacsq5.mongodb.net/?retryWrites=true&w=majority";
const connectDB = async () => {
    try {
        await mongoose.connect(ATLAS_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            dbName: 'StockData', // Specify the database name here
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err);
    }
}

module.exports = connectDB