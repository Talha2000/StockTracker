const asyncHandler = require('express-async-handler');

// importing the model from Models directory
const Job = require('../Models/jobModel');
const User = require('../Models/userModel');


// Think of these as functions
const getJob = asyncHandler(async (req, res) => {
    const job = await Job.find({ user: req.user.id })
    res.status(200).json(job)
})

const setJob = asyncHandler(async (req, res) => {
    if(!req.body.text) {
        res.status(400)
        throw new Error('Please add a text field')
    }
    const job = await Job.create({
        text: req.body.text,
        user: req.user.id,
    })
    res.status(200).json(job)
})

const updateJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id)
    // const job = await Job.findById(req.user.id)
    if(!job) {
        res.status(400)
        throw new Error('User Not Found')
    }
        // const updatedJob = await Job.findByIdAndUpdate(req.user.id, req.body, {
    const user = await User.findById(req.user.id)
    // check for user
    if (!user) {
        res.status(401)
        throw new Error('User Not Found')
    }

    // make sure the logged in user matches the job user
    if(job.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User Not Authorized')
    }
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })
    res.status(200).json(updatedJob)
})

const deleteJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id)
    if(!job) {
        res.status(400)
        throw new Error('Job Not Found')
    }

    console.log("checked job")
    const user = await User.findById(req.user.id)
    console.log("this is the user " + user)
    // check for user
    if (!user) {
        res.status(401)
        throw new Error('User Not Found')
    }
    console.log("checked user")

    // make sure the logged in user matches the job user
    if(job.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User Not Authorized')
    }

    await job.remove()
    res.status(200).json({id : req.params.id})
})

module.exports = {
    getJob, setJob, updateJob, deleteJob
}

// when we have a route, we want to be able to protect it and will have to login, get the token and send the token into the headers to access the route


// we authenticate by going against the database and making sure we have the correct email and password
// Then we authorize by sending the right token to the correct route

