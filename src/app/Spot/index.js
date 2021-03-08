const model = require('./Spot.model')
const resolvers = require("./Spot.resolvers");
const queries = require('./Spot.queries');
const test = require("./Spot.spec");

module.exports = {
  model,
  resolvers,
  queries,
  test,
};
