const express = require('express');
const router = express.Router();
const {getMe} = require('../controllers/userController')
const {protect} = require('../Middleware/authMiddleware')

router.get('/me', protect, getMe)
// router.get("/users", (req, res) => {
//     res.json("hello this is the backend")
//   })
// router.post('/users/login', loginUser)
// router.get('/users/me', protect, getUser)

module.exports = router;