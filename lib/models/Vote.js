const mongoose = require('mongoose');
const { voteCount } = require('../aggregate');

const schema = new mongoose.Schema({

  poll: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Poll',
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
    
  option: {
    type: String,
    required: true,
  }

});

schema.statics.voteCount = function() {
  return this.aggregate(voteCount);
};

module.exports = mongoose.model('Vote', schema);

