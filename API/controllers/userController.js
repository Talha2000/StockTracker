// const jwt = require('jsonwebtoken')
// const bcrypt = require('bcryptjs')
// const asyncHandler = require('express-async-handler')
// const User = require('../Models/userModel')
const asyncHandler = require('express-async-handler')

// @desc   Get user data
// @route  GET /api/users/me
// @access Private
const getMe = asyncHandler (async (req, res) => {
    console.log("getMe called " + req.user);
    res.status(200).json(req.user)
})

module.exports = {
    getMe,
    // loginUser,
    // getMe,
}