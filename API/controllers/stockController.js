const db = require("../db")
const finnhub = require('finnhub');
const request = require('request');
const asyncHandler = require('express-async-handler')
const basePath = "https://finnhub.io/api/v1";


const saveStock = (req, res)=>{
    // check if user exists in the users table
    const { id, username } = req.user.id;
    // can also grab it from req.body.userId if we send the userId down
    const q = "SELECT * FROM users WHERE id = ?";
    db.query(q, [id], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
        // Insert new stock into the stocks table
        const insertQuery = "INSERT INTO userStocks(id, stockName)" + 
                            "VALUES(?)"
        const stockParams = [
            user_id,
            req.body.symbol,
        ];
        console.log(stockParams);
        console.log("got here")

        db.query(insertQuery, [stockParams], (err, data)=>{
            if (err) {
                return res.status(500).json({ message: "Server error" });
            }

            return res.status(200).json({ message: "Stock saved successfully" });
        });
    });

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
    getStocks,
}