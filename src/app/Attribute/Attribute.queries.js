module.exports = ({ models }) => {
  return {
    async list() {
      const query = models.Attribute.query().select();
      return query;
    },
    getById() { return {} },
    update() { return {} },
    insert() { return {} },
    delete() { return {} },
  };
};
