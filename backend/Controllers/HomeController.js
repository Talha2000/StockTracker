const asyncHandler = require('express-async-handler');

// importing the model from Models directory
const User = require('../Models/User');


// Think of these as functions
const getUsers = asyncHandler(async (req, res) => {
    const user = await User.find()
    res.status(200).json(user)
})

const setUsers = asyncHandler(async (req, res) => {
    if(!req.body.FirstName || !req.body.LastName) {
        res.status(400)
        throw new Error('Please add a text field')
    }
    const user = await User.create({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName
    })
    res.status(200).json(user)
})

const updateUsers = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    console.log(user)
    if(!user) {
        res.status(400)
        throw new Error('User Not Found')
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })
    res.status(200).json(updatedUser)
})

const deleteUsers = asyncHandler(async (req, res) => {
    
})

module.exports = {
    getUsers, setUsers, updateUsers, deleteUsers
}