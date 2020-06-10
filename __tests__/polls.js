const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');

// const Poll = require('../lib/models/Poll');
// const Organization = require('../lib/models/Organization');


describe('poll routes', () => {
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

  it('creates a poll via POST', () => {
    return request(app)
      .post('/api/v1/polls')
      .send({
        title: 'Free Medical Services for Grades K-12',
        description: 'reallocates police funding and applies it to free healthcare for all public school students',
        option: ['Yes, fully support']
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          title: 'Free Medical Services for Grades K-12',
          description: 'reallocates police funding and applies it to free healthcare for all public school students',
          option: ['Yes, fully support'],
          __v: 0
        });
      });
  });

  // it('fails to create an organization post with bad data', () => {
  //   return request(app)
  //     .post('/api/v1/organizations')
  //     .send({
  //       name: 'People Power Party (PPP)',
  //       title: 'billionaires flaming trash pile of turds organization',
  //       description: ['community led, funded, and supported'],
  //       imageURL: 'image1.com'
  //     })
  //     .then(res => {
  //       expect(res.body).toEqual({
  //         status: 400,
  //         message: 'Organization validation failed: title: `billionaires flaming trash pile of turds organization` is not a valid enum value for path `title`.'
  //       });
  //     });
  // });

  // it('can get all the organizations via GET', () => {
  //   return Organization.create({
  //     name: 'Redistribution United',
  //     title: 'community organization',
  //     description: ['defunds police and invests in schools and hospitals'],
  //     imageURL: 'image2.com'
  //   })
  //     .then(() => request(app).get('/api/v1/organizations'))
  //     .then(res => {
  //       expect(res.body).toEqual([{
  //         _id: expect.anything(),
  //         title: 'community organization',
  //         imageURL: 'image2.com'
  //       }]);
  //     });
  // });

  // it('gets an organization by id via GET', () => {
  //   return Organization.create({
  //     name: 'Black Leaders Alliance',
  //     title: 'leaders coalition',
  //     description: ['promotes Black leadership and initiatives'],
  //     imageURL: 'image3.com'
  //   })
  //     .then(organization => request(app).get(`/api/v1/organizations/${organization._id}`))
  //     .then(res => {
  //       expect(res.body).toEqual({
  //         _id: expect.anything(),
  //         name: 'Black Leaders Alliance',
  //         title: 'leaders coalition',
  //         description: ['promotes Black leadership and initiatives'],
  //         imageURL: 'image3.com',
  //         __v: 0
  //       });
  //     });
  // });

  // it('updates an organization by its id via PATCH', () => {
  //   return Organization.create({
  //     name: 'Environment Law Party',
  //     title: 'leaders coalition',
  //     description: ['preserves lands and natural resources'],
  //     imageURL: 'image4.com'
  //   })

  //     .then(organization => {
  //       return request(app)
  //         .patch(`/api/v1/organizations/${organization._id}`)
  //         .send({ 
  //           title: 'lawyers and bill writers', 
  //           description: ['community led, funded, and supported', 'preserves lands and natural resources'] });
  //     })

  //     .then(res => {
  //       expect(res.body).toEqual({
  //         _id: expect.anything(),
  //         name: 'Environment Law Party',
  //         title: 'lawyers and bill writers',
  //         description: ['community led, funded, and supported', 'preserves lands and natural resources'],
  //         imageURL: 'image4.com',
  //         __v: 0
  //       });
  //     });
  // });

  // it('deletes an organization by its id via DELETE', () => {
  //   return Organization.create({
  //     name: 'People Power Party (PPP)',
  //     title: 'community organization',
  //     description: ['community led, funded, and supported'],
  //     imageURL: 'image1.com'
  //   })

  //     .then(organization => request(app).delete(`/api/v1/organizations/${organization._id}`))
  //     .then(res => {
  //       expect(res.body).toEqual({
  //         _id: expect.anything(),
  //         name: 'People Power Party (PPP)',
  //         title: 'community organization',
  //         description: ['community led, funded, and supported'],
  //         imageURL: 'image1.com',
  //         __v: 0
  //       });
  //     });
  // });
});
