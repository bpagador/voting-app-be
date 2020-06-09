const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String, 
    required: true,
    maxlength: 50, 
    enum: ['Briseida', 'Bob']
  },
  phone: {
    type: String, 
    required: true,
    maxlength: 12,
    enum: ['111-222-3344', '222-222-3344'] 
  },
  email: {
    type: String, 
    required: true, 
    maxlength: 50,
    enum: ['briseida@gmail.com', 'bob@gmail.com']
  },
  communicationMedium: {
    type: String,
    required: true,
    enum: ['phone', 'email']
  },
  imageURL: {
    type: String, 
    required: true,
    maxlength: 500,
    enum: ['imageA.com', 'imageB.com']
  }

});

module.exports = mongoose.model('User', schema);
