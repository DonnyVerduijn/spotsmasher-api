
module.exports = ({ Attribute }) => ({
  Query: {
    attribute: (_, { args, fields }) => {
      return Attribute.getById(fields, args);
    },
    attributes: () => {
      return Attribute.list();
    }
  },
  Mutation: {
    updateAttribute: (_, { args, fields }) => {
      return Attribute.update(fields, args);
    },
    createAttribute: (_, { args, fields }) => {
      return Attribute.insert(fields, args);
    },
    deleteAttribute: (_, { args, fields }) => {
      return Attribute.delete(fields, args);
    }
  }
});
