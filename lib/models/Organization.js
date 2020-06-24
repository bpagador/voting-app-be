const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50
  },
    
  title: {
    type: String,
    required: true,
  },

  description: [{
    type: String,
  }],

  imageURL: {
    type: String,
    required: true,
  }

});

// virtual polls
schema.virtual('polls', {
  ref: 'Poll',
  localField: '_id',
  foreignField: 'organization'
});

// virtual membership

schema.virtual('memberships', {
  ref: 'Membership',
  localField: '_id',
  foreignField: 'organization'
});
// organization by id tests will fail

schema.statics.deleteOrganizationPolls = async function(id) {
  const Poll = this.model('Poll');
  const polls = await Poll.find({ organization: id });

  const deletePollPromises = polls.map(poll => Poll.deletePollVotes(poll._id));

  return Promise.all([
    this.findByIdAndDelete(id),
    ...deletePollPromises
  ])
    .then(([organization]) => organization);
};

module.exports = mongoose.model('Organization', schema);
