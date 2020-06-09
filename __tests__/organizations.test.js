const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const Organization = require('../lib/models/Organization');


describe('voting-app-be routes', () => {
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

  it('creates an organization via POST', () => {
    return request(app)
      .post('/api/v1/organizations')
      .send({
        name: 'People Power Party (PPP)',
        title: 'community organization',
        description: 'community led, funded, and supported',
        imageURL: 'image1.com'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'People Power Party (PPP)',
          title: 'community organization',
          description: 'community led, funded, and supported',
          imageURL: 'image1.com',
          __v: 0
        });
      });
  });

  it('fails to create an organization post with bad data', () => {
    return request(app)
      .post('/api/v1/organizations')
      .send({
        name: 'People Power Party (PPP)',
        title: 'billionaires flaming trash pile of turds organization',
        description: 'community led, funded, and supported',
        imageURL: 'image1.com'
      })
      .then(res => {
        expect(res.body).toEqual({
          status: 400,
          message: 'Organization validation failed: title: `billionaires flaming trash pile of turds organization` is not a valid enum value for path `title`.'
        });
      });
  });
});
