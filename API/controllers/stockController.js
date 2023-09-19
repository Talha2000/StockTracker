const db = require("../db")
const UserStock = require("../models/userStocks");
// const finnhub = require('finnhub');
// const request = require('request');
// const basePath = "https://finnhub.io/api/v1";
// const util = require('util');

const saveStock = async (req, res) => {
    // store the stock in the userStocks collection
    // id and stockSymbol will be stored in collection.
    const id = req.user.id;
    const stockSymbol = req.body.symbol
  
    try {
      // Add a check to see if person with id and stock already exist
      if (!stockSymbol) {
        return res.status(409).json("Stock is undefined or null");
      }
  
      const newStock = new UserStock({
        id: id,
        stockSymbol: stockSymbol
      });  
      await newStock.save();
      return res.status(200).json({ message : "Stock: " + stockSymbol + "for user: " + id + " saved successfully" });

    } catch (err) {
      console.error(err);
      return res.status(500).json("An error occurred.", err);
    }
    return res.status(200).json({ message: "Stock saved successfully" });
};

const removeStock = async (req, res) => {
  // get the users id and stock symbol they want removed
  const id = req.user.id;
  const stockSymbol = req.body.symbol

  try {
    // Add a check to see if person with id and stock already exist
    if (!id) {
      return res.status(409).json({message: "User not found."});
    }
  
    const stock = await UserStock.findOneAndDelete({ id: id, stockSymbol: stockSymbol });
    return res.status(200).json({ message : "Stock: " + stockSymbol + "for user: " + id + " removed successfully" });

  } catch (err) {
    console.error(err);
    return res.status(500).json("An error occurred.", err);
  }
  return res.status(200).json({ message: "Stock removed successfully" });
};

const getStocks = async (req, res) => {
    const id = req.user.id;
    try {
      const stocks = await UserStock.find({ id: id });
      return res.status(200).json(stocks);
    } catch (error) {
      console.error('Error finding stocks:', error);
      throw error;
    }
    
  }

module.exports = {
    saveStock,
    removeStock,
    getStocks,
}
