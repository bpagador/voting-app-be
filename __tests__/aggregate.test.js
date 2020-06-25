  
require('dotenv').config();
const connect = require('../lib/utils/connect');


const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../lib/app');
const agent = request.agent(app);

const seedData = require('../lib/seed');
const User = require('../lib/models/User');

beforeAll(async() => {
  const uri = await mongod.getUri();
  return connect(uri);
});
  
beforeEach(() => {
  return mongoose.connection.dropDatabase();
});
  
beforeEach(() => {
  return seedData({});
});

// test




