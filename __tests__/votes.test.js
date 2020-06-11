const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');

const User = require('../lib/models/User');
const Organization = require('../lib/models/Organization');
const Membership = require('../lib/models/Membership');
const Poll = require('../lib/models/Poll');
const Vote = require('../lib/models/Vote');


describe('vote routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let organization;
  let user;
  let poll;

  beforeEach(async() => {
    organization = await Organization.create({
      name: 'People Power Party (PPP)',
      title: 'community organization',
      description: ['community led, funded, and supported'],
      imageURL: 'image1.com'
    });

    user = await User.create({
      name: 'Briseida',
      phone: '111-222-3344',
      email: 'bp@gmail.com',
      communicationMedium: ['phone'],
      imageURL: 'imageB.com'
    });

    poll = await Poll.create({
      organization: organization._id,
      title: 'Free Medical Services for Grades K-12',
      description: 'reallocates police funding and applies it to free healthcare for all public school students',
      option: ['Yes', 'No', 'Undecided'],
      imageURL: 'image1.com'
    });

  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('creates a vote via POST', () => {
    return request(app)
      .post('/api/v1/votes')
      .send({
        poll: poll._id,
        user: user._id,
        option: 'Yes'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          poll: poll.id,
          user: user.id,
          option: 'Yes',
          __v: 0
        });
      });
  });

  it('gets all votes by poll via GET', () => {
    return Vote.create({
      poll: poll._id,
      user: user._id,
      option: 'Yes'
    })
      .then(() => request(app).get(`/api/v1/votes?poll=${poll.id}`))
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.anything(),
          user: {
            _id: user.id
          },
          poll: poll.id,
          option: 'Yes',
          __v:0

        }]);
      });
  });

  it('gets all votes by user via GET', () => {
    return Vote.create({
      poll: poll._id,
      user: user._id,
      option: 'Yes'
    })
      .then(() => request(app).get(`/api/v1/votes?user=${user.id}`))
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.anything(),
          user: {
            _id: user.id
          },
          poll: poll.id,
          option: 'Yes',
          __v:0
          
        }]);
      });
  });




  // it('can get all the users part of an organization via GET', async() => {
  //   await Membership.create({
  //     organization: organization._id,
  //     user: user._id
  //   });
  //   return request(app).get(`/api/v1/memberships?organization=${organization._id}`)
  //     .then(res => {
  //       expect(res.body).toEqual([{ 
  //         '__v': 0, 
  //         '_id': expect.anything(), 
  //         'organization': { '_id': expect.anything(), 'title': 'community organization', 'imageURL': 'image1.com'  }, 
  //         'user': { '_id': expect.anything(), 'name': 'Briseida', 'imageURL': 'imageB.com' } }]
  //       );
  //     });
  // });

  // it('can get all the organizations the user is a part of via GET', async() => {
  //   await Membership.create({
  //     organization: organization._id,
  //     user: user._id
  //   });
  //   return request(app).get(`/api/v1/memberships?user=${user._id}`)
  //     .then(res => {
  //       expect(res.body).toEqual([{ 
  //         '__v': 0, 
  //         '_id': expect.anything(), 
  //         'organization': { '_id': expect.anything(), 'title': 'community organization', 'imageURL': 'image1.com'  }, 
  //         'user': { '_id': expect.anything(), 'name': 'Briseida', 'imageURL': 'imageB.com' } }]
  //       );
  //     });
  // });

  // it('deletes a membership DELETE', () => {
  //   return Membership.create({
  //     organization: organization._id,
  //     user: user._id
  //   })
  //     .then(member => request(app).delete(`/api/v1/memberships/${member.id}`))
  //     .then(res => {
  //       expect(res.body).toEqual({
  //         _id: expect.anything(),
  //         organization: organization.id,
  //         user: user.id,
  //         __v: 0
  //       });
  //     });
  // });
});
