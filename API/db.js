const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.ATLAS_URI, {
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