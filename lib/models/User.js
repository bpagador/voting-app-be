const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const schema = new mongoose.Schema({
  name: {
    type: String, 
    required: true,
    maxlength: 50, 
  },

  phone: {
    type: String, 
    required: true,
    maxlength: 15,
  },

  email: {
    type: String, 
    required: true, 
    unique: true
  },

  passwordHash: {
    type: String, 
    required: true
  },

  communicationMedium: [{
    type: String,
    enum: ['phone', 'email']
  }],

  imageURL: {
    type: String, 
    required: true,
    // enum: ['imageA.com', 'imageB.com']
  }

}, {
  toJSON: {
    transform: (doc, ret) => {
      delete ret.id,
      delete ret.passwordHash;
    }
  }
});

schema.virtual('memberships', {
  ref: 'Membership',
  localField: '_id',
  foreignField: 'user' 
});

schema.virtual('organizations', {
  ref: 'Organization',
  localField: '_id',
  foreignField: 'user'
});

schema.virtual('password').set(function(password) {
  this.passwordHash = bcrypt.hashSync(password, +process.env.SALT_ROUNDS || 8);
});

schema.statics.authorize = function(email, password) {
  return this.findOne({ email })
    .then(user => {
      if(!user) {
        throw new Error('Invalid email/password');
      }

      if(!bcrypt.compareSync(password, user.passwordHash)) {
        throw new Error('Invalid email/password');
      }

      return user;
    });
};

schema.statics.verifyToken = function(token) {
  const { sub } = jwt.verify(token, process.env.APP_SECRET);
  return this.hydrate(sub);
};

schema.methods.authToken = function() {
  return jwt.sign({ sub: this.toJSON() }, process.env.APP_SECRET, {
    expiresIn: '24h'
  });
};


module.exports = mongoose.model('User', schema);
