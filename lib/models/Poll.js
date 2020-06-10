const mongoose = require('mongoose');

const schema = new mongoose.Schema({   
  title: {
    type: String,
    required: true,
    maxlength: 500
  },

  description: [{
    type: String,
    required: true,
    maxlength: 500
  }],
});

// schema.virtual('organization', {
//   ref: 'Organization',
//   localfield: '_id',
//   foreignField: 'poll'
// });

module.exports = mongoose.model('Poll', schema);
