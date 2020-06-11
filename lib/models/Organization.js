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
// , {
//   toJSON: {
//     virtuals: true, 
//     transform: (doc, ret) => {
//       delete ret.id,
//       delete ret.__v;
//     }
//   },

//   toObject: {
//     virtuals: true
//   }
// });

// schema.virtual('polls', {
//   ref: 'Poll',
//   localField: '_id',
//   foreignField: 'organization'
// });

// schema.virtual('memberships', {
//   ref: 'Membership',
//   localField: '_id',
//   foreignField: 'organization'
// });

module.exports = mongoose.model('Organization', schema);
