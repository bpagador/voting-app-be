const mongoose = require('mongoose');

const schema = new mongoose.Schema({

  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
    
  title: {
    type: String,
    required: true,
    maxlength: 100
  },

  description: [{
    type: String,
    required: true,
    maxlength: 200
  }],

  option: [String]
  
});

module.exports = mongoose.model('Organization', schema);
