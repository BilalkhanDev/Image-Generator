const mongoose = require('mongoose');
const validator = require('validator');
// Define the schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        return validator.isEmail(value);
      },
      message: 'Invalid email address'
    }
  },
  password: {
    type: String,
    required: true
  },
  postId:{
    type: mongoose.Types.ObjectId, ref: 'Post'
  }
});

// Create the User model
const  User = mongoose.model('User', userSchema);
module.exports=User
