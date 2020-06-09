const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50
    // enum: ['People Power Party', 'Restribution United', 'Black Leaders Alliance', 'Environment Law Party']
  },
    
  title: {
    type: String,
    required: true,
    enum: ['community organization', 'leaders coalition', 'lawyers and bill writers']
  },

  description: {
    type: String,
    required: true,
    enum: ['community led, funded, and supported', 'defunds police and invests in schools and hospitals', 'promotes Black leadership and initiatives', 'preserves lands and natural resources']
  },

  imageURL: {
    type: String,
    required: true,
    maxlength: 200,
    enum: ['image1.com', 'image2.com', 'image3.com', 'image4.com']
  }
});

module.exports = mongoose.model('Organization', schema);
