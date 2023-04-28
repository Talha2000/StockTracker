const jwt = require('jsonwebtoken');

// Middleware function to authenticate token
const protect = (req, res, next) => {
    // with the current http request sent to the API
    // check the access_token which has the cookie stored in it.\
    // This cookie was signed with JWT stuff
    const token = req.headers.authorization?.split(' ')[1]; // Get the token from the authorization header
    console.log("Protect was called with token: " + token);
    // if we have an authheader, then return the split. Otherwise null
    // const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
      console.log("Token is null, this is the req: " + req.body)
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
      req.user = decoded;
      console.log("this is the req.user: " + req.user)
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };


    // try {
    //   jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    //     if (err) return res.sendStatus(403)
    //     req.user = user;
    //     console.log("this is the req.user" + req.user)
    //     next();
    //     // next();
    //   });
    //   // req.user = decoded;
    // } catch (err) {
    //   return res.status(401).json({ message: 'Invalid token' });
    // }

module.exports = {
    protect,
}