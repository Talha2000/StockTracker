const jwt = require('jsonwebtoken');

// Middleware function to authenticate token
const protect = (req, res, next) => {
    // with the current http request sent to the API
    // check the access_token which has the cookie stored in it.\
    // This cookie was signed with JWT stuff
    const token = req.cookies.access_token;
    console.log("this is the current users token" + token);

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      const decoded = jwt.verify(token, 'cookie');
      req.user = decoded;
      console.log("this is the req.user" + req.user.id)
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };

module.exports = {
    protect,
}