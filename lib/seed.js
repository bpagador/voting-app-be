require('dotenv').config();
require('../lib/utils/connect');
const mongoose = require('mongoose');
const chance = require('chance').Chance();


const Organization = require('../lib/models/Organization');
const Membership = require('../lib/models/Membership');
const User = require('../lib/models/User');
const Vote = require('../lib/models/Vote');
const Poll = require('../lib/models/Poll');


const seedData = async({ orgsCount = 5, usersCount = 10, membsCount = 3, votesCount = 5, pollsCount = 10 } = {}) => {
  const createdOrg = await Organization.create([...Array(orgsCount)].map(() => ({
    title: chance.word(),
    description: chance.sentence(),
    imageURL: chance.url()
  })));

  const phoneOrEmail = ['phone', 'email'];

  const createdUser = await User.create([...Array(usersCount)].map(() => ({
    name: chance.name(),
    email: chance.word(),
    phone: chance.phone(),
    communicationMedium: chance.pickone(phoneOrEmail),
    imageURL: chance.url()
  })));

  const yesOrNo = ['yes', 'no'];

  const createdPoll = await Poll.create([...Array(pollsCount)].map(() => ({
    organization: chance.pickone(createdOrg)._id,
    title: chance.word(),
    description: chance.sentence(),
    option: yesOrNo
  })));

  await Vote.create([...Array(votesCount)].map(() => ({
    poll: chance.pickone(createdPoll)._id,
    user: chance.pickone(createdUser)._id,
    option: chance.pickone(yesOrNo)
  })));

  await Membership.create([...Array(membsCount)].map(() => ({
    organization: chance.pickone(createdOrg)._id,
    user: chance.pickone(createdUser)._id
  })));
};

seedData()
  .then(() => mongoose.connection.close());

module.exports = seedData;
