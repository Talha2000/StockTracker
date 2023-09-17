const jwt = require('jsonwebtoken');

// Middleware function to authenticate token
const protect = (req, res, next) => {
    // with the current http request sent to the API
    const token = req.headers.authorization?.split(' ')[1] || null;
    if (token == null) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    console.log("this is the token in authMiddleware: ", token);
    try {
      console.log("this is the acess token in authMiddleware: ", process.env.ACCESS_TOKEN);
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