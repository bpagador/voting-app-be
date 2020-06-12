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
    enum: ['community organization', 'leaders coalition', 'lawyers and bill writers']
  },

  description: [{
    type: String,
    enum: ['community led, funded, and supported', 'defunds police and invests in schools and hospitals', 'promotes Black leadership and initiatives', 'preserves lands and natural resources']
  }],

  imageURL: {
    type: String,
    required: true,
    enum: ['image1.com', 'image2.com', 'image3.com', 'image4.com']
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
