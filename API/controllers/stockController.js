const db = require("../db")
const finnhub = require('finnhub');
const request = require('request');
const asyncHandler = require('express-async-handler')
const basePath = "https://finnhub.io/api/v1";


const saveStock = (req, res)=>{
    // check if user exists in the users table
    const user_id = req.user.id; // can also grab it from req.body.userId if we send the userId down
    // console.log(req.body.userId)
    const q = "SELECT * FROM users WHERE id = ?";
    db.query(q, [user_id], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
        // Insert new stock into the stocks table\
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
    // const user_id = req.user.id;
    const userId = req.user.id;
    console.log("this is the userId " + userId)
    // console.log("This is the acess_token " + req.headers['authorization'])

    const q = "SELECT * FROM userStocks WHERE id = ?";
    db.query(q, [userId], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
      }
  
      // if (results.length === 0) {
      //   return res.status(200).json(results);
      // }

      return res.status(200).json(results);
    });


}

module.exports = {
    saveStock,
    getStocks,
}
// const api_key = finnhub.ApiClient.instance.authentications['api_key'];
// const api_key = "cgk8knpr01qq3c3u2ma0cgk8knpr01qq3c3u2mag"
// const finnhubClient = new finnhub.DefaultApi()

// Stock Lookup
// GET API
// PARAMS: Symbol

// const searchResults = async (req, res) => {
//     // // const url = `${basePath}/search?q=${query}&token=${process.env.REACT_APP_API_KEY}`;
//     // console.log(query.data);
//     // finnhubClient.symbolSearch('AAPL', (error, data, response) => {
//     //     return res.json(data);
//     // });

//     // const data = await response.json()
//     // console.log("check this")
//     // console.log(data)
//     const query = req.query.q;
//     // Define the search query parameters
//     const params = {
//         q: query,
//         token: api_key
//     };

//     const url = `${basePath}/search?q=${params.q}&token=${params.token}`;
//     try {
//         // Make a GET request to the FinnHub API endpoint for searching stock symbols
//         const response = await fetch(url);
//         const data = await response.json();
//         console.log(data)
//         // Do something with the data (e.g., parse the search results and return them to the frontend)
//         const searchResults = data.result.map(result => ({
//             description:    result.description,
//             displaySymbol:  result.displaySymbol,
//             symbol:         result.symbol,
//             type:           result.type
//         }));
            
//         res.json(searchResults);
//       } catch (error) {
//         // Handle the error
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//       }
//     };


    // if (!response.ok) {
    //   const message = `An error has occured: ${response.status}`;
    //   console.log("here2")
    //   console.log(message)
    //   throw new Error(message);
    // }
    // return data;



// Stock candles
// const stockCandles = (req, res)=> {
//     finnhubClient.stockCandles("AAPL", "D", 1590988249, 1591852249, (error, data, response) => {
//         res.json(data);
//     });
// }


//Company News
// const companyNews = (req, res)=> {
//     finnhubClient.companyNews("AAPL", "2020-01-01", "2020-05-01", (error, data, response) => {
//         if (error) {
//             return res.json(error);
//         } else {
//             return res.json(data)
//         }
//     });
// }

// Stock Symbols
// US and CN
// const stockSymbols = (req, res) => {
//     finnhubClient.stockSymbols("US", "XNYS", (error, data, response) => {
//         if (error) {
//             return res.json(error);
//         } else {
//             return res.json(data[0]);
//         }
//     });
// }

