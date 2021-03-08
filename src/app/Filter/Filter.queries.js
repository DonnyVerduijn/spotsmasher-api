module.exports = ({ models }) => {
  return {
    async getByName(name) {
      const query = models.Filter.query()
        .select("*")
        .where("name", name)
        .first()
        .eager("attributes")

      return await query;
    }
  };
};
