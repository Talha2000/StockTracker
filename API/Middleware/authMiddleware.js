const jwt = require('jsonwebtoken');

// Middleware function to authenticate token
const protect = (req, res, next) => {
    // with the current http request sent to the API
    const token = req.headers.authorization?.split(' ')[1] || null;

    // const token = req.headers.authorization?.split(' ')[1]; // Get the token from the authorization header
    // if we have an authheader, then return the split. Otherwise null
    // const token = authHeader && authHeader.split(' ')[1]
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
    protect,
}