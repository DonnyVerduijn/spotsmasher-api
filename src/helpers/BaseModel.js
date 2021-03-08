const { Model } = require("objection");
const { parseJsonRecursively } = require('./../utils/JsonUtils')

// export a factory that returns a BaseModel class
module.exports = knex => {
  Model.knex(knex);

  return class BaseModel extends Model {

    $parseDatabaseJson(json) {
      json = super.$parseDatabaseJson(json);
      return parseJsonRecursively(json);
    }
  };
};