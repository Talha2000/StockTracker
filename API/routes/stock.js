const express = require('express');
const router = express.Router();
const {saveStock, getStocks} = require('../controllers/stockController')
const {protect} = require('../Middleware/authMiddleware')

router.post("/saveStock", protect, saveStock);
router.get("/getStocks", protect, getStocks);

// router.get("/test", stockC);
// router.route('/searchResults').get(searchResults);
// router.route('/stockCandles').get(stockCandles);
// router.route('/stockSymbols').get(stockSymbols);

// router.post("/login", login);
// router.post("/logout", logout);


module.exports = router;