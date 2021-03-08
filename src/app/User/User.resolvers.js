module.exports = ({ User }) => ({
    Query: {
      user: (obj, { input }) => {
        return User.getById(input);
      },
    },
    Mutation: {
      createUser: (obj, { input }) => {
        return User.insert(input);
      },
      deleteUser: (obj, { input }) => {
        return User.delete(input);
      },
      editUser: (obj, { input }) => {
        return User.update(input);
      }
    }
  });
  