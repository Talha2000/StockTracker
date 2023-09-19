const jwt = require('jsonwebtoken');

// Middleware function to authenticate token
const protect = (req, res, next) => {
    // with the current http request sent to the API
    const token = req.headers.authorization?.split(' ')[1] || null;
    if (token == null) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
      req.user = decoded;
      next();
    } catch (err) {
      console.log("There is an error ")
      return res.status(401).json({ message: 'Invalid token' });
    }
  };

module.exports = {
    protect
}