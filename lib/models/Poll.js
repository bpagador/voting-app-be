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

  description: {
    type: String,
    required: true,
    maxlength: 200
  },

  option: [String],

  imageURL: {
    type: String,
    required: true
  }
}, {

  toJSON: {
    virtuals: true, 
    transform: (doc, ret) => {
      delete ret.id;

    }

  },

  toObject: {
    virtuals: true
  }

});

schema.virtual('votes', {
  ref: 'Vote',
  localField: '_id',
  foreignField: 'poll',
  count: true
});

schema.statics.deletePollVotes = function(id) {
  return Promise.all([
    this.findByIdAndDelete(id),
    this.model('Vote').deleteMany({ poll: id })
  ])
    .then(([poll]) => poll);
};

module.exports = mongoose.model('Poll', schema);

