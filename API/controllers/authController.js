const connectDB = require('../db'); // Import the MongoDB client and database instance
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/users'); // Import your User model

// change the following API calls to work with mongoDB cluster

const checkUserExists = async (email, username) => {
    try {
        // Make sure the client is connected
        if (!connectDB) {
          await connectDB.connect();
          console.log("Connected to MongoDB in checkUserExists");
        }
        const user = await User.findOne({
            $or: [
              { email: email },
              { username: username }
            ]
          });
        return user !== null;
      } catch (error) {
        console.error("Error in checkUserExists:", error);
        throw error;
      }
};

const createUser = async (username, email, password) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const newUser = new User({
      username: username,
      email: email,
      password: hash
    });  
    await newUser.save();
    console.log("User saved successfully");

};

const register = async (req, res) => {
    const { email, username, password } = req.body;
  
    try {
      const userExists = await checkUserExists(email, username);
      if (userExists) {
        return res.status(409).json("User already exists!");
      }
  
      await createUser(username, email, password);
      return res.status(200).json("User has been created!");
    } catch (err) {
      console.error(err);
      return res.status(500).json("An error occurred.", err);
    }
};

const login = async (req, res) => {
    try {
        // Make sure the client is connected
        if (!connectDB) {
            await connectDB.connect();
            console.log("Connected to MongoDB in checkUserExists");
          }

      // Check if the user exists by username
      const user = await User.findOne({ username: req.body.username });
  
      if (!user) {
        return res.status(404).json("User not found!");
      }
  
      // Check password
      const validatePassword = await bcrypt.compare(req.body.password, user.password);
  
      if (!validatePassword) {
        return res.status(400).json("Wrong username or password!");
      }
  
      // Generate a JWT token
      const token = jwt.sign({ id: user._id, username: user.username }, process.env.ACCESS_TOKEN, {
        expiresIn: '2h',
      });  
      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json("An error occurred.");
    }
};

const logout = (req, res) => {
    res.clearCookie("access_token", {
        sameSite: "none",
        secure: true
    }).status(200).json("User has been logged out.");
}

module.exports = {
    register,
    login,
    logout
}