const { GraphQLScalarType: ScalarType } = require("graphql");

module.exports = () => ({
  CoordinatesScalar: new ScalarType({
    name: "CoordinatesScalar",
    description:
      "A (multidimensional) set of coordinates following x, y, z order.",
    serialize: coerceCoordinates,
    parseValue: coerceCoordinates,
    parseLiteral: parseCoordinates
  }),

  JsonScalar: new ScalarType({
    name: "JsonScalar",
    description: "Arbitrary JSON value",
    serialize: coerceObject,
    parseValue: coerceObject,
    parseLiteral: parseObject
  }),

  CRSPropertiesUnion: {
    __resolveType: value => {
      if (value.name) return "NamedCRSPropertiesObject";
      if (value.href) return "LinkedCRSPropertiesObject";
    }
  },

  GeoJSONInterface: {
    __resolveType: value => `${value.type}Object`
  },

  GeometryInterface: {
    __resolveType: value => `${value.type}Object`
  }
});

function coerceCoordinates(value) {
  return value;
}

function parseCoordinates(valueAST) {
  return valueAST.value;
}

function coerceObject(value) {
  return JSON.parse(value);
}

function parseObject(valueAST) {
  return JSON.stringify(valueAST.value);
}