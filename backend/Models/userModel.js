const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema for todo
// we define the parameters and what type of constraints it has here
const UserSchema = new Schema({
  Name : {
    type: String,
    required: [true, 'Please Add a Name'],
  },
  Email : {
    type: String,
    unique: true,
    required: [true, 'Please Add an Email'],
  },
  Password : {
    type: String,
    required: [true, 'Please Add a Password'],
  },
  Role : {
    type: String,
    required: [true, 'Please Add a Role'],
  },
}, {
    timestamps : true
}
);

// name the model with the created schema
// const Users = mongoose.model('User', UserSchema);

// export at end tto be able to use it
module.exports = mongoose.model('User', UserSchema);