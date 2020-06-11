const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');

const Poll = require('../lib/models/Poll');
const Organization = require('../lib/models/Organization');


describe('poll routes', () => {
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

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('creates a poll via POST', () => {
    return request(app)
      .post('/api/v1/polls')
      .send({
        organization: organization._id,
        title: 'Free Medical Services for Grades K-12',
        description: 'reallocates police funding and applies it to free healthcare for all public school students',
        option: ['Yes, fully support']
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          organization: organization.id,
          title: 'Free Medical Services for Grades K-12',
          description: 'reallocates police funding and applies it to free healthcare for all public school students',
          option: ['Yes, fully support'],
          __v: 0
        });
      });
  });

  it('can get all the polls via GET', () => {
    return Poll.create({
      organization: organization._id,
      title: 'Free Medical Services for Grades K-12',
      description: 'reallocates police funding and applies it to free healthcare for all public school students',
      option: ['Yes, fully support']
    })
      .then(() => request(app).get('/api/v1/polls'))
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.anything(),
          title: 'Free Medical Services for Grades K-12',
        }]);
      });
  });

  it('gets a poll by id via GET', () => {
    return Poll.create({
      organization: organization._id,
      title: 'Free Medical Services for Grades K-12',
      description: 'reallocates police funding and applies it to free healthcare for all public school students',
      option: ['Yes, fully support']
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
    })

      .then(poll => request(app).delete(`/api/v1/polls/${poll._id}`))
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          organization: organization.id,
          title: 'Free Medical Services for Grades K-12',
          description: 'reallocates police funding and applies it to free healthcare for all public school students',
          option: ['Yes, fully support'],
          __v: 0
        });
      });
  });
});
