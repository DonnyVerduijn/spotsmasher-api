
module.exports = ({ Model }) => {
  return class Attribute extends Model {
    static get tableName() {
      return "Attribute";
    }

    $parseDatabaseJson(json) {
      // Remember to call the super class's implementation.
      json = super.$parseDatabaseJson(json);
      // Do your conversion here.
      return {
        ...json,
        value: false
      }
    }
  }
}