const express = require('express');
const router = express.Router();
const {registerUser, loginUser, getMe} = require('../Controllers/userController')
const {protect} = require('../Middleware/authMiddleware')


router.post('/users', registerUser)
router.post('/users/login', loginUser)
router.get('/users/me', protect, getMe)


module.exports = router;