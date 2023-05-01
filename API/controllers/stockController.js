const db = require("../db")
const finnhub = require('finnhub');
const request = require('request');
const basePath = "https://finnhub.io/api/v1";
const util = require('util');
const query = util.promisify(db.query).bind(db);


const saveStock = async (req, res)=>{
    // check if user exists in the users table
    // console.log("this is the symbol" + req.body.symbol)
    try {
      const { id } = req.user.id;
      const q = "SELECT * FROM users WHERE id = ?";
      const results = await query(q, [id]);

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const insertQuery = "INSERT INTO userStocks(id, stockName) VALUES(?, ?)";
      const stockParams = [
        id,
        req.body.symbol,
      ];
      console.log(stockParams);
      console.log("got here")
  
      await query(insertQuery, stockParams);
  
      return res.status(200).json({ message: "Stock saved successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server error" });
    }
}

const removeStock = async (req, res)=>{
  // check if user exists in the users table
  // console.log("this is the symbol" + req.body.symbol)
  try {
    const { id } = req.user.id;
    const q = "SELECT * FROM users WHERE id = ?";
    const results = await query(q, [id]);

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const deleteQuery = "DELETE FROM userStocks WHERE id = ? AND stockName = ?";
    const stockParams = [
      id,
      req.body.symbol,
    ];

    await query(deleteQuery, stockParams);

    return res.status(200).json({ message: "Stock removed successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
}


const getStocks = async(req, res) => {
    // get the current user logged in
    const { id, username } = req.user.id;
    const q = "SELECT * FROM userStocks WHERE id = ?";
    db.query(q, [id], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
      }
      return res.status(200).json(results);
    });
}

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