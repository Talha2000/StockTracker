// const jwt = require('jsonwebtoken')
// const bcrypt = require('bcryptjs')
// const asyncHandler = require('express-async-handler')
// const User = require('../Models/userModel')
// const asyncHandler = require('express-async-handler')

// @desc   Get user data
// @route  GET /api/users/me
// @access Private
const getMe = (req, res) => {
    // res.status(200).json("hello");
    const { id, username } = req.user.id;
    res.status(200).json({id, username})
}

module.exports = {
    getMe,
    // loginUser,
    // getMe,
}