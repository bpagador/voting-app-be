const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String, 
    required: true,
    maxlength: 50, 
  },
  phone: {
    type: String, 
    required: true,
    maxlength: 12,
  },
  email: {
    type: String, 
    required: true, 
    maxlength: 50,
  },
  communicationMedium: {
    type: String,
    required: true,
    enum: ['phone', 'email']
  },
  imageURL: {
    type: String, 
    required: true,
    enum: ['imageA.com', 'imageB.com']
  }

});

module.exports = mongoose.model('User', schema);
