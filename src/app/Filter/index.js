const model = require('./Filter.model')
const resolvers = require("./Filter.resolvers");
const queries = require('./Filter.queries');
const test = require("./Filter.spec");

module.exports = {
  model,
  resolvers,
  queries,
  test,
};
