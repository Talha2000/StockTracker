const express = require('express');
const router = express.Router();
const {getJob, setJob, updateJob, deleteJob} = require('../Controllers/jobController')

// router.get("/home", (req, res) => {
//   res.json({message: "Get worked"})
// })
const {protect} = require('../Middleware/authMiddleware')

router.route('/job').get(protect, getJob).post(protect, setJob);
router.route('/job/:id').put(protect, updateJob).delete(protect, deleteJob);

// router.get("/home", getUsers)

// router.post("/home", (req, res) => {
//   res.json({message: "Post worked"})
// })

// router.put("/home/:id", (req, res) => {
//   res.json({message: `Update worked ${req.params.id}` })
// })

// router.delete("/home/:id", (req, res) => {
//   res.json({message: `Delete worked ${req.params.id}`})
// })

module.exports = router;


// router.get('/todos', (req, res, next) => {
//   // This will return all the data, exposing only the id and action field to the client
//   Todo.find({}, 'action')
//     .then((data) => res.json(data))
//     .catch(next);
// });

// router.post('/todos', (req, res, next) => {
//   if (req.body.action) {
//     Todo.create(req.body)
//       .then((data) => res.json(data))
//       .catch(next);
//   } else {
//     res.json({
//       error: 'The input field is empty',
//     });
//   }
// });

// router.delete('/todos/:id', (req, res, next) => {
//   Todo.findOneAndDelete({ _id: req.params.id })
//     .then((data) => res.json(data))
//     .catch(next);
// });