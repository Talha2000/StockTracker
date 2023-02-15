const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../Models/userModel')

// @desc   Register new user
// @route  POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const {Name, Email, Password, Role } = req.body

    if (!Name || !Email || !Password || !Role) {
        res.status(400)
        throw new Error('Please add all fields')
    }

    // Check if user exists
    const userExists = await User.findOne({Email})
    if (userExists) {
        res.status(400)
        throw new Error('User Already Exists')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10) // generate a salt
    const hashedPassword = await bcrypt.hash(Password, salt) // gives us the hashed password

    // Create User
    const user = await User.create({
        Name,
        Email,
        Password: hashedPassword,
        Role,
    })

    // check if user was created
    if (user) {
        res.status(201).json({
            _id: user.id,
            Name: user.Name,
            Email: user.Email,
            token: generateToken(user._id),
        })
    } else {
        res.status(400)
        throw new Error('Invalid User Data')
    }
})

// @desc   Authenticate a user
// @route  POST /api/users/login
// @access Public
const loginUser = asyncHandler (async (req, res) => {
    const {Email, Password} = req.body

    // check for user email
    const user = await User.findOne({Email})

    if (user && (await bcrypt.compare(Password, user.Password))) {
        res.status(201).json({
            _id: user.id,
            Name: user.Name,
            Email: user.Email,
            token: generateToken(user._id),
        })
    } else {
        res.status(400)
        throw new Error('Invalid Credentials')
    }
})

// @desc   Get user data
// @route  GET /api/users/me
// @access Private
const getMe = asyncHandler (async (req, res) => {
    // you can just use req.user to get all the paramters.
    // no need to reconstruct or destrcutre
    res.status(200).json({
        id: req.user.id,
        Name: req.user.Name,
        Email: req.user.Email,
    })
    // res.json({message : 'user Data Display'})
})

// Genereate Json web token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}


module.exports = {
    registerUser,
    loginUser,
    getMe,
}