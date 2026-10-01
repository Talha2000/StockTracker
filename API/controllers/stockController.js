const prisma = require('../db');

const saveStock = async (req, res) => {
  const userId = req.user.id;
  const stockSymbol = req.body.symbol;

  try {
    if (!stockSymbol) {
      return res.status(409).json("Stock is undefined or null");
    }

    await prisma.watchlist.upsert({
      where: { userId_stockSymbol: { userId, stockSymbol } },
      update: {},
      create: { userId, stockSymbol },
    });
    return res.status(200).json({ message: `Stock: ${stockSymbol} for user: ${userId} saved successfully` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "An error occurred.", error: err.message });
  }
};

const removeStock = async (req, res) => {
  const userId = req.user.id;
  const stockSymbol = req.body.symbol;

  try {
    if (!userId) {
      return res.status(409).json({ message: "User not found." });
    }

    await prisma.watchlist.deleteMany({ where: { userId, stockSymbol } });
    return res.status(200).json({ message: `Stock: ${stockSymbol} for user: ${userId} removed successfully` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "An error occurred.", error: err.message });
  }
};

const getStocks = async (req, res) => {
  const userId = req.user.id;
  try {
    const stocks = await prisma.watchlist.findMany({
      where: { userId },
      select: { id: true, stockSymbol: true },
    });
    return res.status(200).json(stocks);
  } catch (err) {
    console.error('Error finding stocks:', err);
    return res.status(500).json({ message: "An error occurred.", error: err.message });
  }
};

module.exports = {
  saveStock,
  removeStock,
  getStocks,
};
