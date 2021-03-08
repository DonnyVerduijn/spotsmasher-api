module.exports = ({ models }) => {
    return {
      async getById({ id }) {
        const query = models.User.query()
          .select("*")
          .getByid(id)
          .first()
          .eager("unlockedSpots")
  
        return await query;
      }
    };
  };
  