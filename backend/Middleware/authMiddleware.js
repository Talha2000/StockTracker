const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../Models/userModel')

const protect = asyncHandler(async(req, res, next) => {
    let token
    console.log("protect called ")

    // In Http headers, we have an authorization token
    // req.headers.authorization &&  req.headers.authorization.startsWith('Bearer')
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    )   {
        try {
            // get the token from Bearer header
            token = req.headers.authorization.split(" ")[1]

            // verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Get user from the token, this matches the id related to the user that was created
            req.user = await User.findById(decoded.id).select('-password')
            next() // call next piece of middleware
        } catch (error) {
            res.status(401) // not authorized
            throw new Error('Not Authorized')
        }
    }
    if (!token) {
        res.status(401)
        throw new Error('Not Authorized, No token')
    }
    // res.status(400).json('Header Authorization failed')
})

module.exports = {
    protect,
}

// written like this 
// Bearer (token)
// Bearer token, split this into an array