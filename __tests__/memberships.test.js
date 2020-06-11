const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');

const User = require('../lib/models/User');
const Organization = require('../lib/models/Organization');
const Membership = require('../lib/models/Membership');


describe('membership routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let organization;
  let user;

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
  });


  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('creates a membership via POST', () => {
    return request(app)
      .post('/api/v1/memberships')
      .send({
        organization: organization._id,
        user: user._id
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          organization: organization.id,
          user: user.id,
          __v: 0
        });
      });
  });

  it('can get all the users part of an organization via GET', async() => {
    await Membership.create({
      organization: organization._id,
      user: user._id
    });
    return request(app).get(`/api/v1/memberships?organization=${organization._id}`)
      .then(res => {
        expect(res.body).toEqual([{ 
          '__v': 0, 
          '_id': expect.anything(), 
          'organization': { '_id': expect.anything(), 'title': 'community organization', 'imageURL': 'image1.com'  }, 
          'user': { '_id': expect.anything(), 'name': 'Briseida', 'imageURL': 'imageB.com' } }]
        );
      });
  });

  it('can get all the organizations the user is a part of via GET', async() => {
    await Membership.create({
      organization: organization._id,
      user: user._id
    });
    return request(app).get(`/api/v1/memberships?user=${user._id}`)
      .then(res => {
        expect(res.body).toEqual([{ 
          '__v': 0, 
          '_id': expect.anything(), 
          'organization': { '_id': expect.anything(), 'title': 'community organization', 'imageURL': 'image1.com'  }, 
          'user': { '_id': expect.anything(), 'name': 'Briseida', 'imageURL': 'imageB.com' } }]
        );
      });
  });

  it('deletes a membership DELETE', () => {
    return Membership.create({
      organization: organization._id,
      user: user._id
    })
      .then(member => request(app).delete(`/api/v1/memberships/${member.id}`))
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          organization: organization.id,
          user: user.id,
          __v: 0
        });
      });
  });
});
