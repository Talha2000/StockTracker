const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema for todo
// we define the parameters and what type of constraints it has here
const UserSchema = new Schema({
  FirstName : {
    type: String,
    required: [true, 'The FirstName text field is required'],
  },
  LastName : {
    type: String,
    required: [true, 'The LastName text field is required'],
  },
}, {
    timestamps : true
}
);

// name the model with the created schema
const Users = mongoose.model('Users', UserSchema);

// export at end tto be able to use it
module.exports = Users;