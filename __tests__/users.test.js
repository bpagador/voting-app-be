const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');

require('dotenv').config();


describe('user-voting-app-be routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let user;

  beforeEach(async() => {
    user = await User.create({
      name: 'Briseida',
      phone: '111-222-3344',
      email: 'bp@gmail.com',
      password: 'testpassword',
      communicationMedium: ['phone'],
      imageURL: 'imageB.com'
    });
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('can sign up a new user via POST', () => {
    return request(app)
      .post('/api/v1/users/signup')
      .send({
        name: 'Briseida',
        phone: '111-222-3344',
        email:'bp@gmail.com',
        password: 'testpassword',
        communicationMedium: ['phone'],
        imageURL: 'imageB.com'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'Briseida',
          phone: '111-222-3344',
          email:'bp@gmail.com',
          communicationMedium: ['phone'],
          imageURL: 'imageB.com',
          __v: 0
        });
      });
  });

  it('can login a user via POST', async() => {

    return request(app)
      .post('/api/v1/users/login')
      .send({
        email:'bp@gmail.com',
        password: 'testpassword'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'Briseida',
          phone: '111-222-3344',
          email:'bp@gmail.com',
          communicationMedium: ['phone'],
          imageURL: 'imageB.com',
          __v: 0
        });
      });
  });

  it('can verify a user via GET', () => {
    const agent = request.agent(app);

    return agent
      .post('/api/v1/users/login')
      .send({
        email:'bp@gmail.com',
        password: 'testpassword'
      })
      .then(() => {
        return agent
          .get('/api/v1/users/verify');
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: user.id,
          name: 'Briseida',
          phone: '111-222-3344',
          email:'bp@gmail.com',
          communicationMedium: ['phone'],
          imageURL: 'imageB.com',
          __v: 0
        });
      });
  });


  it('gets user info and all organizations they are a part of by id via GET', () => {
    const agent = request.agent(app);

    return agent
      .post('/api/v1/users/login')
      .send({
        email:'bp@gmail.com',
        password: 'testpassword'
      })
      .then(() => agent
        .get(`/api/v1/users/${user._id}`)
      )
      .then(res => {
        expect(res.body).toEqual({
          _id: user.id,
          name: 'Briseida',
          phone: '111-222-3344',
          memberships: [], //gets organizations bc membership holds orgs
          email:'bp@gmail.com',
          communicationMedium: ['phone'],
          imageURL: 'imageB.com',
          __v: 0
        });
      });
  });

  it('updates user info by its id via PATCH', () => {
    const agent = request.agent(app);

    return agent
      .post('/api/v1/users/login')
      .send({
        email:'bp@gmail.com',
        password: 'testpassword'
      })
      .then(() => agent
        .patch(`/api/v1/users/${user._id}`)
        .send({ name: 'Bob' })
      )
      .then(res => {
        expect(res.body).toEqual({
          _id: user.id,
          name: 'Bob',
          phone: '111-222-3344',
          email:'bp@gmail.com',
          communicationMedium: ['phone'],
          imageURL: 'imageB.com',
          __v: 0
        });
      });
  });

  it('deletes a user by its id via DELETE', () => {
    const agent = request.agent(app);

    return agent
      .post('/api/v1/users/login')
      .send({
        email:'bp@gmail.com',
        password: 'testpassword'
      })
      .then(() => agent
        .delete(`/api/v1/users/${user._id}`)
      )
      .then(res => {
        expect(res.body).toEqual({
          _id: user.id,
          name: 'Briseida',
          phone: '111-222-3344',
          email:'bp@gmail.com',
          communicationMedium: ['phone'],
          imageURL: 'imageB.com',
          __v: 0
        });
      });
  });
});
