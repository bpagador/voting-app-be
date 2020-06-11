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
  beforeEach(async() => {
    organization = await Organization.create({
      name: 'People Power Party (PPP)',
      title: 'community organization',
      description: ['community led, funded, and supported'],
      imageURL: 'image1.com'
    });
  });

  let user;
  beforeEach(async() => {
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

  it.only('can get all the users in an organization by id via GET', async() => {
    await Membership.create([{
      organization: organization._id,
      user: user._id
    }, {
      organization: organization._id,
      user: user._id
    }
    ]);
    return request(app).get(`/api/v1/memberships?organization=${organization.id}`)
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.anything
        }]);
      });
  });

  it('gets a poll by id via GET', () => {
    return Poll.create({
      organization: organization._id,
      title: 'Free Medical Services for Grades K-12',
      description: 'reallocates police funding and applies it to free healthcare for all public school students',
      option: ['Yes, fully support'],
      imageURL: 'image1.com'
    })
      .then(poll => request(app).get(`/api/v1/polls/${poll._id}`))
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          organization: {
            _id: organization.id,
            name: 'People Power Party (PPP)'
          },
          title: 'Free Medical Services for Grades K-12',
          description: 'reallocates police funding and applies it to free healthcare for all public school students',
          option: ['Yes, fully support'],
          imageURL: 'image1.com',
          __v: 0
        });
      });
  });

  it('updates a poll by its id via PATCH', () => {
    return Poll.create({
      organization: organization._id,
      title: 'Free Medical Services for Grades K-12',
      description: 'reallocates police funding and applies it to free healthcare for all public school students',
      option: ['Yes, fully support'],
      imageURL: 'image1.com'
    })

      .then(poll => {
        return request(app)
          .patch(`/api/v1/polls/${poll._id}`)
          .send({ 
            title: 'Mental Health Subsidies in the Workplace', 
            description: '$500 subsidy towards mental health for every uninsured ' });
      })

      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          organization: organization.id,
          title: 'Mental Health Subsidies in the Workplace', 
          description: '$500 subsidy towards mental health for every uninsured ',
          option: ['Yes, fully support'],
          imageURL: 'image1.com',
          __v: 0
        });
      });
  });

  it('deletes a poll by its id via DELETE', () => {
    return Poll.create({
      organization: organization._id,
      title: 'Free Medical Services for Grades K-12',
      description: 'reallocates police funding and applies it to free healthcare for all public school students',
      option: ['Yes, fully support'],
      imageURL: 'image1.com'
    })

      .then(poll => request(app).delete(`/api/v1/polls/${poll._id}`))
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          organization: organization.id,
          title: 'Free Medical Services for Grades K-12',
          description: 'reallocates police funding and applies it to free healthcare for all public school students',
          option: ['Yes, fully support'],
          imageURL: 'image1.com',
          __v: 0
        });
      });
  });
});
