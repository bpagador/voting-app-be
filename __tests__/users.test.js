const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');


describe('user-voting-app-be routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('gets user info by id via GET', () => {
    return User.create({
      name: 'Briseida',
      phone: '111-222-3344',
      email: 'bp@gmail.com',
      communicationMedium: ['phone'],
      imageURL: 'imageB.com'
    })
      .then(user => request(app).get(`/api/v1/users/${user._id}`))
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'Briseida',
          phone: '111-222-3344',
          email: 'bp@gmail.com',
          communicationMedium: ['phone'],
          imageURL: 'imageB.com',
          __v: 0
        });
      });
  });

  it('updates user info by its id via PATCH', () => {
    return User.create({
      name: 'Briseida',
      phone: '111-222-3344',
      email: 'bp@gmail.com',
      communicationMedium: ['phone'],
      imageURL: 'imageB.com'
    })

      .then(user => {
        return request(app)
          .patch(`/api/v1/users/${user._id}`)
          .send({ 
            name: 'Bob', 
            email: 'bob@bob.com' });
      })

      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'Bob',
          phone: '111-222-3344',
          email: 'bob@bob.com',
          communicationMedium: ['phone'],
          imageURL: 'imageB.com',
          __v: 0
        });
      });
  });

  it('deletes a user by its id via DELETE', () => {
    return User.create({
      name: 'Bob',
      phone: '111-222-3344',
      email: 'bob@bob.com',
      communicationMedium: ['phone'],
      imageURL: 'imageB.com'
    })

      .then(user => request(app).delete(`/api/v1/users/${user._id}`))
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'Bob',
          phone: '111-222-3344',
          email: 'bob@bob.com',
          communicationMedium: ['phone'],
          imageURL: 'imageB.com',
          __v: 0
        });
      });
  });
  // little comment to test ssh key
});
