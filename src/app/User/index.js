const model = require("./User.model");
const resolvers = require("./User.resolvers");
const queries = require("./User.queries");
const test = require("./User.spec");

module.exports = {
  model,
  resolvers,
  queries,
  test
};
