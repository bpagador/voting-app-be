const voteCount = [
  {
    '$project': {
      'option': '$option'
    }
  }, {
    '$group': {
      '_id': '$option', 
      'count': {
        '$sum': 1
      }
    }
  }, {
    '$group': {
      '_id': null, 
      'count': {
        '$sum': '$count'
      }, 
      'totalOptions': {
        '$push': {
          'count': '$count', 
          'defOptions': '$_id'
        }
      }
    }
  }
];

module.exports = {
  voteCount
};
