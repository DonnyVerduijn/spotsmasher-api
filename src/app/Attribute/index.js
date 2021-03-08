const model = require('./Attribute.model')
const resolvers = require("./Attribute.resolvers");
const queries = require("./Attribute.queries");
const test = require("./Attribute.spec");

module.exports = {
  model,
  resolvers,
  queries,
  test
};
