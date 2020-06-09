const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: {
    type: String, 
    required: true, 
    maxlength: 500,
    enum: ['People Power Party', 'Restribution United', 'Black Leaders Alliance', 'Environment Law Party']
  },

  description: {
    type: String, 
    required: true,
    maxlength: 500,
    enum: ['community led and supported', 'defunds police and invests in schools and hospitals', 'promotes Black leadership and initiatives', 'preserves lands and natural resources'] 
  },

  imageURL: {
    type: String, 
    required: true,
    maxlength: 500,
    enum: ['image1.com', 'image2.com', 'image3.com', 'image4.com']
  }
});

module.exports = mongoose.model('Organization', schema);
