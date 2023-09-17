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
      console.log(stocks);
      return res.status(200).json(stocks);
    } catch (error) {
      console.error('Error finding stocks:', error);
      throw error;
    }
    
  }

    //     // get the current user logged in
//     const { id, username } = req.user.id;
//     const q = "SELECT * FROM userStocks WHERE id = ?";
//     db.query(q, [id], (err, results) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).json({ message: "Server error" });
//       }
//       return res.status(200).json(results);
//     });


// const saveStock = async (req, res)=>{
//     // check if user exists in the users table
//     // console.log("this is the symbol" + req.body.symbol)
//     try {
//       const { id } = req.user.id;
//       const q = "SELECT * FROM users WHERE id = ?";
//       const results = await query(q, [id]);

//       if (results.length === 0) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       const insertQuery = "INSERT INTO userStocks(id, stockName) VALUES(?, ?)";
//       const stockParams = [
//         id,
//         req.body.symbol,
//       ];
//       console.log(stockParams);
//       console.log("got here")
  
//       await query(insertQuery, stockParams);
  
//       return res.status(200).json({ message: "Stock saved successfully" });
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json({ message: "Server error" });
//     }
// }

// const removeStock = async (req, res)=>{
//   // check if user exists in the users table
//   // console.log("this is the symbol" + req.body.symbol)
//   try {
//     const { id } = req.user.id;
//     const q = "SELECT * FROM users WHERE id = ?";
//     const results = await query(q, [id]);

//     if (results.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const deleteQuery = "DELETE FROM userStocks WHERE id = ? AND stockName = ?";
//     const stockParams = [
//       id,
//       req.body.symbol,
//     ];

//     await query(deleteQuery, stockParams);

//     return res.status(200).json({ message: "Stock removed successfully" });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Server error" });
//   }
// }


// const getStocks = async(req, res) => {
//     // get the current user logged in
//     const { id, username } = req.user.id;
//     const q = "SELECT * FROM userStocks WHERE id = ?";
//     db.query(q, [id], (err, results) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).json({ message: "Server error" });
//       }
//       return res.status(200).json(results);
//     });
// }

module.exports = {
    saveStock,
    removeStock,
    getStocks,
}


      // db.query(q, [id], (err, results) => {
      //   if (err) {
      //     return res.status(500).json({ message: "Server error" });
      //   }
  
          // Insert new stock into the stocks table
      //     const insertQuery = "INSERT INTO userStocks(id, stockName) VALUES(?, ?)";
      //     const stockParams = [
      //         id,
      //         req.body.symbol,
      //     ];
      //     console.log(stockParams);
      //     console.log("got here")
  
      //     db.query(insertQuery, stockParams, (err, data)=>{
      //         if (err) {
      //           console.log("here3")
      //             return res.status(500).json({ message: "Server error" });
      //         }
  
      //         return res.status(200).json({ message: "Stock saved successfully" });
      //     });
      // });