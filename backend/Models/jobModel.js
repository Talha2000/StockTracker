const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema for todo
// we define the parameters and what type of constraints it has here
const JobSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        text : {
            type: String,
            required: [true, 'Please Add a text value'],
        },
    }, 
    {
        timestamps : true
    }
);


// export at end tto be able to use it
module.exports = mongoose.model('Job', JobSchema);