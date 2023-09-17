const mongoose = require('mongoose');

const userStockSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  stockSymbol: {
    type: String,
    required: true,
  }
});

// Create a compound index on 'id' and 'stockSymbol' with unique constraint
userStockSchema.index({ id: 1, stockSymbol: 1 }, { unique: true });

const UserStock = mongoose.model('UserStock', userStockSchema);

module.exports = UserStock;